using Entities.Models;

namespace markdown_note_taking_app.Server.Interfaces
{
    public interface IMarkdownRepository
    {
        Task<IEnumerable<MarkdownFile>> GetAllMarkdownFilesAsync(bool trackChanges);
        Task<IEnumerable<MarkdownFile>> GetByIdsAsync(IEnumerable<Guid> fileIds,bool trackChanges);
        Task<MarkdownFile> GetMarkdownFileAsync(Guid fileId, bool trackChanges);
        void CreateMarkdownFile(MarkdownFile markdownFile);
        void DeleteMarkdownFile(MarkdownFile markdownFile);
    }
}
