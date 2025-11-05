using MAPPPortal.Server.Data;
using MAPPPortal.Server.Entities;
using MAPPPortal.Server.Interfaces;
using Microsoft.EntityFrameworkCore;

namespace MAPPPortal.Server.Services
{
    public class LevelService : ILevelService
    {
        private readonly ApplicationDbContext _context;

        public LevelService(ApplicationDbContext context)
        {
            _context = context;
        }

        public async Task<IEnumerable<Level>> GetAllAsync()
        {
            return await _context.Levels
                .Include(l => l.Project)
                .Include(l => l.Milestones)
                .ToListAsync();
        }

        public async Task<IEnumerable<Level>> GetByProjectIdAsync(int projectId)
        {
            return await _context.Levels
                .Include(l => l.Project)
                .Include(l => l.Milestones)
                .Where(l => l.ProjectId == projectId)
                .ToListAsync();
        }

        public async Task<Level?> GetByIdAsync(int id)
        {
            return await _context.Levels
                .Include(l => l.Project)
                .Include(l => l.Milestones)
                .FirstOrDefaultAsync(l => l.Id == id);
        }

        public async Task<Level> CreateAsync(Level level)
        {
            _context.Levels.Add(level);
            await _context.SaveChangesAsync();
            return level;
        }

        public async Task<Level> UpdateAsync(Level level)
        {
            _context.Levels.Update(level);
            await _context.SaveChangesAsync();
            return level;
        }

        public async Task<bool> DeleteAsync(int id)
        {
            var level = await _context.Levels.FindAsync(id);
            if (level == null)
                return false;

            _context.Levels.Remove(level);
            await _context.SaveChangesAsync();
            return true;
        }

        public async Task<bool> ExistsAsync(int id)
        {
            return await _context.Levels.AnyAsync(l => l.Id == id);
        }
    }
}

