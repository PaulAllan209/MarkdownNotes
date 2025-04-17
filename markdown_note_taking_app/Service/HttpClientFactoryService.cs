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

        public async Task<string> MakeHttpRequestFromLanguageToolApi(string content)
        {
            var payload = new
            {
                text = content,
                language = "en-US"
            };


            var formContent = new FormUrlEncodedContent(new Dictionary<string, string>
            {
                { "text", content },
                { "language", "en-US" }
            });
           

            var httpClient = _httpClientFactory.CreateClient();
            var jsonContent = JsonContent.Create(payload);

            var jsonSerialized = JsonSerializer.Serialize(payload);
            _logger.LogInfo($"Serialized JSON payload: {payload}");

            using (var response = await httpClient.PostAsync("https://api.languagetool.org/v2/check", formContent))
            {
                _logger.LogInfo($"Response Headers: {response.Headers}");
                _logger.LogInfo($"Response Content-Type: {response.Content.Headers.ContentType}");
                _logger.LogInfo("Line before EnsureSuccessStatusCode");
                _logger.LogInfo($"The response content : {await response.Content.ReadAsStringAsync()}");
                response.EnsureSuccessStatusCode();
                return await response.Content.ReadAsStringAsync();
            }
        }

    }
}
