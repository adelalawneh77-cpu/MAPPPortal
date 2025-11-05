using MAPPPortal.Server.Entities;
using MAPPPortal.Server.Interfaces;
using MAPPPortal.Server.DTOs;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;

namespace MAPPPortal.Server.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    public class MilestonesController : ControllerBase
    {
        private readonly IMilestoneService _milestoneService;
        private readonly ILogger<MilestonesController> _logger;

        public MilestonesController(IMilestoneService milestoneService, ILogger<MilestonesController> logger)
        {
            _milestoneService = milestoneService;
            _logger = logger;
        }

        // GET: api/milestones
        [HttpGet]
        public async Task<ActionResult<IEnumerable<Milestone>>> GetMilestones()
        {
            try
            {
                var milestones = await _milestoneService.GetAllAsync();
                return Ok(milestones);
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Error retrieving milestones");
                return StatusCode(500, "An error occurred while retrieving milestones");
            }
        }

        // GET: api/milestones/5
        [HttpGet("{id}")]
        public async Task<ActionResult<Milestone>> GetMilestone(int id)
        {
            try
            {
                var milestone = await _milestoneService.GetByIdAsync(id);

                if (milestone == null)
                {
                    return NotFound($"Milestone with ID {id} not found");
                }

                return Ok(milestone);
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Error retrieving milestone with ID {MilestoneId}", id);
                return StatusCode(500, "An error occurred while retrieving the milestone");
            }
        }

        // GET: api/milestones/level/5
        [HttpGet("level/{levelId}")]
        public async Task<ActionResult<IEnumerable<Milestone>>> GetMilestonesByLevelId(int levelId)
        {
            try
            {
                var milestones = await _milestoneService.GetByLevelIdAsync(levelId);
                return Ok(milestones);
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Error retrieving milestones for level {LevelId}", levelId);
                return StatusCode(500, "An error occurred while retrieving milestones for the level");
            }
        }

        // GET: api/milestones/user/5
        [HttpGet("user/{userId}")]
        public async Task<ActionResult<IEnumerable<Milestone>>> GetMilestonesByUserId(int userId)
        {
            try
            {
                var milestones = await _milestoneService.GetByUserIdAsync(userId);
                return Ok(milestones);
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Error retrieving milestones for user {UserId}", userId);
                return StatusCode(500, "An error occurred while retrieving milestones for the user");
            }
        }

        // POST: api/milestones
        [HttpPost]
        public async Task<ActionResult<Milestone>> CreateMilestone([FromBody] CreateMilestoneDto milestoneDto)
        {
            try
            {
                _logger.LogInformation("Creating milestone: {MilestoneName} for Level {LevelId}", milestoneDto?.Name, milestoneDto?.LevelId);
                
                if (milestoneDto == null)
                {
                    _logger.LogWarning("Milestone DTO is null");
                    return BadRequest(new { message = "Milestone data is required" });
                }

                if (!ModelState.IsValid)
                {
                    var errors = ModelState.Values.SelectMany(v => v.Errors).Select(e => e.ErrorMessage);
                    _logger.LogWarning("Model state is invalid: {Errors}", string.Join(", ", errors));
                    return BadRequest(new { message = "Validation failed", errors = errors });
                }

                // Map DTO to Entity
                var newMilestone = new Milestone
                {
                    Name = milestoneDto.Name,
                    LevelId = milestoneDto.LevelId,
                    Percentage = milestoneDto.Percentage,
                    StartDate = milestoneDto.StartDate,
                    EndDate = milestoneDto.EndDate,
                    AssignedUserId = milestoneDto.AssignedUserId
                };

                var createdMilestone = await _milestoneService.CreateAsync(newMilestone);
                _logger.LogInformation("Milestone created successfully with ID: {MilestoneId}", createdMilestone.Id);
                return CreatedAtAction(nameof(GetMilestone), new { id = createdMilestone.Id }, createdMilestone);
            }
            catch (DbUpdateException ex)
            {
                _logger.LogError(ex, "Database error creating milestone: {Message}", ex.Message);
                if (ex.InnerException?.Message.Contains("FOREIGN KEY") == true)
                {
                    return BadRequest(new { message = "Level with the specified LevelId does not exist", error = ex.InnerException.Message });
                }
                return StatusCode(500, new { message = "An error occurred while creating the milestone", error = ex.Message });
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Error creating milestone: {Message}", ex.Message);
                return StatusCode(500, new { message = "An error occurred while creating the milestone", error = ex.Message });
            }
        }

        // PUT: api/milestones/5
        [HttpPut("{id}")]
        public async Task<IActionResult> UpdateMilestone(int id, UpdateMilestoneDto milestoneDto)
        {
            try
            {
                if (milestoneDto == null)
                {
                    return BadRequest(new { message = "Milestone data is required" });
                }

                if (!ModelState.IsValid)
                {
                    var errors = ModelState.Values.SelectMany(v => v.Errors).Select(e => e.ErrorMessage);
                    return BadRequest(new { message = "Validation failed", errors = errors });
                }

                var existingMilestone = await _milestoneService.GetByIdAsync(id);
                if (existingMilestone == null)
                {
                    return NotFound($"Milestone with ID {id} not found");
                }

                // Update only the allowed fields
                existingMilestone.Name = milestoneDto.Name;
                existingMilestone.Percentage = milestoneDto.Percentage;
                existingMilestone.StartDate = milestoneDto.StartDate;
                existingMilestone.EndDate = milestoneDto.EndDate;
                existingMilestone.AssignedUserId = milestoneDto.AssignedUserId;

                await _milestoneService.UpdateAsync(existingMilestone);
                return NoContent();
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Error updating milestone with ID {MilestoneId}", id);
                return StatusCode(500, new { message = "An error occurred while updating the milestone", error = ex.Message });
            }
        }

        // DELETE: api/milestones/5
        [HttpDelete("{id}")]
        public async Task<IActionResult> DeleteMilestone(int id)
        {
            try
            {
                var deleted = await _milestoneService.DeleteAsync(id);
                if (!deleted)
                {
                    return NotFound($"Milestone with ID {id} not found");
                }

                return NoContent();
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Error deleting milestone with ID {MilestoneId}", id);
                return StatusCode(500, "An error occurred while deleting the milestone");
            }
        }
    }
}

