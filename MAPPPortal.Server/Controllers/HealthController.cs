using Microsoft.AspNetCore.Mvc;

namespace MAPPPortal.Server.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    public class HealthController : ControllerBase
    {
        [HttpGet]
        public IActionResult Get()
        {
            return Ok(new { 
                status = "healthy", 
                message = "Backend is running",
                timestamp = DateTime.UtcNow
            });
        }
    }
}

