using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace MAPPPortal.Server.Entities
{
    public class Level
    {
        [Key]
        public int Id { get; set; }

        [Required]
        [MaxLength(200)]
        public string Name { get; set; } = string.Empty;

        [Required]
        public int ProjectId { get; set; }

        // Calculated property - percentage calculated from milestones
        [NotMapped]
        public decimal Percentage
        {
            get
            {
                if (Milestones == null || Milestones.Count == 0)
                    return 0;

                return Milestones.Average(m => m.Percentage);
            }
        }

        // Foreign key relationship - Level belongs to one Project
        [ForeignKey(nameof(ProjectId))]
        public virtual Project Project { get; set; } = null!;

        // Navigation property - one level has many milestones
        public virtual ICollection<Milestone> Milestones { get; set; } = new List<Milestone>();
    }
}

