FROM mcr.microsoft.com/dotnet/aspnet:8.0 AS base
WORKDIR /app
EXPOSE 80

FROM mcr.microsoft.com/dotnet/sdk:8.0 AS build
WORKDIR /src

# Copy all project files for restore
COPY ["markdown_note_taking_app.Server/markdown_note_taking_app.Server.csproj", "markdown_note_taking_app.Server/"]
COPY ["LoggerService/LoggerService.csproj", "LoggerService/"]

# Restore all projects
RUN dotnet restore "markdown_note_taking_app.Server/markdown_note_taking_app.Server.csproj"

# Copy all source code
COPY ["LoggerService/", "LoggerService/"]
COPY ["markdown_note_taking_app.Server/", "markdown_note_taking_app.Server/"]

# Build and publish
WORKDIR "/src/markdown_note_taking_app.Server"
RUN dotnet publish -c Release -o /app/publish

FROM build AS database-update
WORKDIR "/src/markdown_note_taking_app.Server"
# Install the EF Core tools
RUN dotnet tool install --global dotnet-ef
ENV PATH="${PATH}:/root/.dotnet/tools"

FROM base AS final
WORKDIR /app
COPY --from=build /app/publish .

# Copy shell scripts directly from host to final image
COPY ["markdown_note_taking_app.Server/docker-entrypoint.sh", "./docker-entrypoint.sh"]
COPY ["markdown_note_taking_app.Server/wait-for-it.sh", "./wait-for-it.sh"]

# Make the scripts executable
RUN chmod +x ./docker-entrypoint.sh
RUN chmod +x ./wait-for-it.sh

# Environment variables
ENV ASPNETCORE_URLS=http://+:80
ENV ASPNETCORE_ENVIRONMENT=Docker
ENV SECRET=YourSuperSecretKeyForDevelopment12345

ENTRYPOINT ["./docker-entrypoint.sh"]