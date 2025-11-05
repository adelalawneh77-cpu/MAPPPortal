using System.ComponentModel.DataAnnotations;

namespace MAPPPortal.Server.DTOs
{
    public class CreateUserDto
    {
        [Required(ErrorMessage = "Username is required")]
        [MaxLength(100)]
        public string Username { get; set; } = string.Empty;

        [Required(ErrorMessage = "Password is required")]
        [MaxLength(200)]
        public string Password { get; set; } = string.Empty;

        [MaxLength(200)]
        public string? FullName { get; set; }

        [MaxLength(100)]
        [EmailAddress]
        public string? Email { get; set; }
    }
}

