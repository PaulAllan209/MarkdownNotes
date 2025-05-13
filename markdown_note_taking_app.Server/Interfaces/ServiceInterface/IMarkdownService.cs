using Entities.Models;
using markdown_note_taking_app.Server.Dto;

namespace markdown_note_taking_app.Server.Interfaces.ServiceInterface
{
    public interface IMarkdownService
    {
        Task<IEnumerable<MarkdownFileDto>> GetAllMarkdownFilesAsync(string userName, bool trackChanges);
        Task<MarkdownFileDto> GetMarkdownFileAsync(Guid fileId, bool checkGrammar, bool trackChanges);
        Task<MarkdownFileDto> CreateMarkdownFileAsync(MarkdownFileUploadDto markdownFile);
        Task DeleteMarkdownFileAsync(Guid fileId, bool trackChanges);
        Task<MarkdownFile> GetMarkdownFileAndCheckIfItExistsAsync(Guid fileId, bool trackChanges);
        Task<MarkdownFileConvertToHtmlDto> GetMarkdownFileAsHtmlAsync(Guid fileId, bool checkGrammar, bool trackChanges);
        Task<(MarkdownFileDto markdownToPatch, MarkdownFile markdownFileEntity)> GetMarkdownForPatchAsync(Guid fileId, bool TrackChanges);
        Task SaveChangesForPatchAsync(MarkdownFileDto markdownToPatch, MarkdownFile markdownFileEntity);
        public MarkdownFileConvertToHtmlDto ConvertMarkdownFileDtoToHtml(MarkdownFileDto markdownFile);
    }
}
