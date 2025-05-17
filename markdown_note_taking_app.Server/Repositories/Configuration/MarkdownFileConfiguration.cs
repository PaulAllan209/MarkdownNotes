using Entities.Models;
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
                    Title = "Welcome_File",
                    FileContent = "# Welcome to Your Markdown Note Taking App\n\n" +
                                 "This is a sample markdown file to get you started.\n\n" +
                                 "## Features\n\n" +
                                 "- Create and edit markdown files\n" +
                                 "- Save your notes in the cloud\n" +
                                 "- Collaborate with others\n\n" +
                                 "## Markdown Syntax\n\n" +
                                 "You can use various markdown syntax elements:\n\n" +
                                 "**Bold text** or *italic text*\n\n" +
                                 "- Bulleted lists\n" +
                                 "- Like this one\n\n" +
                                 "1. Numbered lists\n" +
                                 "2. Are also supported\n\n" +
                                 "```\n" +
                                 "Code blocks too!\n" +
                                 "```\n\n" +
                                 "Enjoy writing!",
                    UploadDate = DateTime.Now,
                    UserId = "d8545548-6462-48c7-8149-152f8fc6406a"
                }
                );
        }
    }
}
