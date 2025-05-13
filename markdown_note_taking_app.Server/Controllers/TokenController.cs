using markdown_note_taking_app.Server.ActionFilters;
using markdown_note_taking_app.Server.Dto;
using markdown_note_taking_app.Server.Interfaces.ServiceInterface;
using Microsoft.AspNetCore.Mvc;

namespace markdown_note_taking_app.Server.Controllers
{
    [Route("api/token")]
    [ApiController]
    public class TokenController : ControllerBase
    {
        private readonly IServiceManager _service;
        public TokenController(IServiceManager service)
        {
            _service = service;
        }

        [HttpPost("refresh")]
        [ServiceFilter(typeof(ValidationFilterAttribute))]
        public async Task<IActionResult> Refresh([FromBody] TokenDto tokenDto)
        {
            var tokenDtoToReturn = await _service.AuthenticationService.RefreshToken(tokenDto);

            return Ok(tokenDtoToReturn);
        }

    }
}
