using markdown_note_taking_app.Server.Models;
using Microsoft.AspNetCore.Identity;
using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Metadata.Builders;

namespace markdown_note_taking_app.Server.Repositories.Configuration
{
    public class UserConfiguration : IEntityTypeConfiguration<User>
    {
        public void Configure(EntityTypeBuilder<User> builder)
        {
            var haser = new PasswordHasher<User>();
            var defaultUser = new User
            {
                Id = "d8545548-6462-48c7-8149-152f8fc6406a",
                UserName = "juan",
                NormalizedUserName = "JUAN",
                Email = "defaultuser@example.com",
                NormalizedEmail = "DEFAULTUSER@EXAMPLE.COM",
                EmailConfirmed = true,
                FirstName = "Juan",
                LastName = "Dela Cruz",
                SecurityStamp = Guid.NewGuid().ToString()
            };

            defaultUser.PasswordHash = haser.HashPassword(defaultUser, "Password123!");

            builder.HasData(defaultUser);
        }
    }
}
