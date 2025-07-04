﻿using AutoMapper;
using LoggerService.Interfaces;
using Entities.Models;
using Markdig;
using markdown_note_taking_app.Server.Dto;
using markdown_note_taking_app.Server.Interfaces;
using markdown_note_taking_app.Server.Interfaces.ServiceInterface;
using Microsoft.AspNetCore.Http.HttpResults;
using Microsoft.EntityFrameworkCore;
using System.Text.RegularExpressions;
using markdown_note_taking_app.Server.Exceptions;
using Microsoft.AspNetCore.Identity;
using markdown_note_taking_app.Server.Models;
using Ganss.Xss;

namespace markdown_note_taking_app.Server.Service
{
    public class MarkdownService : IMarkdownService
    {
        private readonly IRepositoryManager _repository;
        private readonly IGrammarCheckService _grammarCheckService;
        private readonly ILoggerManager _logger;
        private readonly IMapper _mapper;
        private readonly UserManager<User> _userManager;

        public MarkdownService(IRepositoryManager repository, IGrammarCheckService grammarCheckService, UserManager<User> userManager, ILoggerManager logger, IMapper mapper)
        {
            _repository = repository;
            _grammarCheckService = grammarCheckService;
            _userManager = userManager;
            _logger = logger;
            _mapper = mapper;
        }

        public async Task<MarkdownFileDto> CreateMarkdownFileAsync(MarkdownFileUploadDto markdownFile, string userName)
        {
            //Validate the file type
            ValidateMarkdownFile(markdownFile);

            // Get userId first
            var user = await _userManager.FindByNameAsync(userName);
            var userId = user?.Id;

            string fileName = Path.GetFileNameWithoutExtension(markdownFile.MarkdownFile.FileName);

            //Read the file content into a string
            string fileContent;
            using(var reader = new StreamReader(markdownFile.MarkdownFile.OpenReadStream()))
            {
                fileContent = await reader.ReadToEndAsync();
            }

            // Sanitize markdown content to prevent XSS
            fileContent = ContentSanitizer(fileContent);

            // Don't forget the file title
            fileName = ContentSanitizer(fileName);

            //Create new MarkdownFileDto for creation in database and return value
            var markdownFileCreationDto = new MarkdownFileCreationDto
            {
                Id = Guid.NewGuid(),
                Title = fileName,
                FileContent = fileContent,
                UploadDate = DateTime.Now,
                UserId = userId
            };

            // Last Step
            var markdownFileEntity = _mapper.Map<MarkdownFile>(markdownFileCreationDto);
            _repository.MarkDown.CreateMarkdownFile(markdownFileEntity);
            await _repository.SaveAsync();

            // Dto for returning to the client
            var markdownFileDto = _mapper.Map<MarkdownFileDto>(markdownFileEntity);

            return markdownFileDto;
        }

        public async Task<MarkdownFileDto> CreateDefaultMarkdownFileAsync(string fileName, string fileContent, string userName)
        {
            // Get userId first
            var user = await _userManager.FindByNameAsync(userName);
            var userId = user?.Id;

            var defaultMarkdownFileDto = new MarkdownFileCreationDto
            {
                Id = Guid.NewGuid(),
                Title = fileName,
                FileContent = fileContent,
                UploadDate = DateTime.Now,
                UserId = userId
            };

            var markdownFileEntity = _mapper.Map<MarkdownFile>(defaultMarkdownFileDto);
            _repository.MarkDown.CreateMarkdownFile(markdownFileEntity);
            await _repository.SaveAsync();

            var markdownFileDto = _mapper.Map<MarkdownFileDto>(markdownFileEntity);

            return markdownFileDto;
        }

        public async Task<IEnumerable<MarkdownFileDto>> GetAllMarkdownFilesAsync(string userName, bool trackChanges)
        {
            // Get userId first
            var user = await _userManager.FindByNameAsync(userName);
            var userId = user?.Id;

            var markdownFileEntities = await _repository.MarkDown.GetAllMarkdownFilesAsync(userId, trackChanges);
            var markdownFileDtos = _mapper.Map<IEnumerable<MarkdownFileDto>>(markdownFileEntities);
            return markdownFileDtos;
        }


        public async Task<MarkdownFileDto> GetMarkdownFileAsync(Guid fileId, string userName, bool checkGrammar, bool trackChanges)
        {
            if (fileId == Guid.Empty)
                throw new InvalidMarkdownFileNameException();

            var markdownFileEntity = await GetMarkdownFileAndCheckIfItExistsAsync(fileId, userName, trackChanges);

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

        public async Task<MarkdownFile> GetMarkdownFileAndCheckIfItExistsAsync(Guid fileId, string userName, bool trackChanges)
        {
            // Get userId first
            var user = await _userManager.FindByNameAsync(userName);
            var userId = user?.Id;

            var markDownFile = await _repository.MarkDown.GetMarkdownFileAsync(fileId, userId, trackChanges);

            if (markDownFile is null)
                throw new MarkdownFileNotFoundException(fileId);

            return markDownFile;
        }

        public async Task<MarkdownFileConvertToHtmlDto> GetMarkdownFileAsHtmlAsync(Guid fileId, string userName, bool checkGrammar, bool trackChanges)
        {
            if (fileId == Guid.Empty)
                throw new InvalidMarkdownFileNameException();

            //Get markdownfile content
            var markdownFileDtoChecked = await GetMarkdownFileAsync(fileId, userName, checkGrammar, false);

            //convert to html
            var markdownHtmlDtoChecked = ConvertMarkdownFileDtoToHtml(markdownFileDtoChecked);

            return markdownHtmlDtoChecked;
        }

        public async Task DeleteMarkdownFileAsync(Guid fileId, string userName, bool trackChanges)
        {
            if (fileId == Guid.Empty)
                throw new InvalidMarkdownFileNameException();

            var markdownFileEntity = await GetMarkdownFileAndCheckIfItExistsAsync(fileId, userName, trackChanges);

            _repository.MarkDown.DeleteMarkdownFile(markdownFileEntity);
            await _repository.SaveAsync();
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

        public async Task<(MarkdownFileDto markdownToPatch, MarkdownFile markdownFileEntity)> GetMarkdownForPatchAsync(Guid fileId, string userName, bool TrackChanges)
        {
            // Get userId first
            var user = await _userManager.FindByNameAsync(userName);
            var userId = user?.Id;

            var Markdown = await _repository.MarkDown.GetMarkdownFileAsync(fileId, userId, TrackChanges);

            var markdownToPatch = _mapper.Map<MarkdownFileDto>(Markdown);

            return (markdownToPatch, Markdown);
        }

        public async Task SaveChangesForPatchAsync(MarkdownFileDto markdownToPatch, MarkdownFile markdownFileEntity)
        {
            // Sanitize for XSS
            var sanitized = markdownToPatch with
            {
                Title = ContentSanitizer(markdownToPatch.Title),
                FileContent = ContentSanitizer(markdownToPatch.FileContent)
            };

            _mapper.Map(sanitized, markdownFileEntity);
            await _repository.SaveAsync();
        }

        private void ValidateMarkdownFile(MarkdownFileUploadDto file)
        {
            string fileName = file.MarkdownFile.FileName;
            string fileExtension = Path.GetExtension(fileName).ToLowerInvariant();

            if (fileExtension != ".md")
            {
                throw new InvalidMarkdownFileTypeException(fileName);
            }
        }

        private string ContentSanitizer(string fileContent)
        {
            var sanitizer = new HtmlSanitizer();
            return sanitizer.Sanitize(fileContent);
        }
    }
}
