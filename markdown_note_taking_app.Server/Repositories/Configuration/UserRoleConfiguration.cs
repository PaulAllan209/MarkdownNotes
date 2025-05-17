using Microsoft.AspNetCore.Identity;
using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Metadata.Builders;

namespace markdown_note_taking_app.Server.Repositories.Configuration
{
    public class UserRoleConfiguration : IEntityTypeConfiguration<IdentityUserRole<string>>
    {
        public void Configure(EntityTypeBuilder<IdentityUserRole<string>> builder)
        {
            const string userId = "d8545548-6462-48c7-8149-152f8fc6406a";

            builder.HasData(
                new IdentityUserRole<string>
                {
                    RoleId = "5541dbf7-827f-4a31-a995-4e971fd4dc28",
                    UserId = userId
                }
            );
        }
    }
}
