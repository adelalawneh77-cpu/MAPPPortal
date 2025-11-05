using System.ComponentModel.DataAnnotations;

namespace MAPPPortal.Server.DTOs
{
    public class CreateMilestoneDto
    {
        [Required(ErrorMessage = "Name is required")]
        [MaxLength(200, ErrorMessage = "Name cannot exceed 200 characters")]
        public string Name { get; set; } = string.Empty;

        [Required(ErrorMessage = "LevelId is required")]
        [Range(1, int.MaxValue, ErrorMessage = "LevelId must be greater than 0")]
        public int LevelId { get; set; }

        [Range(0, 100, ErrorMessage = "Percentage must be between 0 and 100")]
        public decimal Percentage { get; set; } = 0;

        public DateTime? StartDate { get; set; }

        public DateTime? EndDate { get; set; }

        public int? AssignedUserId { get; set; }
    }
}

