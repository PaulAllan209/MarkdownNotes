namespace markdown_note_taking_app.Interfaces.ServiceInterface
{
    public interface IGrammarCheckService
    {
        Task<string> CheckGrammarMarkdownAsync(string markdownContent);
        Task<string> CheckGrammarFromApiAsync(string content);
        Task<string> ProcessMarkdownStringAsync(string markdownContent);
    }
}
