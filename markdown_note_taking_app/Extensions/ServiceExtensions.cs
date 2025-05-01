using Contracts;
using LoggerService;
using markdown_note_taking_app.Data;
using markdown_note_taking_app.Interfaces;
using markdown_note_taking_app.Interfaces.ServiceInterface;
using markdown_note_taking_app.Repositories;
using markdown_note_taking_app.Service;
using Microsoft.EntityFrameworkCore;
using Microsoft.Extensions.DependencyInjection;

namespace markdown_note_taking_app.Extensions
{
    public static class ServiceExtensions
    {
        public static void ConfigureCors(this IServiceCollection services) =>
            services.AddCors(options =>
            {
                options.AddPolicy("CorsPolicy", builder =>
                builder.AllowAnyOrigin()
                .AllowAnyMethod()
                .AllowAnyHeader());
            });

        public static void ConfigureIISIntegration(this IServiceCollection services) =>
            services.Configure<IISOptions>(options =>
            {
            });

        public static void ConfigureRepositoryManager(this IServiceCollection services) =>
            services.AddScoped<IRepositoryManager, RepositoryManager>();

        public static void ConfigureServiceManager(this IServiceCollection services) =>
            services.AddScoped<IServiceManager, ServiceManager>();

        public static void ConfigureHttpClientService(this IServiceCollection services)
        {
            services.AddScoped<IHttpClientServiceImplementation, HttpClientFactoryService>();
            services.AddHttpClient();
        }

        public static void ConfigureSqlContext(this IServiceCollection services, IConfiguration configuration) =>
            services.AddDbContext<DataContext>(opts => opts.UseSqlServer(configuration.GetConnectionString("sqlConnection")));


        public static void ConfigureLoggerService(this IServiceCollection services) =>
            services.AddSingleton<ILoggerManager, LoggerManager>();
    }
}
