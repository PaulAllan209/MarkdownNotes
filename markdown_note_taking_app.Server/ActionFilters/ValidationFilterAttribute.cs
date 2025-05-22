using Microsoft.AspNetCore.Mvc;
using Microsoft.AspNetCore.Mvc.Filters;

namespace markdown_note_taking_app.Server.ActionFilters
{
    // This is a custom action filter that is designed to validate incoming request data in asp.net core controllers
    public class ValidationFilterAttribute : IActionFilter
    {
        private readonly ILogger<ValidationFilterAttribute> _logger;
        public ValidationFilterAttribute(ILogger<ValidationFilterAttribute> logger)
        {
            _logger = logger;
        }

        public void OnActionExecuting(ActionExecutingContext context) 
        {
            var action = context.RouteData.Values["action"];
            var controller = context.RouteData.Values["controller"];

            // Check if any parameter is null
            var nullParams = context.ActionArguments
                .Where(p => p.Value == null)
                .Select(p => p.Key)
                .ToList();

            if (nullParams.Any())
            {
                _logger.LogWarning("Null parameters detected for {Controller}.{Action}: {Parameters}",
                    controller, action, string.Join(", ", nullParams));

                context.Result = new BadRequestObjectResult($"The following parameters are null: {string.Join(", ", nullParams)}");
                return;
            }

            // If the ModelState is invalid (e.g., validation attributes like [Required] fail), it sets the result to an UnprocessableEntityObjectResult containing the validation errors.
            if (!context.ModelState.IsValid)
                context.Result = new UnprocessableEntityObjectResult(context.ModelState);
        }
        public void OnActionExecuted(ActionExecutedContext context) { }
    }
}
