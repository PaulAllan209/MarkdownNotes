using System.ComponentModel.DataAnnotations;

namespace markdown_note_taking_app.Server.Dto
{
    public class UserForRegistrationDto
    {
        [Required(ErrorMessage = "FirstName is required")]
        [StringLength(50, MinimumLength = 2, ErrorMessage = "FirstName must be between 2 and 50 characters")]
        public string? FirstName { get; init; }

        [Required(ErrorMessage = "LastName is required")]
        [StringLength(50, MinimumLength = 2, ErrorMessage = "LastName must be between 2 and 50 characters")]
        public string? LastName { get; init; }

        [StringLength(50, MinimumLength = 2, ErrorMessage = "UserName must be between 2 and 50 characters")]
        [Required(ErrorMessage = "Username is required")]
        [RegularExpression(@"^[a-zA-Z0-9_-]+$", ErrorMessage = "Username can only contain letters, numbers, underscores and hyphens")]
        public string? UserName { get; init; }

        [Required(ErrorMessage = "Password is required")]
        [StringLength(128, MinimumLength = 10, ErrorMessage = "Password must be between 10 and 128 characters")]
        [RegularExpression(@"^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[^\da-zA-Z]).{10,}$",
            ErrorMessage = "Password must include at least one uppercase letter, one lowercase letter, one number, and one special character")]
        public string? Password { get; init; }

        [Required(ErrorMessage = "Email is required")]
        [EmailAddress(ErrorMessage = "Invalid email format")]
        public string? Email { get; init; }

        public ICollection<string>? Roles { get; init; }
    }
}
