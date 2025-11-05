using MAPPPortal.Server.Entities;
using MAPPPortal.Server.Interfaces;
using MAPPPortal.Server.DTOs;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;

namespace MAPPPortal.Server.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    public class LevelsController : ControllerBase
    {
        private readonly ILevelService _levelService;
        private readonly ILogger<LevelsController> _logger;

        public LevelsController(ILevelService levelService, ILogger<LevelsController> logger)
        {
            _levelService = levelService;
            _logger = logger;
        }

        // GET: api/levels
        [HttpGet]
        public async Task<ActionResult<IEnumerable<Level>>> GetLevels()
        {
            try
            {
                var levels = await _levelService.GetAllAsync();
                return Ok(levels);
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Error retrieving levels");
                return StatusCode(500, "An error occurred while retrieving levels");
            }
        }

        // GET: api/levels/5
        [HttpGet("{id}")]
        public async Task<ActionResult<Level>> GetLevel(int id)
        {
            try
            {
                var level = await _levelService.GetByIdAsync(id);

                if (level == null)
                {
                    return NotFound($"Level with ID {id} not found");
                }

                return Ok(level);
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Error retrieving level with ID {LevelId}", id);
                return StatusCode(500, "An error occurred while retrieving the level");
            }
        }

        // GET: api/levels/project/5
        [HttpGet("project/{projectId}")]
        public async Task<ActionResult<IEnumerable<Level>>> GetLevelsByProjectId(int projectId)
        {
            try
            {
                var levels = await _levelService.GetByProjectIdAsync(projectId);
                return Ok(levels);
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Error retrieving levels for project {ProjectId}", projectId);
                return StatusCode(500, "An error occurred while retrieving levels for the project");
            }
        }

        // POST: api/levels
        [HttpPost]
        public async Task<ActionResult<Level>> CreateLevel([FromBody] CreateLevelDto levelDto)
        {
            try
            {
                _logger.LogInformation("Creating level: {LevelName} for Project {ProjectId}", levelDto?.Name, levelDto?.ProjectId);
                
                if (levelDto == null)
                {
                    _logger.LogWarning("Level DTO is null");
                    return BadRequest(new { message = "Level data is required" });
                }

                if (!ModelState.IsValid)
                {
                    var errors = ModelState.Values.SelectMany(v => v.Errors).Select(e => e.ErrorMessage);
                    _logger.LogWarning("Model state is invalid: {Errors}", string.Join(", ", errors));
                    return BadRequest(new { message = "Validation failed", errors = errors });
                }

                // Map DTO to Entity
                var newLevel = new Level
                {
                    Name = levelDto.Name,
                    ProjectId = levelDto.ProjectId
                };
                
                // Initialize Milestones collection
                newLevel.Milestones = new List<Milestone>();

                var createdLevel = await _levelService.CreateAsync(newLevel);
                _logger.LogInformation("Level created successfully with ID: {LevelId}", createdLevel.Id);
                return CreatedAtAction(nameof(GetLevel), new { id = createdLevel.Id }, createdLevel);
            }
            catch (DbUpdateException ex)
            {
                _logger.LogError(ex, "Database error creating level: {Message}", ex.Message);
                if (ex.InnerException?.Message.Contains("FOREIGN KEY") == true)
                {
                    return BadRequest(new { message = "Project with the specified ProjectId does not exist", error = ex.InnerException.Message });
                }
                return StatusCode(500, new { message = "An error occurred while creating the level", error = ex.Message });
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Error creating level: {Message}", ex.Message);
                return StatusCode(500, new { message = "An error occurred while creating the level", error = ex.Message });
            }
        }

        // PUT: api/levels/5
        [HttpPut("{id}")]
        public async Task<IActionResult> UpdateLevel(int id, UpdateLevelDto levelDto)
        {
            try
            {
                if (levelDto == null)
                {
                    return BadRequest(new { message = "Level data is required" });
                }

                if (!ModelState.IsValid)
                {
                    var errors = ModelState.Values.SelectMany(v => v.Errors).Select(e => e.ErrorMessage);
                    return BadRequest(new { message = "Validation failed", errors = errors });
                }

                var existingLevel = await _levelService.GetByIdAsync(id);
                if (existingLevel == null)
                {
                    return NotFound($"Level with ID {id} not found");
                }

                // Update only the allowed fields
                existingLevel.Name = levelDto.Name;

                await _levelService.UpdateAsync(existingLevel);
                _logger.LogInformation("Level updated successfully with ID: {LevelId}", id);
                return NoContent();
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Error updating level with ID {LevelId}", id);
                return StatusCode(500, "An error occurred while updating the level");
            }
        }

        // DELETE: api/levels/5
        [HttpDelete("{id}")]
        public async Task<IActionResult> DeleteLevel(int id)
        {
            try
            {
                var deleted = await _levelService.DeleteAsync(id);
                if (!deleted)
                {
                    return NotFound($"Level with ID {id} not found");
                }

                return NoContent();
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Error deleting level with ID {LevelId}", id);
                return StatusCode(500, "An error occurred while deleting the level");
            }
        }
    }
}

