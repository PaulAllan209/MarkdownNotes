namespace MarkdownNoteTests;
using Xunit;
using Xunit.Abstractions;
using markdown_note_taking_app.Server.Service;


public class HttpClientFactoryServiceTest
{
    private readonly ITestOutputHelper _output;
    

    public HttpClientFactoryServiceTest(ITestOutputHelper output)
    {
        _output = output;
    }

    [Fact]
    public async Task MakeHttpRequestFromLanguageToolApiTest()
    {
        var httpClientFactory = new DefaultHttpClientFactory();
        var logger = new LoggerManagerUnitTest(_output);
        var HttpClientFactoryService = new HttpClientFactoryService(httpClientFactory, logger);

        string input = "He dont has no idear what time it is.";
        string expected_output = "He don't has no idea what time it is."; // for debugging purposes

        string output = await HttpClientFactoryService.MakeHttpRequestFromLanguageToolApiAsync(input);

        Assert.NotNull(output);

        _output.WriteLine($"API Output: {output}");
    }

    //Helper class for the request
    private class DefaultHttpClientFactory : IHttpClientFactory
    {
        public HttpClient CreateClient(string name = "")
        {
            return new HttpClient();
        }
    }
}


