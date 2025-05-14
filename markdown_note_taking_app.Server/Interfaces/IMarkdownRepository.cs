using Entities.Models;

namespace markdown_note_taking_app.Server.Interfaces
{
    public interface IMarkdownRepository
    {
        void CreateMarkdownFile(MarkdownFile markdownFile);
        Task<IEnumerable<MarkdownFile>> GetAllMarkdownFilesAsync(string userId, bool trackChanges);
        Task<IEnumerable<MarkdownFile>> GetByIdsAsync(IEnumerable<Guid> fileIds,bool trackChanges);
        Task<MarkdownFile> GetMarkdownFileAsync(Guid fileId, string userId, bool trackChanges);
        void DeleteMarkdownFile(MarkdownFile markdownFile);
    }
}
