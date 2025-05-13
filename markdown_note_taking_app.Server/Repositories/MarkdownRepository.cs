using Entities.Models;
using markdown_note_taking_app.Server.Data;
using markdown_note_taking_app.Server.Interfaces;
using Microsoft.EntityFrameworkCore;

namespace markdown_note_taking_app.Server.Repositories
{
    public class MarkdownRepository : RepositoryBase<MarkdownFile>,IMarkdownRepository
    {

        public MarkdownRepository(DataContext dataContext) : base(dataContext)
        {
        }

        public void CreateMarkdownFile(MarkdownFile markdownFile)
        {
            Create(markdownFile);
        }

        public void DeleteMarkdownFile(MarkdownFile markdownFile)
        {
            Delete(markdownFile);
        }

        public async Task<IEnumerable<MarkdownFile>> GetAllMarkdownFilesAsync(string userId, bool trackChanges)
        {
           return await FindByCondition(x => x.UserId == userId, trackChanges)
                .OrderBy(x => x.Title)
                .ToListAsync();
        }

        public async Task<IEnumerable<MarkdownFile>> GetByIdsAsync(IEnumerable<Guid> fileIds,bool trackChanges)
        {
            return await FindByCondition(x => fileIds.Contains(x.Id), trackChanges).ToListAsync();
        }

        public async Task<MarkdownFile> GetMarkdownFileAsync(Guid fileId, bool trackChanges)
        {
            return await FindByCondition(x => x.Id == fileId, trackChanges).SingleOrDefaultAsync(); ;
        }
    }
}
