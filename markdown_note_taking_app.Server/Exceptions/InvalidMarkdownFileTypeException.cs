namespace markdown_note_taking_app.Server.Exceptions
{
    public sealed class InvalidMarkdownFileTypeException : InvalidMarkdownFileException
    {
        public InvalidMarkdownFileTypeException(string fileName)
            :base($"The file with file name {fileName} is not a markdown file.") { }
    }
}
