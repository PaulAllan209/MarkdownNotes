namespace markdown_note_taking_app.Interfaces.ServiceInterface
{
    public interface IHttpClientServiceImplementation
    {
        public Task<string> MakeHttpRequestFromLanguageToolApi(string content);
    }
}
