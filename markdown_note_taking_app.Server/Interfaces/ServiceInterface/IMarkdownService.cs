using Entities.Models;
using markdown_note_taking_app.Server.Dto;

namespace markdown_note_taking_app.Server.Interfaces.ServiceInterface
{
    public interface IMarkdownService
    {
        Task<MarkdownFileDto> CreateMarkdownFileAsync(MarkdownFileUploadDto markdownFile);
        Task<IEnumerable<MarkdownFileDto>> GetAllMarkdownFilesAsync(string userName, bool trackChanges);
        Task<MarkdownFileDto> GetMarkdownFileAsync(Guid fileId, string userName, bool checkGrammar, bool trackChanges);
        Task<MarkdownFile> GetMarkdownFileAndCheckIfItExistsAsync(Guid fileId, string userName, bool trackChanges);
        Task<MarkdownFileConvertToHtmlDto> GetMarkdownFileAsHtmlAsync(Guid fileId, string userName, bool checkGrammar, bool trackChanges);
        Task<(MarkdownFileDto markdownToPatch, MarkdownFile markdownFileEntity)> GetMarkdownForPatchAsync(Guid fileId, string userName, bool TrackChanges);
        Task DeleteMarkdownFileAsync(Guid fileId, string userName, bool trackChanges);
        Task SaveChangesForPatchAsync(MarkdownFileDto markdownToPatch, MarkdownFile markdownFileEntity);
        public MarkdownFileConvertToHtmlDto ConvertMarkdownFileDtoToHtml(MarkdownFileDto markdownFile);
    }
}
