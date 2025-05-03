using Entities.Models;
using Markdig;
using Markdig.Syntax.Inlines;
using Markdig.Syntax;
using markdown_note_taking_app.Server.Interfaces.ServiceInterface;
using markdown_note_taking_app.Server.Models.LanguageTool;
using Newtonsoft.Json;
using static System.Net.Mime.MediaTypeNames;
using Markdig.Renderers.Normalize;
using Markdig.Helpers;
using System.Text;

namespace markdown_note_taking_app.Server.Service
{
    public class GrammarCheckService : IGrammarCheckService
    {
        private readonly IHttpClientServiceImplementation _httpFactory;
        public GrammarCheckService(IHttpClientServiceImplementation httpFactory)
        {
            _httpFactory = httpFactory;
        }

        public async Task<string> CheckGrammarMarkdownAsync(string markdownContent)
        {
            return await ProcessMarkdownStringAsync(markdownContent);
        }

        public async Task<string> CheckGrammarFromApiAsync(string content)
        {
            var json = await _httpFactory.MakeHttpRequestFromLanguageToolApiAsync(content);
            var result = JsonConvert.DeserializeObject<LanguageToolResponse>(json);

            foreach (var match in result.Matches.OrderByDescending(m => m.Offset))
            {
                var replacement = match.Replacements.FirstOrDefault()?.Value;
                if (!string.IsNullOrEmpty(replacement))
                {
                    content = content.Substring(0, match.Offset) +
                    replacement +
                           content.Substring(match.Offset + match.Length);
                }
            }
            return content;
        }

        public async Task<string> ProcessMarkdownStringAsync(string markdownContent)
        {
            // Step 1: Parse the markdown content into a MarkdownDocument
            var document = Markdown.Parse(markdownContent);

            // Step 2: Extract plain text from the MarkdownDocument
            var plainText = ExtractPlainText(document);

            // Step 3: Check grammar of the plain text
            var correctedText = await CheckGrammarFromApiAsync(plainText);

            // Step 4: Reapply the corrected text back into the MarkdownDocument
            ReapplyTextToMarkdown(document, correctedText);

            // Step 5: Render the updated MarkdownDocument back to a string
            var stringWriter = new StringWriter();
            var writer = new NormalizeRenderer(stringWriter);
            writer.Render(document);

            return stringWriter.ToString();
        }

        private string ExtractPlainText(MarkdownObject markdownObject)
        {
            var plainTextBuilder = new StringBuilder();

            foreach (var literal in markdownObject.Descendants<LiteralInline>())
            {
                plainTextBuilder.Append(literal.Content.ToString());
                plainTextBuilder.Append("---"); // Add space to separate text
            }

            return plainTextBuilder.ToString().Trim();
        }

        private void ReapplyTextToMarkdown(MarkdownObject markdownObject, string correctedText)
        {
            //function overloading for the split method to accept this string as the separator
            string[] separators = { "---" };
            var textQueue = new Queue<string>(correctedText.Split(separators, StringSplitOptions.None));

            foreach (var literal in markdownObject.Descendants<LiteralInline>())
            {
                if (textQueue.Count == 0) break;

                // Replace the content of each literal with corrected text
                literal.Content = new StringSlice(textQueue.Dequeue());

            }
        }
    }
}
