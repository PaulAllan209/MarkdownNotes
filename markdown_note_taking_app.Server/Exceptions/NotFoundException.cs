namespace markdown_note_taking_app.Server.Exceptions
{
    public abstract class NotFoundException : Exception
    {
        protected NotFoundException(string message)
            :base(message)
        { }
    }
}
