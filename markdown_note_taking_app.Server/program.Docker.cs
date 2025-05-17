// Only compile this file when the DOCKER symbol is defined
#if DOCKER
public class DockerStartupExtension
{
    public static void ConfigureForDocker(WebApplicationBuilder builder)
    {
        // Skip HTTPS redirection in Docker
        builder.Services.AddSingleton<IStartupFilter, DisableHttpsRedirectionStartupFilter>();
    }
}

public class DisableHttpsRedirectionStartupFilter : IStartupFilter
{
    public Action<IApplicationBuilder> Configure(Action<IApplicationBuilder> next)
    {
        return app =>
        {
            // Skip HTTPS redirection
            next(app);
        };
    }
}
#endif