using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace MAPPPortal.Server.Entities
{
    public class Project
    {
        [Key]
        public int Id { get; set; }

        [Required]
        [MaxLength(200)]
        public string Name { get; set; } = string.Empty;

        public string? Description { get; set; }

        public string? Issues { get; set; }

        // Calculated property - percentage calculated from levels
        [NotMapped]
        public decimal Percentage
        {
            get
            {
                if (Levels == null || Levels.Count == 0)
                    return 0;

                // Calculate average of levels, but each level's percentage is calculated from its milestones
                var levelsWithMilestones = Levels.Where(l => l.Milestones != null && l.Milestones.Count > 0).ToList();
                
                if (levelsWithMilestones.Count == 0)
                    return 0;

                return levelsWithMilestones.Average(l => l.Percentage);
            }
        }

        // Navigation property - one project has many levels
        public virtual ICollection<Level> Levels { get; set; } = new List<Level>();
    }
}

