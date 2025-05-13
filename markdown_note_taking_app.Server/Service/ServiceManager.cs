using AutoMapper;
using LoggerService.Interfaces;
using markdown_note_taking_app.Server.Interfaces;
using markdown_note_taking_app.Server.Interfaces.ServiceInterface;
using markdown_note_taking_app.Server.Models;
using Microsoft.AspNetCore.Identity;

namespace markdown_note_taking_app.Server.Service
{
    public sealed class ServiceManager : IServiceManager
    {
        private readonly Lazy<IMarkdownService> _markdownService;
        private readonly Lazy<IGrammarCheckService> _grammarCheckService;
        private readonly Lazy<IAuthenticationService> _authenticationService;


        public ServiceManager(
            IRepositoryManager repositoryManager,
            IGrammarCheckService grammarCheckService,
            ILoggerManager logger,
            IMapper mapper,
            UserManager<User> userManager,
            IConfiguration configuration)
        {
            _markdownService = new Lazy<IMarkdownService>(() => new MarkdownService(repositoryManager, grammarCheckService, userManager, logger, mapper));
            _grammarCheckService = new Lazy<IGrammarCheckService>(() => grammarCheckService);
            _authenticationService = new Lazy<IAuthenticationService>(() => new AuthenticationService(logger, mapper, userManager, configuration));
        }
        public IMarkdownService MarkdownService => _markdownService.Value;
        public IGrammarCheckService GrammarCheckService => _grammarCheckService.Value;
        public IAuthenticationService AuthenticationService => _authenticationService.Value;
    }
}
