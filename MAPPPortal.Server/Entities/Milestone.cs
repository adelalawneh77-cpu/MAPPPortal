using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace MAPPPortal.Server.Entities
{
    public class Milestone
    {
        [Key]
        public int Id { get; set; }

        [Required]
        [MaxLength(200)]
        public string Name { get; set; } = string.Empty;

        [Required]
        public int LevelId { get; set; }

        [Range(0, 100, ErrorMessage = "Percentage must be between 0 and 100")]
        public decimal Percentage { get; set; } = 0;

        public DateTime? StartDate { get; set; }

        public DateTime? EndDate { get; set; }

        public int? AssignedUserId { get; set; }

        // Foreign key relationship - Milestone belongs to one Level
        [ForeignKey(nameof(LevelId))]
        public virtual Level Level { get; set; } = null!;

        // Foreign key relationship - Milestone can be assigned to one User
        [ForeignKey(nameof(AssignedUserId))]
        public virtual User? AssignedUser { get; set; }
    }
}

