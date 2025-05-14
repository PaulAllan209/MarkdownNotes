namespace markdown_note_taking_app.Server.Dto
{
    public record MarkdownFileCreationDto
    {
        public Guid Id { get; init; }
        public string Title { get; init; }
        public string FileContent { get; init; }
        public DateTime UploadDate { get; init; }
        public string UserId { get; init; }
    }
}
