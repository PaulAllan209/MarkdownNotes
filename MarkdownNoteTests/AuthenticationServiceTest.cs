using AutoMapper;
using LoggerService.Interfaces;
using markdown_note_taking_app.Server.Dto;
using markdown_note_taking_app.Server.Models;
using markdown_note_taking_app.Server.Service;
using Microsoft.AspNetCore.Identity;
using Microsoft.Extensions.Configuration;
using Moq;
using Moq.Protected;
using System.IdentityModel.Tokens.Jwt;
using System.Security.Claims;
using Xunit.Abstractions;

namespace MarkdownNoteTests;

public class AuthenticationServiceTest
{
    private readonly ITestOutputHelper _output;
    private readonly Mock<ILoggerManager> _mockLogger;
    private readonly Mock<IMapper> _mockMapper;
    private readonly Mock<UserManager<User>> _mockUserManager;
    private readonly Mock<IConfiguration> _mockConfiguration;
    private readonly Mock<IConfigurationSection> _mockJwtSection;
    private readonly AuthenticationService _authService;

    public AuthenticationServiceTest(ITestOutputHelper output)
    {
        _output = output;
        _mockLogger = new Mock<ILoggerManager>();
        _mockMapper = new Mock<IMapper>();

        // UserManager required special setup since it's an abstract class with no parameterless constructor
        var userStoreMock = new Mock<IUserStore<User>>();
        _mockUserManager = new Mock<UserManager<User>>(
            userStoreMock.Object, null, null, null, null, null, null, null, null);

        // Configuration setup for JWT settings
        _mockJwtSection = new Mock<IConfigurationSection>();
        _mockJwtSection.Setup(s => s["validIssuer"]).Returns("https://localhost:5001");
        _mockJwtSection.Setup(s => s["validAudience"]).Returns("https://localhost:5001");
        _mockJwtSection.Setup(s => s["expires"]).Returns("15");

        _mockConfiguration = new Mock<IConfiguration>();
        _mockConfiguration.Setup(c => c.GetSection("JwtSettings")).Returns(_mockJwtSection.Object);

        // Create the service with mocked dependencies
        _authService = new AuthenticationService(
            _mockLogger.Object,
            _mockMapper.Object,
            _mockUserManager.Object,
            _mockConfiguration.Object);

        // Set environment variable for JWT secret
        Environment.SetEnvironmentVariable("SECRET", "TestSecretKeyForJWTMustBeAtLeast32BytesLong");
    }

    [Fact]
    public async Task RegisterUser_ReturnsSuccess_WithValidData()
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

        var user = new User
        {
            FirstName = "Test",
            LastName = "User",
            UserName = "testuser",
            Email = "test@example.com"
        };

        _mockMapper.Setup(m => m.Map<User>(It.IsAny<UserForRegistrationDto>()))
                .Returns(user);

        _mockUserManager.Setup(m => m.CreateAsync(It.IsAny<User>(), It.IsAny<string>()))
            .ReturnsAsync(IdentityResult.Success);

        _mockUserManager.Setup(m => m.AddToRolesAsync(It.IsAny<User>(), It.IsAny<IEnumerable<string>>()))
            .ReturnsAsync(IdentityResult.Success);

        // Act
        var result = await _authService.RegisterUser(userDto);

        // Assert
        Assert.True(result.Succeeded);
        _mockUserManager.Verify(m => m.CreateAsync(It.IsAny<User>(), It.IsAny<string>()), Times.Once);
        _mockUserManager.Verify(m => m.AddToRolesAsync(It.IsAny<User>(), It.IsAny<IEnumerable<string>>()), Times.Once);
    }

    [Fact]
    public async Task ValidateUser_ReturnsTrue_WithCorrectCredentials()
    {
        // Arrange
        var userDto = new UserForAuthenticationDto
        {
            UserName = "testuser",
            Password = "Password123!"
        };

        var user = new User
        {
            UserName = "testuser",
            Email = "test@example.com"
        };

        _mockUserManager.Setup(m => m.FindByNameAsync(userDto.UserName))
            .ReturnsAsync(user);

        _mockUserManager.Setup(m => m.CheckPasswordAsync(user, userDto.Password))
            .ReturnsAsync(true);

        // Act
        var result = await _authService.ValidateUser(userDto);

        // Assert
        Assert.True(result);
    }

    [Fact]
    public async Task ValidateUser_ReturnsFalse_WithIncorrectCredentials()
    {
        // Arrange
        var userDto = new UserForAuthenticationDto
        {
            UserName = "testuser",
            Password = "WrongPassword"
        };

        var user = new User
        {
            UserName = "testuser",
            Email = "test@example.com"
        };

        _mockUserManager.Setup(m => m.FindByNameAsync(userDto.UserName))
            .ReturnsAsync(user);

        _mockUserManager.Setup(m => m.CheckPasswordAsync(user, userDto.Password))
            .ReturnsAsync(false);

        // Act
        var result = await _authService.ValidateUser(userDto);

        // Assert
        Assert.False(result);
    }

    [Fact]
    public async Task CreateToken_ReturnsValidToken_WhenUserIsAuthenticated()
    {
        // Arrange
        var user = new User
        {
            Id = Guid.NewGuid().ToString(),
            UserName = "testuser",
            Email = "test@example.com"
        };

        // First we need to set up the ValidateUser behavior
        var userDto = new UserForAuthenticationDto
        {
            UserName = "testuser",
            Password = "Password123!"
        };

        _mockUserManager.Setup(m => m.FindByNameAsync(userDto.UserName))
            .ReturnsAsync(user);

        _mockUserManager.Setup(m => m.CheckPasswordAsync(user, userDto.Password))
            .ReturnsAsync(true);

        // Need to set up GetRolesAsync as it's used in token creation
        // This test does not cover administrator role as it is not needed currently
        _mockUserManager.Setup(m => m.GetRolesAsync(user))
            .ReturnsAsync(new List<string> { "User" });

        // ValidateUser needs to be called first to set the _user field
        await _authService.ValidateUser(userDto);

        // Act
        var token = await _authService.CreateToken(true);

        // Assert
        Assert.NotNull(token);
        Assert.NotNull(token.AccessToken);
        Assert.NotNull(token.RefreshToken);

        // Verify that token can be decoded
        var tokenHandler = new JwtSecurityTokenHandler();
        var decodedToken = tokenHandler.ReadJwtToken(token.AccessToken);

        // Verify claims in token
        Assert.Contains(decodedToken.Claims,
            c => c.Type == ClaimTypes.Name && c.Value == user.UserName);
        Assert.Contains(decodedToken.Claims,
            c => c.Type == ClaimTypes.Role && c.Value == "User");
    }

    [Fact]
    public async Task RefreshToken_ReturnsNewToken_WhenValidRefreshTokenProvided()
    {
        // Arrange
        var user = new User
        {
            Id = Guid.NewGuid().ToString(),
            UserName = "testuser",
            Email = "test@example.com",
            RefreshToken = "valid-refresh-token",
            RefreshTokenExpiryTime = DateTime.Now.AddDays(7) // Not expired
        };

        var expiredToken = "expired-jwt-token";
        var tokenDto = new TokenDto(expiredToken, "valid-refresh-token");

        // Setup for GetPrincipalFromExpiredToken method
        var identity = new ClaimsIdentity(new[] { new Claim(ClaimTypes.Name, "testuser") });
        var principal = new ClaimsPrincipal(identity);

        // Use reflection to access private method
        var methodInfo = typeof(AuthenticationService).GetMethod("GetPrincipalFromExpiredToken",
            System.Reflection.BindingFlags.NonPublic | System.Reflection.BindingFlags.Instance);

        // Replace the private method behavior using Moq's callback
        _mockUserManager.Setup(m => m.FindByNameAsync("testuser")).ReturnsAsync(user);
        _mockUserManager.Setup(m => m.UpdateAsync(It.IsAny<User>())).ReturnsAsync(IdentityResult.Success);
        _mockUserManager.Setup(m => m.GetRolesAsync(It.IsAny<User>())).ReturnsAsync(new List<string> { "User" });

        // Create a partial mock of AuthenticationService to mock the private method
        var authServiceMock = new Mock<AuthenticationService>(_mockLogger.Object, _mockMapper.Object,
            _mockUserManager.Object, _mockConfiguration.Object)
        { CallBase = true };

        authServiceMock.Protected()
            .Setup<ClaimsPrincipal>("GetPrincipalFromExpiredToken", ItExpr.IsAny<string>())
            .Returns(principal);

        // Act
        var result = await authServiceMock.Object.RefreshToken(tokenDto);

        // Assert
        Assert.NotNull(result);
        Assert.NotEqual(expiredToken, result.AccessToken);
        Assert.NotEqual(tokenDto.RefreshToken, result.RefreshToken);
    }
}
