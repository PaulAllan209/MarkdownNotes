using markdown_note_taking_app.Server.Dto;

namespace markdown_note_taking_app.Server.Exceptions
{
    public sealed class RefreshTokenBadRequest : BadRequestException
    {
        public TokenDto? TokenDetails { get; }
        public RefreshTokenBadRequest()
            : base("Invalid client request. The tokenDto has some invalid values.")
        {
        }

        public RefreshTokenBadRequest(TokenDto tokenDto) 
            : base($"Invalid client request: TokenDto values: \n" +
                  $"AccessToken: {tokenDto.AccessToken} \n" +
                  $"RefreshToken: {tokenDto.RefreshToken} \n")
        {
        }
    }
}
