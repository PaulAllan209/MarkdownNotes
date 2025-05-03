using LoggerService.Interfaces;
using markdown_note_taking_app.Server.Interfaces.ServiceInterface;
using markdown_note_taking_app.Server.Service;
using Xunit;
using Xunit.Abstractions;

namespace markdown_note_taking_app.Server.Tests
{
    public class GrammarCheckServiceTest
    {
        private readonly ITestOutputHelper _output;

        //Tests dependencies
        private readonly IHttpClientFactory _httpClientFactory;
        private readonly IHttpClientServiceImplementation _httpClientFactoryService;
        private readonly ILoggerManager _logger;


        public GrammarCheckServiceTest(ITestOutputHelper output)
        {
            _output = output;

            //Tests dependencies
            _httpClientFactory = new DefaultHttpClientFactory();
            _httpClientFactoryService = new HttpClientFactoryService(_httpClientFactory, _logger);
        }

        [Fact]
        public async Task CheckGrammarMarkdownTest()
        {
            var grammar_check_service = new GrammarCheckService(_httpClientFactoryService);

            var input = "***He dont has no idear what time it is.***\r\n\r\n**She go to the libary every days to studdy.**\r\n\r\n*Their going too the mall becuz its funner then staying home.*\r\n\r\n## I can’t waits to eats the delishus cake you made.\r\n\r\n - The dog barked loudley at the man wich was walking passed.\r\n\r\n";
            var result = await grammar_check_service.CheckGrammarMarkdownAsync(input);
            string expected_result = "***He don't has no idea what time it is.***\n\n**She goes to the library every day to study.**\n\n*They're going to the mall because it's funner then staying home.*\n\n## I can’t wait to eat the delights cake you made.\n\n- The dog barked loudly at the man with was walking past.";

            Assert.Equal(expected_result, result);
        }

        [Fact]
        public async Task CheckGrammarFromApiTest()
        {
            var grammar_check_service = new GrammarCheckService(_httpClientFactoryService);

            var input = "This is an exampel sentence";
            var input2 = "She dont knows how to writting a letter correctly.";
            var result1 = await grammar_check_service.CheckGrammarFromApiAsync(input);
            var result2 = await grammar_check_service.CheckGrammarFromApiAsync(input2);

            var expected_result1 = "This is an example sentence";
            var expected_result2 = "She don't knows how to writing a letter correctly.";


            if (result1 != expected_result1)
            {
                throw new Exception();
            }

            else if(result2 != expected_result2)
            {
                _output.WriteLine(result2);
                throw new Exception();
            }
        }

        //Helper class for the tests
        private class DefaultHttpClientFactory : IHttpClientFactory
        {
            public HttpClient CreateClient(string name = "")
            {
                return new HttpClient();
            }
        }



    }
}
