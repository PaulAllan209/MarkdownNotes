namespace markdown_note_taking_app.Server.Interfaces
{
    public interface IRepositoryManager
    {
        IMarkdownRepository MarkDown { get; }
        Task SaveAsync();
    }
}
