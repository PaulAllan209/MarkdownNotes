using Entities.Models;
using markdown_note_taking_app.Server.Models;
using markdown_note_taking_app.Server.Repositories.Configuration;
using Microsoft.AspNetCore.Identity.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore;

namespace markdown_note_taking_app.Server.Data
{
    public class DataContext : IdentityDbContext<User>
    {
        public DbSet<MarkdownFile> MarkDownFiles { get; set; }

        public DataContext(DbContextOptions options) : base(options)
        {
        }


        protected override void OnModelCreating(ModelBuilder modelBuilder)
        {
            base.OnModelCreating(modelBuilder);

            //Creating data for the roles in JWT authentication
            modelBuilder.ApplyConfiguration(new RoleConfiguration());

            modelBuilder.Entity<MarkdownFile>()
                .HasKey(x => x.Id);

            modelBuilder.Entity<MarkdownFile>()
                .HasOne(m => m.User)
                .WithMany(u => u.MarkdownFiles)
                .HasForeignKey(m => m.UserId);
        }
    }
}
