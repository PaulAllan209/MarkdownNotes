namespace markdown_note_taking_app.Server.Dto
{
    public record MarkdownFileConvertToHtmlDto
    {
        public Guid Id { get; init; }
        public string Title { get; init; }
        public string FileContentAsHtml { get; init; }
        public DateTime UploadDate { get; init; }

    }
}
