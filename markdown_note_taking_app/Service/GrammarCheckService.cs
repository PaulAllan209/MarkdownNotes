using Entities.Models;
using Markdig;
using Markdig.Syntax.Inlines;
using Markdig.Syntax;
using markdown_note_taking_app.Interfaces.ServiceInterface;
using markdown_note_taking_app.Models.LanguageTool;
using Newtonsoft.Json;
using static System.Net.Mime.MediaTypeNames;
using Markdig.Renderers.Normalize;
using Markdig.Helpers;

namespace markdown_note_taking_app.Service
{
    public class GrammarCheckService : IGrammarCheckService
    {
        public async Task<string> CheckGrammarMarkdownAsync(string markdownContent)
        {
            //Check the grammar in the markdown content
            var document = Markdown.Parse(markdownContent);
            var document_checked = await ProcessDocumentAsync(document);

            // Convert the Markdown object to string
            var string_writer = new StringWriter();
            var writer = new NormalizeRenderer(string_writer);
            writer.Render(document_checked);

            return string_writer.ToString();
        }
        
        private async Task<MarkdownObject> ProcessDocumentAsync(MarkdownObject markdownObject)
        {
            // Traverse through the nodes inside the markdown object and check the grammer in each content
            foreach (var literal in markdownObject.Descendants<LiteralInline>())
            {
                string orig_text = literal.Content.ToString();
                string modified_text = await CheckGrammarFromApiAsync(orig_text);

                literal.Content = new StringSlice(modified_text);
            }

            return markdownObject;
        }

        public async Task<string> CheckGrammarFromApiAsync(string content)
        {
            var request = new HttpRequestMessage(HttpMethod.Post, "https://api.languagetool.org/v2/check")
            {
                Content = new FormUrlEncodedContent(new Dictionary<string, string>
                {
                    { "text", content },
                    { "language", "en-US" }
                })
            };


            var client = new HttpClient();
            var response = await client.SendAsync(request);


            var json = await response.Content.ReadAsStringAsync();


            //Languagetool api sends a lot of objects inside the json so we need to clean it up
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
    }
}
