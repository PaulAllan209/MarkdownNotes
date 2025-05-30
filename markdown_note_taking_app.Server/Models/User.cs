﻿using Entities.Models;
using Microsoft.AspNetCore.Identity;

namespace markdown_note_taking_app.Server.Models
{
    public class User : IdentityUser
    {
        public string? FirstName { get; set; }
        public string? LastName { get; set; }
        public string? RefreshToken { get; set; }
        public DateTime RefreshTokenExpiryTime { get; set; }

        public ICollection<MarkdownFile>? MarkdownFiles { get; set; }
    }
}
