namespace markdown_note_taking_app.Server.Interfaces.ServiceInterface
{
    public interface IHttpClientServiceImplementation
    {
        public Task<string> MakeHttpRequestFromLanguageToolApiAsync(string content);
    }
}
