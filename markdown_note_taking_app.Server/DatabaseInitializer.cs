using LoggerService.Interfaces;
using markdown_note_taking_app.Server.Data;
using Microsoft.EntityFrameworkCore;

namespace markdown_note_taking_app.Server
{
    // The reason for this class is for migrations to apply when the api starts in docker.
    public static class DatabaseInitializer
    {
        // This line is for testing to see if CI/CD works for backend
        public static IHost InitializeDatabase(this IHost host)
        {
            using (var scope = host.Services.CreateScope())
            {
                var services = scope.ServiceProvider;
                try
                {
                    var logger = services.GetRequiredService<ILoggerManager>();
                    logger.LogInfo("Starting database initialization");

                    var context = services.GetRequiredService<DataContext>();

                    // Check if database exists
                    logger.LogInfo($"Database exists: {context.Database.CanConnect()}");

                    // Ensure database is created first
                    if (context.Database.EnsureCreated()) {
                        logger.LogInfo("Database created");
                    }
                    else
                    {
                        logger.LogError("Error in creating database.");
                    }

                    // Apply migrations and ensure database is created
                    context.Database.Migrate();
                    logger.LogInfo("Migrations applied successfully");

                    // Verify if AspNetUsers table exists (This is always the error when running the backend in docker)
                    var tableExists = context.Database.ExecuteSqlRaw("SELECT COUNT(*) FROM INFORMATION_SCHEMA.TABLES WHERE TABLE_NAME = 'AspNetUsers'");
                    logger.LogInfo($"AspNetUsers table check result: {tableExists}");

                    // Add any seed data if needed here
                }
                catch (Exception ex)
                {
                    var logger = services.GetRequiredService<ILogger<Program>>();
                    logger.LogError(ex, "An error occurred while initializing the database.");
                    logger.LogError($"Stack trace: {ex.StackTrace}");

                    if (ex.InnerException != null)
                        logger.LogError($"Inner exception: {ex.InnerException.Message}");
                }
            }

            return host;
        }
    }
}
