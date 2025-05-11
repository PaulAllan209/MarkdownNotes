namespace markdown_note_taking_app.Server.Exceptions
{
    public sealed class MarkdownFileNotFoundException : NotFoundException
    {
        public MarkdownFileNotFoundException(Guid fileId)
            : base ($"The markdown file with id: {fileId} doesn't exist in the database.")
        {
        }
    }
}
