using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

#pragma warning disable CA1814 // Prefer jagged arrays over multidimensional

namespace markdown_note_taking_app.Server.Migrations
{
    /// <inheritdoc />
    public partial class IntegratingUsersToMarkdownFiles : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.AddColumn<string>(
                name: "UserId",
                table: "MarkDownFiles",
                type: "nvarchar(450)",
                nullable: true);

            migrationBuilder.CreateIndex(
                name: "IX_MarkDownFiles_UserId",
                table: "MarkDownFiles",
                column: "UserId");

            migrationBuilder.AddForeignKey(
                name: "FK_MarkDownFiles_AspNetUsers_UserId",
                table: "MarkDownFiles",
                column: "UserId",
                principalTable: "AspNetUsers",
                principalColumn: "Id");
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropForeignKey(
                name: "FK_MarkDownFiles_AspNetUsers_UserId",
                table: "MarkDownFiles");

            migrationBuilder.DropIndex(
                name: "IX_MarkDownFiles_UserId",
                table: "MarkDownFiles");

            migrationBuilder.DeleteData(
                table: "AspNetRoles",
                keyColumn: "Id",
                keyValue: "21bd7243-66cc-46ad-9bfd-d388706e3725");

            migrationBuilder.DeleteData(
                table: "AspNetRoles",
                keyColumn: "Id",
                keyValue: "5541dbf7-827f-4a31-a995-4e971fd4dc28");

            migrationBuilder.DropColumn(
                name: "UserId",
                table: "MarkDownFiles");

            migrationBuilder.InsertData(
                table: "AspNetRoles",
                columns: new[] { "Id", "ConcurrencyStamp", "Name", "NormalizedName" },
                values: new object[,]
                {
                    { "8011a6c1-bebf-4edc-804b-a1b7d5c736a1", null, "User", "USER" },
                    { "a1c1be89-0209-464e-8229-4e034ceba88f", null, "Administrator", "ADMINISTRATOR" }
                });
        }
    }
}
