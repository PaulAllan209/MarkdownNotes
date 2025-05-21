namespace markdown_note_taking_app.Server.Utilities
{
    public static class DefaultMarkdownFile
    {
        public static string GetWelcomeFileContent()
        {
            return "# Welcome to Your Markdown Note Taking App\n\n" +
                   "This is a sample markdown file to get you started.\n\n" +
                   "## Features\n\n" +
                   "- Create and edit markdown files\n" +
                   "- Save your notes in the cloud\n" +
                   "- Collaborate with others\n\n" +
                   "## Markdown Syntax\n\n" +
                   "You can use various markdown syntax elements:\n\n" +
                   "**Bold text** or *italic text*\n\n" +
                   "- Bulleted lists\n" +
                   "- Like this one\n\n" +
                   "1. Numbered lists\n" +
                   "2. Are also supported\n\n" +
                   "```\n" +
                   "Code blocks too!\n" +
                   "```\n\n" +
                   "Enjoy writing!";
        }

        public static string GetDefaultFileName()
        {
            return "Welcome_File";
        }
    }
}
