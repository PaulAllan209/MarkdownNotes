using LoggerService.Interfaces;
using Entities.Models;
using markdown_note_taking_app.Server.Dto;
using markdown_note_taking_app.Server.Interfaces.ServiceInterface;
using Microsoft.AspNetCore.Mvc;
using Azure;
using Microsoft.AspNetCore.JsonPatch;
using Microsoft.AspNetCore.Authorization;

namespace markdown_note_taking_app.Server.Controllers
{
    [Route("api/markdown")]
    [ApiController]
    public class MarkdownController : ControllerBase
    {
        private readonly IServiceManager _serviceManager;
        private readonly ILoggerManager _logger;

        public MarkdownController(IServiceManager serviceManager, ILoggerManager logger)
        {
            _serviceManager = serviceManager;
            _logger = logger;
        }

        [HttpPost]
        [Authorize]
        public async Task<IActionResult> UploadMarkdownFile([FromForm] MarkdownFileUploadDto markDownFile)
        {
            var userName = User.Identity?.Name;

            var MarkdownFileDto = await _serviceManager.MarkdownService.CreateMarkdownFileAsync(markDownFile, userName);

            return Ok(MarkdownFileDto);
        }

        [HttpGet("{fileId:guid}")]
        [Authorize]
        public async Task<IActionResult> GetMarkdownFile(Guid fileId, [FromQuery] bool checkGrammar = false)
        {
            var userName = User.Identity?.Name;

            var company = await _serviceManager.MarkdownService.GetMarkdownFileAsync(fileId, userName, checkGrammar, trackChanges: false);

            return Ok(company);
        }

        [HttpGet]
        [Authorize]
        public async Task<IActionResult> GetMarkdownFiles()
        {
            var userName = User.Identity?.Name;

            var markdownFiles = await _serviceManager.MarkdownService.GetAllMarkdownFilesAsync(userName, trackChanges: false);

            return Ok(markdownFiles);
        }

        [HttpGet("{fileId:guid}/html")]
        [Authorize]
        public async Task<IActionResult> GetMarkdownFileAsHtml(Guid fileId, [FromQuery] bool checkGrammar = false)
        {
            var userName = User.Identity?.Name;

            var markdownFileConvertToHtmlDto = await _serviceManager.MarkdownService.GetMarkdownFileAsHtmlAsync(fileId, userName, checkGrammar, trackChanges: false);
            return Ok(markdownFileConvertToHtmlDto);
        }

        [HttpPatch("{fileId:guid}")]
        [Authorize]
        public async Task<IActionResult> PatchMarkdownFile(Guid fileId, [FromBody] JsonPatchDocument<MarkdownFileDto> patchDoc)
        {
            if (patchDoc is null)
            {
                return BadRequest("patchDoc object sent from client is null.");
            }

            var userName = User.Identity?.Name;

            var markdownFile = await _serviceManager.MarkdownService.GetMarkdownForPatchAsync(fileId, userName, TrackChanges: true);

            patchDoc.ApplyTo(markdownFile.markdownToPatch);

            await _serviceManager.MarkdownService.SaveChangesForPatchAsync(markdownFile.markdownToPatch, markdownFile.markdownFileEntity);

            return NoContent();
        }

        [HttpDelete("{fileId:guid}")]
        [Authorize]
        public async Task<IActionResult> DeleteMarkdownFile(Guid fileId)
        {
            var userName = User.Identity?.Name;

            await _serviceManager.MarkdownService.DeleteMarkdownFileAsync(fileId, userName, trackChanges: false);

            return Ok();
        }
    }
}
