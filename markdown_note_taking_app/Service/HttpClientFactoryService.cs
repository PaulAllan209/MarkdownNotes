using Contracts;
using markdown_note_taking_app.Interfaces.ServiceInterface;
using System.Text.Json;

namespace markdown_note_taking_app.Service
{
    public class HttpClientFactoryService : IHttpClientServiceImplementation
    {
        private readonly IHttpClientFactory _httpClientFactory;
        private readonly ILoggerManager _logger;

        public HttpClientFactoryService(IHttpClientFactory httpClientFactory, ILoggerManager logger)
        {
            _httpClientFactory = httpClientFactory;
            _logger = logger;
        }

        public async Task<string> MakeHttpRequestFromLanguageToolApiAsync(string content)
        {
            var formContent = new FormUrlEncodedContent(new Dictionary<string, string>
            {
                { "text", content },
                { "language", "en-US" }
            });

            var httpClient = _httpClientFactory.CreateClient();

            using (var response = await httpClient.PostAsync("https://api.languagetool.org/v2/check", formContent))
            {
                response.EnsureSuccessStatusCode();
                return await response.Content.ReadAsStringAsync();
            }
        }

    }
}
