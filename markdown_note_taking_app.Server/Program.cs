using LoggerService.Interfaces;
using markdown_note_taking_app.Server;
using markdown_note_taking_app.Server.ActionFilters;
using markdown_note_taking_app.Server.Extensions;
using markdown_note_taking_app.Server.Interfaces.ServiceInterface;
using markdown_note_taking_app.Server.Service;
using Microsoft.AspNetCore.Builder;
using Microsoft.AspNetCore.HttpOverrides;
using Microsoft.AspNetCore.Mvc;
using Microsoft.AspNetCore.Mvc.Formatters;
using Microsoft.Extensions.Options;
using NLog;

// This code block is needed so that AuthenticationService which is an internal sealed class
// can be accessed in the unittests
using System.Runtime.CompilerServices;
[assembly: InternalsVisibleTo("MarkdownNoteTests")]
[assembly: InternalsVisibleTo("DynamicProxyGenAssembly2")] // Required for Moq to work with internal types

var builder = WebApplication.CreateBuilder(args);

//Cors config which allows for any origin, method, and headers
builder.Services.ConfigureCors();

//IIS integration for app deployment
builder.Services.ConfigureIISIntegration();

//Grammar checking service
builder.Services.ConfigureGrammarCheckService();

//HttpClient factory
builder.Services.ConfigureHttpClientService();

//Repository and Service manager
builder.Services.ConfigureRepositoryManager();
builder.Services.ConfigureServiceManager();

//AutoMapper
builder.Services.AddAutoMapper(typeof(Program).Assembly);

//Logger
LogManager.Setup().LoadConfigurationFromFile(
    string.Concat(Directory.GetCurrentDirectory(), "/nlog.config"),
    optional: false);

//Configure for sqlServer
builder.Services.ConfigureSqlContext(builder.Configuration);

// Add services to the container.
builder.Services.ConfigureLoggerService();

builder.Services.AddControllers().AddNewtonsoftJson();
// Learn more about configuring Swagger/OpenAPI at https://aka.ms/aspnetcore/swashbuckle
builder.Services.AddEndpointsApiExplorer();
builder.Services.AddSwaggerGen();

// Custom action filters
builder.Services.AddScoped<ValidationFilterAttribute>();

//Jwt authentication and authorization
builder.Services.AddAuthentication();
builder.Services.ConfigureIdentity();
builder.Services.ConfigureJWT(builder.Configuration);

// Disable ASP.NET Core's automatic model state validation which returns 400 Bad Request.
// This allows our custom ValidationFilterAttribute to handle validation failures consistently
// by returning 422 Unprocessable Entity status code, which is the appropriate status code
// for semantic validation errors according to RFC 4918.
builder.Services.Configure<ApiBehaviorOptions>(options =>
{
    options.SuppressModelStateInvalidFilter = true;
});

var app = builder.Build();

var logger = app.Services.GetRequiredService<ILoggerManager>();
app.ConfigureExceptionHandler(logger);

// Configure the HTTP request pipeline.
if (app.Environment.IsDevelopment())
{
    //app.UseDeveloperExceptionPage(); // This one is commented out so that it will not override the custom global exception handler
    app.UseSwagger();
    app.UseSwaggerUI();
}
else
{
    app.UseHsts();
}

app.UseHttpsRedirection();
app.UseStaticFiles();
app.UseForwardedHeaders(new ForwardedHeadersOptions
{
    ForwardedHeaders = ForwardedHeaders.All
});

app.UseCors("CorsPolicy");

//Jwt authentication and authorization
app.UseAuthentication();
app.UseAuthorization();

app.MapControllers();

// This is for docker initialization of database inside docker
app.InitializeDatabase();
app.Run();
