using System.ComponentModel.DataAnnotations;

namespace MAPPPortal.Server.DTOs
{
    public class UpdateProjectDto
    {
        [Required(ErrorMessage = "Name is required")]
        [MaxLength(200, ErrorMessage = "Name cannot exceed 200 characters")]
        public string Name { get; set; } = string.Empty;

        public string? Description { get; set; }

        public string? Issues { get; set; }
    }
}

