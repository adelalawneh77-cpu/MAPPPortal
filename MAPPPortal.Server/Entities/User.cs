using System.ComponentModel.DataAnnotations;

namespace MAPPPortal.Server.Entities
{
    public class User
    {
        [Key]
        public int Id { get; set; }

        [Required]
        [MaxLength(100)]
        public string Username { get; set; } = string.Empty;

        [Required]
        [MaxLength(200)]
        public string Password { get; set; } = string.Empty;

        [MaxLength(200)]
        public string? FullName { get; set; }

        [MaxLength(100)]
        public string? Email { get; set; }

        // Navigation property - one user can have many milestones
        public virtual ICollection<Milestone> AssignedMilestones { get; set; } = new List<Milestone>();
    }
}

