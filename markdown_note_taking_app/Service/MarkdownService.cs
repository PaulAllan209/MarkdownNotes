using AutoMapper;
using Contracts;
using Entities.Models;
using Markdig;
using markdown_note_taking_app.Dto;
using markdown_note_taking_app.Interfaces;
using markdown_note_taking_app.Interfaces.ServiceInterface;
using Microsoft.AspNetCore.Http.HttpResults;
using Microsoft.EntityFrameworkCore;
using System.Text.RegularExpressions;

namespace markdown_note_taking_app.Service
{
    public class MarkdownService : IMarkdownService
    {
        private readonly IRepositoryManager _repository;
        private readonly ILoggerManager _logger;
        private readonly IMapper _mapper;

        public MarkdownService(IRepositoryManager repository, ILoggerManager logger, IMapper mapper)
        {
            _repository = repository;
            _logger = logger;
            _mapper = mapper;
        }

        public async Task<MarkdownFileDto> CreateMarkdownFileAsync(MarkdownFileUploadDto markdownFile)
        {
            //Validate the file content if empty and if it is a markdown file
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


        public async Task<MarkdownFileDto> GetMarkdownFileAsync(Guid fileId, bool trackChanges)
        {
            if (fileId == Guid.Empty)
                throw new BadHttpRequestException("File Id cannot be empty");

            var markdownFileEntity = await GetMarkdownFileAndCheckIfItExistsAsync(fileId, trackChanges);
            return _mapper.Map<MarkdownFileDto>(markdownFileEntity);
        }

        public async Task<MarkdownFile> GetMarkdownFileAndCheckIfItExistsAsync(Guid fileId, bool trackChanges)
        {
            var markDownFile = await _repository.MarkDown.GetMarkdownFileAsync(fileId, trackChanges);

            if (markDownFile == null)
                throw new FileNotFoundException($"The file with the file id \"{fileId}\" cannot be found");

            return markDownFile;
        }

        public async Task<MarkdownFileConvertToHtmlDto> GetMarkdownFileAsHtmlAsync(Guid fileId, bool trackChanges)
        {
            if (fileId == Guid.Empty)
                throw new BadHttpRequestException("File Id cannot be empty");

            var markdownFile = await GetMarkdownFileAndCheckIfItExistsAsync(fileId, trackChanges);

            var markdownFileDto = _mapper.Map<MarkdownFileDto>(markdownFile);

            MarkdownFileConvertToHtmlDto markdown_html_dto = ConvertMarkdownFileDtoToHtml(markdownFileDto);

            return markdown_html_dto;
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

        private void ValidateMarkdownFile(MarkdownFileUploadDto file)
        {
            string fileName = file.MarkdownFile.FileName;
            string fileExtension = Path.GetExtension(fileName).ToLowerInvariant();

            if (fileExtension != ".md")
            {
                throw new BadHttpRequestException("Invalid file type uploaded. Only markdown (.md) files are allowed.");
            }

            if (file == null || file.MarkdownFile.Length == 0)
                throw new BadHttpRequestException("The file is empty");
        }
    }
}
