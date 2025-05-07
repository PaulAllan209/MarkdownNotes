using AutoMapper;
using LoggerService.Interfaces;
using Entities.Models;
using Markdig;
using markdown_note_taking_app.Server.Dto;
using markdown_note_taking_app.Server.Interfaces;
using markdown_note_taking_app.Server.Interfaces.ServiceInterface;
using Microsoft.AspNetCore.Http.HttpResults;
using Microsoft.EntityFrameworkCore;
using System.Text.RegularExpressions;

namespace markdown_note_taking_app.Server.Service
{
    public class MarkdownService : IMarkdownService
    {
        private readonly IRepositoryManager _repository;
        private readonly IGrammarCheckService _grammarCheckService;
        private readonly ILoggerManager _logger;
        private readonly IMapper _mapper;

        public MarkdownService(IRepositoryManager repository, IGrammarCheckService grammarCheckService, ILoggerManager logger, IMapper mapper)
        {
            _repository = repository;
            _logger = logger;
            _mapper = mapper;
            _grammarCheckService = grammarCheckService;
        }

        public async Task<MarkdownFileDto> CreateMarkdownFileAsync(MarkdownFileUploadDto markdownFile)
        {
            //Validate the file type
            ValidateMarkdownFile(markdownFile);

            string fileName = Path.GetFileName(markdownFile.MarkdownFile.FileName);

            //Read the file content into a string
            string fileContent;
            using(var reader = new StreamReader(markdownFile.MarkdownFile.OpenReadStream()))
            {
                fileContent = await reader.ReadToEndAsync();
            }

            //Create new MarkdownFileDto for creation in database and return value
            var MarkdownFileDto = new MarkdownFileDto
            {
                Id = Guid.NewGuid(),
                Title = fileName,
                FileContent = fileContent,
                UploadDate = DateTime.Now
            };

            // Last Step
            var markdownFileEntity = _mapper.Map<MarkdownFile>(MarkdownFileDto);
            _repository.MarkDown.CreateMarkdownFile(markdownFileEntity);
            await _repository.SaveAsync();

            return MarkdownFileDto;
        }

        public async Task DeleteMarkdownFileAsync(Guid fileId, bool trackChanges)
        {
            if (fileId == Guid.Empty)
                throw new ArgumentNullException("The file id cannot be empty.");

            var markdownFileEntity = await GetMarkdownFileAndCheckIfItExistsAsync(fileId, trackChanges);

            _repository.MarkDown.DeleteMarkdownFile(markdownFileEntity);
            await _repository.SaveAsync();
        }

        public async Task<IEnumerable<MarkdownFileDto>> GetAllMarkdownFilesAsync(bool trackChanges)
        {
            var markdownFileEntities = await _repository.MarkDown.GetAllMarkdownFilesAsync(trackChanges);
            var markdownFileDtos = _mapper.Map<IEnumerable<MarkdownFileDto>>(markdownFileEntities);
            return markdownFileDtos;
        }


        public async Task<MarkdownFileDto> GetMarkdownFileAsync(Guid fileId, bool checkGrammar, bool trackChanges)
        {
            if (fileId == Guid.Empty)
                throw new BadHttpRequestException("File Id cannot be empty");


            var markdownFileEntity = await GetMarkdownFileAndCheckIfItExistsAsync(fileId, trackChanges);
            var markdownFileDto = _mapper.Map<MarkdownFileDto>(markdownFileEntity);

            if (checkGrammar)
            {
                //check grammar
                string markdownFileContent = markdownFileDto.FileContent;

                string markdownFileContentChecked = await _grammarCheckService.CheckGrammarMarkdownAsync(markdownFileContent);
                markdownFileDto = markdownFileDto with { FileContent = markdownFileContentChecked };

                return markdownFileDto;
            }

            return markdownFileDto;
        }

        public async Task<MarkdownFile> GetMarkdownFileAndCheckIfItExistsAsync(Guid fileId, bool trackChanges)
        {
            var markDownFile = await _repository.MarkDown.GetMarkdownFileAsync(fileId, trackChanges);

            if (markDownFile == null)
                throw new FileNotFoundException($"The file with the file id \"{fileId}\" cannot be found");

            return markDownFile;
        }

        public async Task<MarkdownFileConvertToHtmlDto> GetMarkdownFileAsHtmlAsync(Guid fileId, bool checkGrammar, bool trackChanges)
        {
            if (fileId == Guid.Empty)
                throw new BadHttpRequestException("File Id cannot be empty");

            //Get markdownfile content
            var markdownFileDtoChecked = await GetMarkdownFileAsync(fileId, checkGrammar, false);

            //convert to html
            var markdownHtmlDtoChecked = ConvertMarkdownFileDtoToHtml(markdownFileDtoChecked);

            return markdownHtmlDtoChecked;
        }

        public MarkdownFileConvertToHtmlDto ConvertMarkdownFileDtoToHtml(MarkdownFileDto markdownFileDto)
        {

            //Gets the markdownFileDto content and convert it into html
            var markdownFile = _mapper.Map<MarkdownFile>(markdownFileDto);
            var pipeline = new MarkdownPipelineBuilder().UseAdvancedExtensions().Build();
            string markdown_content = markdownFile.FileContent;
            string markdown_html_content = Markdown.ToHtml(markdown_content, pipeline);

            //Create new MarkdownFileConvertToHtmlDto Assigns new value in the content of markdownFileDto
            var markdown_html_dto = new MarkdownFileConvertToHtmlDto()
            {
                Id = markdownFileDto.Id,
                Title = markdownFileDto.Title,
                FileContentAsHtml = markdown_html_content,
                UploadDate = markdownFileDto.UploadDate
            };

            return markdown_html_dto;
        }

        public async Task<(MarkdownFileDto markdownToPatch, MarkdownFile markdownFileEntity)> GetMarkdownForPatchAsync(Guid fileId, bool TrackChanges)
        {
            var Markdown = await _repository.MarkDown.GetMarkdownFileAsync(fileId, TrackChanges);
            if (Markdown is null)
                throw new Exception("Markdown file not found.");

            var markdownToPatch = _mapper.Map<MarkdownFileDto>(Markdown);

            return (markdownToPatch, Markdown);
        }

        public async Task SaveChangesForPatchAsync(MarkdownFileDto markdownToPatch, MarkdownFile markdownFileEntity)
        {
            _mapper.Map(markdownToPatch, markdownFileEntity);
            await _repository.SaveAsync();
        }

        private void ValidateMarkdownFile(MarkdownFileUploadDto file)
        {
            string fileName = file.MarkdownFile.FileName;
            string fileExtension = Path.GetExtension(fileName).ToLowerInvariant();

            if (fileExtension != ".md")
            {
                throw new BadHttpRequestException("Invalid file type uploaded. Only markdown (.md) files are allowed.");
            }
        }
    }
}
