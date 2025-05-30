﻿using System.ComponentModel.DataAnnotations;

namespace markdown_note_taking_app.Server.Dto
{
    public record UserForAuthenticationDto
    {
        [Required(ErrorMessage = "User name is required")]
        public string? UserName { get; init; }
        [Required(ErrorMessage = "Password is required")]
        public string? Password { get; init; }
    }
}
