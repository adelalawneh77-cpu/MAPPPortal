using MAPPPortal.Server.Entities;
using MAPPPortal.Server.Interfaces;
using MAPPPortal.Server.DTOs;
using Microsoft.AspNetCore.Mvc;

namespace MAPPPortal.Server.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    public class ProjectsController : ControllerBase
    {
        private readonly IProjectService _projectService;
        private readonly ILogger<ProjectsController> _logger;

        public ProjectsController(IProjectService projectService, ILogger<ProjectsController> logger)
        {
            _projectService = projectService;
            _logger = logger;
        }

        // GET: api/projects
        [HttpGet]
        public async Task<ActionResult<IEnumerable<Project>>> GetProjects()
        {
            try
            {
                var projects = await _projectService.GetAllAsync();
                return Ok(projects);
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Error retrieving projects");
                return StatusCode(500, "An error occurred while retrieving projects");
            }
        }

        // GET: api/projects/5
        [HttpGet("{id}")]
        public async Task<ActionResult<Project>> GetProject(int id)
        {
            try
            {
                var project = await _projectService.GetByIdAsync(id);

                if (project == null)
                {
                    return NotFound($"Project with ID {id} not found");
                }

                return Ok(project);
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Error retrieving project with ID {ProjectId}", id);
                return StatusCode(500, "An error occurred while retrieving the project");
            }
        }

        // POST: api/projects
        [HttpPost]
        public async Task<ActionResult<Project>> CreateProject([FromBody] CreateProjectDto projectDto)
        {
            try
            {
                _logger.LogInformation("Creating project: {ProjectName}", projectDto?.Name);
                
                if (projectDto == null)
                {
                    _logger.LogWarning("Project DTO is null");
                    return BadRequest(new { message = "Project data is required" });
                }

                if (!ModelState.IsValid)
                {
                    var errors = ModelState.Values.SelectMany(v => v.Errors).Select(e => e.ErrorMessage);
                    _logger.LogWarning("Model state is invalid: {Errors}", string.Join(", ", errors));
                    return BadRequest(new { message = "Validation failed", errors = errors });
                }

                // Map DTO to Entity
                var newProject = new Project
                {
                    Name = projectDto.Name,
                    Description = projectDto.Description,
                    Issues = projectDto.Issues,
                    Levels = new List<Level>()
                };

                var createdProject = await _projectService.CreateAsync(newProject);
                _logger.LogInformation("Project created successfully with ID: {ProjectId}", createdProject.Id);
                return CreatedAtAction(nameof(GetProject), new { id = createdProject.Id }, createdProject);
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Error creating project: {Message}", ex.Message);
                return StatusCode(500, new { message = "An error occurred while creating the project", error = ex.Message });
            }
        }

        // PUT: api/projects/5
        [HttpPut("{id}")]
        public async Task<IActionResult> UpdateProject(int id, UpdateProjectDto projectDto)
        {
            try
            {
                if (projectDto == null)
                {
                    return BadRequest(new { message = "Project data is required" });
                }

                if (!ModelState.IsValid)
                {
                    var errors = ModelState.Values.SelectMany(v => v.Errors).Select(e => e.ErrorMessage);
                    return BadRequest(new { message = "Validation failed", errors = errors });
                }

                var existingProject = await _projectService.GetByIdAsync(id);
                if (existingProject == null)
                {
                    return NotFound($"Project with ID {id} not found");
                }

                // Update only the allowed fields
                existingProject.Name = projectDto.Name;
                existingProject.Description = projectDto.Description;
                existingProject.Issues = projectDto.Issues;

                await _projectService.UpdateAsync(existingProject);
                _logger.LogInformation("Project updated successfully with ID: {ProjectId}", id);
                return NoContent();
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Error updating project with ID {ProjectId}", id);
                return StatusCode(500, new { message = "An error occurred while updating the project", error = ex.Message });
            }
        }

        // DELETE: api/projects/5
        [HttpDelete("{id}")]
        public async Task<IActionResult> DeleteProject(int id)
        {
            try
            {
                var deleted = await _projectService.DeleteAsync(id);
                if (!deleted)
                {
                    return NotFound($"Project with ID {id} not found");
                }

                return NoContent();
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Error deleting project with ID {ProjectId}", id);
                return StatusCode(500, "An error occurred while deleting the project");
            }
        }
    }
}

