using AutoMapper;
using Contracts;
using markdown_note_taking_app.Interfaces;
using markdown_note_taking_app.Interfaces.ServiceInterface;

namespace markdown_note_taking_app.Service
{
    public class ServiceManager : IServiceManager
    {
        private readonly Lazy<IMarkdownService> _markdownService;
        private readonly Lazy<IGrammarCheckService> _grammarCheckService;


        public ServiceManager(
            IRepositoryManager repositoryManager,
            IGrammarCheckService grammarCheckService,
            ILoggerManager logger,
            IMapper mapper)
        {
            _markdownService = new Lazy<IMarkdownService>(() => new MarkdownService(repositoryManager, grammarCheckService, logger, mapper));
            _grammarCheckService = new Lazy<IGrammarCheckService>(() => grammarCheckService);
        }
        public IMarkdownService MarkdownService => _markdownService.Value;
        public IGrammarCheckService GrammarCheckService => _grammarCheckService.Value;
    }
}
