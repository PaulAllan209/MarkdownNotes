namespace markdown_note_taking_app.Server.Exceptions
{
    public abstract class InvalidMarkdownFileException : Exception
    {
        protected InvalidMarkdownFileException(string message)
            :base(message)
        { }
    }
}
