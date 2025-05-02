namespace markdown_note_taking_app.Server.Dto
{
    public record MarkdownFileUploadDto
    {
        public IFormFile MarkdownFile { get; init; }
    }
}
