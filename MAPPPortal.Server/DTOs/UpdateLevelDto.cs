using System.ComponentModel.DataAnnotations;

namespace MAPPPortal.Server.DTOs
{
    public class UpdateLevelDto
    {
        [Required(ErrorMessage = "Name is required")]
        [MaxLength(200, ErrorMessage = "Name cannot exceed 200 characters")]
        public string Name { get; set; } = string.Empty;
    }
}

