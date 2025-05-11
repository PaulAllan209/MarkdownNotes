namespace markdown_note_taking_app.Server.Exceptions
{
    public sealed class InvalidMarkdownFileNameException : InvalidMarkdownFileException
    {
        public InvalidMarkdownFileNameException()
            : base("Please enter a valid file name.")
        {
        }
    }
}
