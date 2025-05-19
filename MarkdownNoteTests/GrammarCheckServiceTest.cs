using LoggerService.Interfaces;
using markdown_note_taking_app.Server.Interfaces.ServiceInterface;
using markdown_note_taking_app.Server.Models.LanguageTool;
using LTMatch = markdown_note_taking_app.Server.Models.LanguageTool.Match; // This fixes ambiguity between the models and Moq.match
using markdown_note_taking_app.Server.Service;
using MarkdownNoteTests;
using Moq;
using Newtonsoft.Json;
using Xunit;
using Xunit.Abstractions;

namespace markdown_note_taking_app.Server.Tests
{
    public class GrammarCheckServiceTest
    {
        private readonly ITestOutputHelper _output;
        private readonly Mock<IHttpClientServiceImplementation> _mockHttpClientService;
        private readonly GrammarCheckService _grammarCheckService;

        public GrammarCheckServiceTest(ITestOutputHelper output)
        {
            _output = output;
            _mockHttpClientService = new Mock<IHttpClientServiceImplementation>();
            _grammarCheckService = new GrammarCheckService(_mockHttpClientService.Object);
        }

        [Fact]
        public async Task CheckGrammarFromApiAsync_CorrectsSingleError()
        {
            // Arrange
            var inputText = "This is an exampel sentence";
            var apiResponse = CreateLanguageToolResponse(
                new LTMatch
                {
                    Offset = 11,
                    Length = 7,
                    Replacements = new List<Replacement> {new Replacement { Value = "example" } }
                }
            );

            _mockHttpClientService
                .Setup(x => x.MakeHttpRequestFromLanguageToolApiAsync(inputText))
                .ReturnsAsync(apiResponse);

            // Act
            var result = await _grammarCheckService.CheckGrammarFromApiAsync(inputText);

            // Assert
            Assert.Equal("This is an example sentence", result);
        }

        [Fact]
        public async Task CheckGrammarFromApiAsync_CorrectsMultipleErrors()
        {
            // Arrange
            var inputText = "She dont knows how to writting a letter correctly.";
            var apiResponse = CreateLanguageToolResponse(
                new LTMatch
                {
                    Offset = 4,
                    Length = 4,
                    Replacements = new List<Replacement> { new Replacement { Value = "don't" } }
                },
                new LTMatch
                {
                    Offset = 22,
                    Length = 8,
                    Replacements = new List<Replacement> { new Replacement { Value = "writing"} }
                }
            );

            _mockHttpClientService
                .Setup(x => x.MakeHttpRequestFromLanguageToolApiAsync(inputText))
                .ReturnsAsync(apiResponse);

            // Act
            var result = await _grammarCheckService.CheckGrammarFromApiAsync(inputText);

            // Assert
            Assert.Equal("She don't knows how to writing a letter correctly.", result);
        }
        [Fact]
        public async Task CheckGrammarFromApiAsync_HandlesNoCorrectionsNeeded()
        {
            // Arrange
            var inputText = "This sentence is grammatically correct.";
            var apiResponse = CreateLanguageToolResponse(); // No matches

            _mockHttpClientService
                .Setup(x => x.MakeHttpRequestFromLanguageToolApiAsync(inputText))
                .ReturnsAsync(apiResponse);

            // Act
            var result = await _grammarCheckService.CheckGrammarFromApiAsync(inputText);

            // Assert
            Assert.Equal(inputText, result); // Text should remain unchanged
        }

        [Fact]
        public async Task CheckGrammarFromApiAsync_HandlesEmptyReplacements()
        {
            // Arrange
            var inputText = "This sentence has a detected problem but no suggested fixes.";
            var apiResponse = CreateLanguageToolResponse(
                new LTMatch
                {
                    Offset = 13,
                    Length = 3,
                    Replacements = new List<Replacement>() // No replacements
                }
            );

            _mockHttpClientService
                .Setup(x => x.MakeHttpRequestFromLanguageToolApiAsync(inputText))
                .ReturnsAsync(apiResponse);

            // Act
            var result = await _grammarCheckService.CheckGrammarFromApiAsync(inputText);

            // Assert
            Assert.Equal(inputText, result); // Text should remain unchanged
        }

        [Fact]
        public async Task CheckGrammarMarkdownAsync_ProcessesMarkdownCorrectly()
        {
            // Arrange
            var markdownInput = "**She go to the library every days.**";
            var apiResponse = CreateLanguageToolResponse(
                new LTMatch 
                {
                    Offset = 4,
                    Length = 2,
                    Replacements = new List<Replacement> { new Replacement { Value = "goes"} }
                },
                new LTMatch
                {
                    Offset = 14,
                    Length = 6,
                    Replacements = new List<Replacement> { new Replacement { Value = "library"} }
                },
                new LTMatch
                {
                    Offset = 21,
                    Length = 4,
                    Replacements = new List<Replacement> { new Replacement { Value = "day"} }
                }
            );

            _mockHttpClientService
                .Setup(x => x.MakeHttpRequestFromLanguageToolApiAsync(It.IsAny<string>()))
                .ReturnsAsync(apiResponse);

            // Act
            var result = await _grammarCheckService.CheckGrammarMarkdownAsync(markdownInput);

            // Assert
            Assert.Contains("goes", result);
            Assert.Contains("library", result);
            Assert.Contains("day", result);
        }

        [Fact]
        public async Task CheckGrammarMarkdownAsync_PreservesMarkdownFormatting()
        {
            // Arrange
            var markdownInput = "# Heading\n\n**Bold text** with an _error_.\n\n- List item 1\n- List item 2";

            _mockHttpClientService
                .Setup(x => x.MakeHttpRequestFromLanguageToolApiAsync(It.IsAny<string>()))
                .ReturnsAsync(CreateLanguageToolResponse());

            // Act
            var result = await _grammarCheckService.CheckGrammarMarkdownAsync(markdownInput);

            // Assert
            Assert.Contains("# Heading", result);
            Assert.Contains("**Bold text**", result, StringComparison.OrdinalIgnoreCase);
            Assert.Contains("_error_", result);
            Assert.Contains("- List item", result);
        }

        // Helper method to create sample API responses
        private string CreateLanguageToolResponse(params LTMatch[] matches)
        {
            var response = new LanguageToolResponse
            {
                Matches = (matches != null) ? matches.ToList() : new List<LTMatch>()
            };

            return JsonConvert.SerializeObject(response);
        }
    }
}
