using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Design;

namespace markdown_note_taking_app.Server.Data
{
    public class DataContextFactory : IDesignTimeDbContextFactory<DataContext> 
    {
        public DataContext CreateDbContext(string[] args)
        {
            var optionsBuilder = new DbContextOptionsBuilder<DataContext>();

            var configuration = new ConfigurationBuilder()
                .SetBasePath(Directory.GetCurrentDirectory())
                .AddJsonFile("appsettings.json")
                .Build();

            var connectionString = configuration.GetConnectionString("sqlConnection");

            optionsBuilder.UseSqlServer(connectionString,
                b => b.MigrationsAssembly("markdown_note_taking_app.Server"));

            return new DataContext(optionsBuilder.Options);
        }
    }
}
