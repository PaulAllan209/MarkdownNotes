using markdown_note_taking_app.Server.Models;
using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations.Schema;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Entities.Models
{
    public class MarkdownFile
    {
        [Column("FileId")]
        public Guid Id { get; set; }
        public string Title { get; set; }
        public string FileContent { get; set; }
        public DateTime UploadDate { get; set; } = DateTime.Now;

        public string? UserId { get; set; }
        public User? User { get; set; }
    }
}
