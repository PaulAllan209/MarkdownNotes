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

# Install dos2unix
RUN apt-get update && apt-get install -y dos2unix

# Copy shell scripts directly from host to final image
COPY ["./markdown_note_taking_app.Server/docker-entrypoint.sh", "/app/"]
COPY ["./markdown_note_taking_app.Server/wait-for-it.sh", "/app/"]

# Run the scripts
RUN dos2unix /app/docker-entrypoint.sh \
    && dos2unix /app/wait-for-it.sh \
    && chmod +x /app/docker-entrypoint.sh \
    && chmod +x /app/wait-for-it.sh

# Environment variables
ENV ASPNETCORE_URLS=http://+:80
ENV ASPNETCORE_ENVIRONMENT=Docker
ENV SECRET=YourSuperSecretKeyForDevelopment12345

ENTRYPOINT ["/app/docker-entrypoint.sh"]