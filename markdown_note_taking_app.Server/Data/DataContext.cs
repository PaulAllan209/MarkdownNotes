using Entities.Models;
using Microsoft.EntityFrameworkCore;

namespace markdown_note_taking_app.Server.Data
{
    public class DataContext : DbContext
    {
        public DbSet<MarkdownFile> MarkDownFiles { get; set; }

        public DataContext(DbContextOptions options) : base(options)
        {
        }


        protected override void OnModelCreating(ModelBuilder modelBuilder)
        {
            base.OnModelCreating(modelBuilder);

            modelBuilder.Entity<MarkdownFile>()
                .HasKey(x => x.Id);
        }
    }
}
