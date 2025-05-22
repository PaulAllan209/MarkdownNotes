using Azure.Core;
using markdown_note_taking_app.Server.Controllers;
using markdown_note_taking_app.Server.Dto;
using markdown_note_taking_app.Server.Interfaces.ServiceInterface;
using markdown_note_taking_app.Server.Models;
using markdown_note_taking_app.Server.Utilities;
using Microsoft.AspNetCore.Identity;
using Microsoft.AspNetCore.Mvc;
using Moq;
using Xunit.Abstractions;

namespace MarkdownNoteTests;

public class AuthenticationControllerTest
{
    private readonly ITestOutputHelper _output;
    private readonly Mock<IServiceManager> _mockServiceManager;
    private readonly Mock<IAuthenticationService> _mockAuthService;
    private readonly Mock<IMarkdownService> _mockMarkdownService;

    public AuthenticationControllerTest(ITestOutputHelper output)
    {
        _output = output;
        _mockAuthService = new Mock<IAuthenticationService>();
        _mockMarkdownService = new Mock<IMarkdownService>();
        _mockServiceManager = new Mock<IServiceManager>();
        _mockServiceManager.Setup(sm => sm.MarkdownService).Returns(_mockMarkdownService.Object);
        _mockServiceManager.Setup(sm => sm.AuthenticationService).Returns(_mockAuthService.Object);
    }

    [Fact]
    public async Task RegisterUser_ReturnsCreatedStatus_WhenRegistrationSucceeds()
    {
        // Arrange
        var userDto = new UserForRegistrationDto
        {
            FirstName = "Test",
            LastName = "User",
            UserName = "testuser",
            Email = "test@example.com",
            Password = "Password123!"
        };

        var identityResult = IdentityResult.Success;
        _mockAuthService.Setup(s => s.RegisterUser(It.IsAny<UserForRegistrationDto>()))
            .ReturnsAsync(identityResult);

        // Setup mock for default markdown file creation
        var defaultMarkdownFileDto = new MarkdownFileDto
        {
            Id = Guid.NewGuid(),
            Title = DefaultMarkdownFile.GetDefaultFileName(),
            FileContent = DefaultMarkdownFile.GetWelcomeFileContent(),
            UploadDate = DateTime.Now
        };

        _mockMarkdownService.Setup(s => s.CreateDefaultMarkdownFileAsync(
            It.IsAny<string>(),
            It.IsAny<string>(),
            It.IsAny<string>()))
            .ReturnsAsync(defaultMarkdownFileDto);

        var controller = new AuthenticationController(_mockServiceManager.Object);

        // Act
        var result = await controller.RegisterUser(userDto);

        // Assert
        var statusCodeResult = Assert.IsType<StatusCodeResult>(result);
        Assert.Equal(201, statusCodeResult.StatusCode);
    }

    [Fact]
    public async Task RegisterUser_ReturnsBadRequest_WhenRegistrationFails()
    {
        // Arrange
        var userDto = new UserForRegistrationDto
        {
            FirstName = "Test",
            LastName = "User",
            UserName = "testuser",
            Email = "test@example.com",
            Password = "short"
        };

        var identityResult = IdentityResult.Failed(new IdentityError { Code = "PasswordTooShort", Description = "Password is too short" });
        _mockAuthService.Setup(s => s.RegisterUser(It.IsAny<UserForRegistrationDto>()))
            .ReturnsAsync(identityResult);

        var controller = new AuthenticationController(_mockServiceManager.Object);

        // Act
        var result = await controller.RegisterUser(userDto);

        // Assert
        var badRequestResult = Assert.IsType<BadRequestObjectResult>(result);
        Assert.NotNull(badRequestResult.Value);
    }

    [Fact]
    public async Task Authenticate_ReturnsUnauthorized_WhenValidationFails()
    {
        // Arrange
        var userDto = new UserForAuthenticationDto
        {
            UserName = "testuser",
            Password = "wrongpassword"
        };

        _mockAuthService.Setup(s => s.ValidateUser(It.IsAny<UserForAuthenticationDto>()))
            .ReturnsAsync(false);

        var controller = new AuthenticationController(_mockServiceManager.Object);

        // Act
        var result = await controller.Authenticate(userDto);

        // Assert
        Assert.IsType<UnauthorizedResult>(result);
    }

    [Fact]
    public async Task Authenticate_ReturnsToken_WhenValidationSucceeds()
    {
        // Arrange
        var userDto = new UserForAuthenticationDto
        {
            UserName = "testuser",
            Password = "correctpassword"
        };

        var tokenDto = new TokenDto(AccessToken: "test-access-token", RefreshToken: "test-refresh-token");

        _mockAuthService.Setup(s => s.ValidateUser(It.IsAny<UserForAuthenticationDto>()))
            .ReturnsAsync(true);
        _mockAuthService.Setup(s => s.CreateToken(true))
            .ReturnsAsync(tokenDto);

        var controller = new AuthenticationController(_mockServiceManager.Object);

        // Act
        var result = await controller.Authenticate(userDto);

        // Assert
        var okResult = Assert.IsType<OkObjectResult>(result);
        var returnValue = Assert.IsType<TokenDto>(okResult.Value);
        Assert.Equal(tokenDto.AccessToken, returnValue.AccessToken);
        Assert.Equal(tokenDto.RefreshToken, returnValue.RefreshToken);
    }
}
