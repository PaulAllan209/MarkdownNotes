using AutoMapper;
using Entities.Models;
using markdown_note_taking_app.Server.Dto;
using markdown_note_taking_app.Server.Models;

namespace markdown_note_taking_app.Server
{
    public class MappingProfile : Profile
    {
        public MappingProfile()
        {
            CreateMap<MarkdownFile, MarkdownFileDto>().ReverseMap();
            CreateMap<MarkdownFileDto, MarkdownFileConvertToHtmlDto>().ReverseMap();
            CreateMap<MarkdownFile, MarkdownFileCreationDto>().ReverseMap();
            CreateMap<UserForRegistrationDto, User>();
        }
    }
}
