# Markdown Note Taking App
A full-stack web application for creating, managing, and collaborating on markdown notes. This application provides a clean interface for writing markdown content with support for real-time previews, grammar checking, and secure cloud storage.

## Features
- **User Authentication**: Secure login and registration system
- **Markdown Editing**: Create, edit, and delete markdown files
- **HTML Preview**: Real-time conversion of markdown to formatted HTML
- **Grammar Checking**: Built-in grammar checking using LanguageToolAPI for your content
- **Cloud Storage**: Save your notes securely on the server database

## Technologies Used
- **Frontend**: React with Vite
- **Backend**: ASP.NET Core 8.0 Web API
- **Database**: MS SQL Server
- **Authentication**: JWT (JSON Web Tokens)
- **Markdown Processing**: Markdig
- **Styling**: CSS
- **Containerization**: Docker

## Getting Started
1. Clone the Repository:

```bash
git clone https://github.com/yourusername/markdown-note-taking-app.git
cd markdown-note-taking-app
```

2. Build and run with Docker:

```
docker-compose up --build
```

3.  Access the application:

http://localhost:3000/

### Default user account

For Testing purposes, you can use the following credentials.

**Username**:  juan

**Password**: Password123!

## Local Development Setup

**Prerequisites**

.NET 8.0 SDK

Node.js (v16+)

SQL Server

**Backend Setup**
1. Navigate to the server directory:

```
cd markdown_note_taking_app.Server
```

2. Restore packages and run:

```
dotnet restore
dotnet run
```

**Frontend Setup**
1. Navigate to the client directory:

```
cd markdown_note_taking_app.client
```

2. Install dependencies and start the dev server:

```
npm install
npm run dev
```


Access the web app in https://localhost:59650/
