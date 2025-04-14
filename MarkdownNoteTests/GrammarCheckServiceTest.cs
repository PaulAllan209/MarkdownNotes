using markdown_note_taking_app.Service;
using Xunit;
using Xunit.Abstractions;

namespace markdown_note_taking_app.Tests
{
    public class GrammarCheckServiceTest
    {
        private readonly ITestOutputHelper _output;

        public GrammarCheckServiceTest(ITestOutputHelper output)
        {
            _output = output;
        }

        [Fact]
        public async Task CheckGrammarMarkdownTest()
        {
            var grammar_check_service = new GrammarCheckService();

            var input = "***He dont has no idear what time it is.***\r\n\r\n**She go to the libary every days to studdy.**\r\n\r\n*Their going too the mall becuz its funner then staying home.*\r\n\r\n## I can’t waits to eats the delishus cake you made.\r\n\r\n - The dog barked loudley at the man wich was walking passed.\r\n\r\n";
            var result = await grammar_check_service.CheckGrammarMarkdownAsync(input);
            string expected_result = "***He don't has no idea what time it is.***\n\n**She goes to the library every day to study.**\n\n*Their going to the mall because its funner then staying home.*\n\n## I can’t wait to eat the delights cake you made.\n\n- The dog barked loudly at the man with was walking past.";
            
            if (result != expected_result)
            {
                _output.WriteLine("This is the input:");
                _output.WriteLine(input);

                _output.WriteLine("This is the output:");
                _output.WriteLine(result);

                _output.WriteLine("This is the expected output:");
                _output.WriteLine(expected_result);
                throw new Exception();
            }
        }

        [Fact]
        public async Task CheckGrammarFromApiTest()
        {
            var grammar_check_service = new GrammarCheckService();

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
    }
}
