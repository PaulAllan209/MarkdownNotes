using markdown_note_taking_app.Server.ActionFilters;
using markdown_note_taking_app.Server.Dto;
using markdown_note_taking_app.Server.Interfaces.ServiceInterface;
using markdown_note_taking_app.Server.Utilities;
using Microsoft.AspNetCore.Mvc;

namespace markdown_note_taking_app.Server.Controllers
{
    [Route("api/authentication")]
    [ApiController]
    public class AuthenticationController : ControllerBase
    {
        private readonly IServiceManager _serviceManager;

        public AuthenticationController(IServiceManager serviceManager)
        {
            _serviceManager = serviceManager;
        }

        [HttpPost]
        [ServiceFilter(typeof(ValidationFilterAttribute))]
        public async Task<IActionResult> RegisterUser([FromBody] UserForRegistrationDto userForRegistration)
        {
            var result = await _serviceManager.AuthenticationService.RegisterUser(userForRegistration);

            if (!result.Succeeded)
            {
                foreach(var error in result.Errors)
                {
                    ModelState.TryAddModelError(error.Code, error.Description);
                }
                return BadRequest(ModelState);
            }

            // Create the default welcome file
            string fileName = DefaultMarkdownFile.GetDefaultFileName();
            string fileContent = DefaultMarkdownFile.GetWelcomeFileContent();

            await _serviceManager.MarkdownService.CreateDefaultMarkdownFileAsync(fileName, fileContent, userForRegistration.UserName);

            return StatusCode(201);
        }

        [HttpPost("login")]
        [ServiceFilter(typeof(ValidationFilterAttribute))]
        public async Task<IActionResult> Authenticate([FromBody] UserForAuthenticationDto user)
        {
            // Validate user method assigns a value to private attribute _user
            // _user will be used by CreateToken method that is why no parameters are passed on it
            if (!await _serviceManager.AuthenticationService.ValidateUser(user))
                return Unauthorized();

            // No parameters are passed on CreateToken method because _user attribute already have a value
            var tokenDto = await _serviceManager.AuthenticationService.CreateToken(populateExp: true);

            return Ok(tokenDto);
        }
    }
}
