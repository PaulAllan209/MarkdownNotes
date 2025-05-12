using markdown_note_taking_app.Server.Dto;
using Microsoft.AspNetCore.Identity;

namespace markdown_note_taking_app.Server.Interfaces.ServiceInterface
{
    public interface IAuthenticationService
    {
        Task<IdentityResult> RegisterUser(UserForRegistrationDto userForRegistration);
        Task<bool> ValidateUser(UserForAuthenticationDto userForAuth);
        Task<string> CreateToken();
    }
}
