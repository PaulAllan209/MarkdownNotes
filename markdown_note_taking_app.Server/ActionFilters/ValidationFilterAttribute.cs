using Microsoft.AspNetCore.Mvc;
using Microsoft.AspNetCore.Mvc.Filters;

namespace markdown_note_taking_app.Server.ActionFilters
{
    // This is a custom action filter that is designed to validate incoming request data in asp.net core controllers
    public class ValidationFilterAttribute : IActionFilter
    {
        public ValidationFilterAttribute()
        { }

        public void OnActionExecuting(ActionExecutingContext context) 
        {
            var action = context.RouteData.Values["action"];
            var controller = context.RouteData.Values["controller"];

            // This part looks for an action parameter whose name contains "Dto" e.g. UserForRegistrationDto
            // If no such parameter is found or any of the parameter is null, it sets the result to a BadRequestObjectResult with an error message.
            if (context.ActionArguments.Values.Any(v => v == null))
            {
                context.Result = new BadRequestObjectResult($"Object is null. Controller: {controller}, action: {action}");
                return;
            }

            // If the ModelState is invalid (e.g., validation attributes like [Required] fail), it sets the result to an UnprocessableEntityObjectResult containing the validation errors.
            if (!context.ModelState.IsValid)
                context.Result = new UnprocessableEntityObjectResult(context.ModelState);
        }
        public void OnActionExecuted(ActionExecutedContext context) { }
    }
}
