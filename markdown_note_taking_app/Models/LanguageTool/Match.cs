﻿namespace markdown_note_taking_app.Models.LanguageTool
{
    public class Match
    {
        public int Offset { get; set; }
        public int Length { get; set; }
        public List<Replacement> Replacements { get; set; }
    }
}
