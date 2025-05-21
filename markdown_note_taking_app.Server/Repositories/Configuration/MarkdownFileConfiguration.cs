using Entities.Models;
using markdown_note_taking_app.Server.Utilities;
using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Metadata.Builders;

namespace markdown_note_taking_app.Server.Repositories.Configuration
{
    public class MarkdownFileConfiguration : IEntityTypeConfiguration<MarkdownFile>
    {
        public void Configure(EntityTypeBuilder<MarkdownFile> builder)
        {
            builder.HasData(
                new MarkdownFile
                {
                    Id = Guid.NewGuid(),
                    Title = DefaultMarkdownFile.GetDefaultFileName(),
                    FileContent = DefaultMarkdownFile.GetWelcomeFileContent(),
                    UploadDate = DateTime.Now,
                    UserId = "d8545548-6462-48c7-8149-152f8fc6406a"
                }
                );
        }
    }
}
