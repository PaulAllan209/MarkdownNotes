using LoggerService.Interfaces;
using Entities.Models;
using markdown_note_taking_app.Server.Dto;
using markdown_note_taking_app.Server.Interfaces.ServiceInterface;
using Microsoft.AspNetCore.Mvc;
using Azure;
using Microsoft.AspNetCore.JsonPatch;

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

        [HttpGet("{fileId:guid}")]
        public async Task<IActionResult> GetMarkdownFile(Guid fileId)
        {
            var company = await _serviceManager.MarkdownService.GetMarkdownFileAsync(fileId, trackChanges: false);

            return Ok(company);
        }

        [HttpGet]
        public async Task<IActionResult> GetMarkdownFiles()
        {
            var markdownFiles = await _serviceManager.MarkdownService.GetAllMarkdownFilesAsync(trackChanges: false);

            return Ok(markdownFiles);
        }

        [HttpGet("{fileId:guid}/html")]
        public async Task<IActionResult> GetMarkdownFileAsHtml(Guid fileId, [FromQuery] bool checkGrammar = false)
        {
            var markdownFileConvertToHtmlDto = await _serviceManager.MarkdownService.GetMarkdownFileAsHtmlAsync(fileId, checkGrammar, trackChanges: false);
            return Ok(markdownFileConvertToHtmlDto);
        }

        [HttpPost]
        public async Task<IActionResult> UploadMarkdownFile([FromForm] MarkdownFileUploadDto markDownFile)
        {
            var MarkdownFileDto = await _serviceManager.MarkdownService.CreateMarkdownFileAsync(markDownFile);

            return Ok(MarkdownFileDto);
        }

        [HttpPatch("{fileId:guid}")]
        public async Task<IActionResult> PatchMarkdownFile(Guid fileId, [FromBody] JsonPatchDocument<MarkdownFileDto> patchDoc)
        {
            if (patchDoc is null)
            {
                return BadRequest("patchDoc object sent from client is null.");
            }
            var markdownFile = await _serviceManager.MarkdownService.GetMarkdownForPatchAsync(fileId, TrackChanges: true);

            patchDoc.ApplyTo(markdownFile.markdownToPatch);

            await _serviceManager.MarkdownService.SaveChangesForPatchAsync(markdownFile.markdownToPatch, markdownFile.markdownFileEntity);

            return NoContent();
        }

        [HttpDelete("{fileId:guid}")]
        public async Task<IActionResult> DeleteMarkdownFile(Guid fileId)
        {
            await _serviceManager.MarkdownService.DeleteMarkdownFileAsync(fileId, trackChanges: false);

            return Ok();
        }


    }
}
