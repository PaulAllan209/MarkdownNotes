namespace markdown_note_taking_app.Server.Interfaces.ServiceInterface
{
    public interface IServiceManager
    {
        IMarkdownService MarkdownService { get; }
        IGrammarCheckService GrammarCheckService { get; }

    }
}
