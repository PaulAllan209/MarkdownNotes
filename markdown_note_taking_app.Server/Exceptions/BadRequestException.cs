namespace markdown_note_taking_app.Server.Exceptions
{
    public abstract class BadRequestException : Exception
    {
        protected BadRequestException(string message)
            :base(message)
        {
        }
    }
}
