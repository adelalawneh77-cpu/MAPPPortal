using MAPPPortal.Server.DTOs;
using MAPPPortal.Server.Entities;
using MAPPPortal.Server.Interfaces;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;

namespace MAPPPortal.Server.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    public class AuthController : ControllerBase
    {
        private readonly IUserService _userService;
        private readonly ILogger<AuthController> _logger;

        public AuthController(IUserService userService, ILogger<AuthController> logger)
        {
            _userService = userService;
            _logger = logger;
        }

        [HttpPost("login")]
        public async Task<ActionResult<User>> Login([FromBody] LoginDto loginDto)
        {
            try
            {
                if (loginDto == null)
                {
                    return BadRequest(new { message = "Login data is required" });
                }

                if (!ModelState.IsValid)
                {
                    var errors = ModelState.Values.SelectMany(v => v.Errors).Select(e => e.ErrorMessage);
                    return BadRequest(new { message = "Validation failed", errors = errors });
                }

                var user = await _userService.AuthenticateAsync(loginDto.Username, loginDto.Password);
                
                if (user == null)
                {
                    return Unauthorized(new { message = "Invalid username or password" });
                }

                // Don't return password
                user.Password = string.Empty;
                
                return Ok(user);
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Error during login");
                return StatusCode(500, new { message = "An error occurred during login", error = ex.Message });
            }
        }

        [HttpPost("register")]
        public async Task<ActionResult<User>> Register([FromBody] CreateUserDto userDto)
        {
            try
            {
                if (userDto == null)
                {
                    return BadRequest(new { message = "User data is required" });
                }

                if (!ModelState.IsValid)
                {
                    var errors = ModelState.Values.SelectMany(v => v.Errors).Select(e => e.ErrorMessage);
                    return BadRequest(new { message = "Validation failed", errors = errors });
                }

                // Check if username already exists
                var existingUser = await _userService.GetByUsernameAsync(userDto.Username);
                if (existingUser != null)
                {
                    return Conflict(new { message = "Username already exists" });
                }

                var newUser = new User
                {
                    Username = userDto.Username,
                    Password = userDto.Password, // In production, hash this password
                    FullName = userDto.FullName,
                    Email = userDto.Email
                };

                var createdUser = await _userService.CreateAsync(newUser);
                createdUser.Password = string.Empty; // Don't return password

                return CreatedAtAction(nameof(Login), new { id = createdUser.Id }, createdUser);
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Error during registration");
                return StatusCode(500, new { message = "An error occurred during registration", error = ex.Message });
            }
        }
    }
}

