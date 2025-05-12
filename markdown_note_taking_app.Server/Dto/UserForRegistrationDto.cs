using System.ComponentModel.DataAnnotations;

namespace markdown_note_taking_app.Server.Dto
{
    public class UserForRegistrationDto
    {
        public string? FirstName { get; init; }
        public string? LastName { get; init; }
        [Required(ErrorMessage = "Username is required")]
        public string? UserName { get; init; }
        [Required(ErrorMessage = "Passowrd is required")]
        public string? Password { get; init; }
        public string? Email { get; init; }
        public ICollection<string>? Roles { get; init; }
    }
}
