using MAPPPortal.Server.Data;
using MAPPPortal.Server.Entities;
using MAPPPortal.Server.Interfaces;
using Microsoft.EntityFrameworkCore;

namespace MAPPPortal.Server.Services
{
    public class MilestoneService : IMilestoneService
    {
        private readonly ApplicationDbContext _context;

        public MilestoneService(ApplicationDbContext context)
        {
            _context = context;
        }

        public async Task<IEnumerable<Milestone>> GetAllAsync()
        {
            return await _context.Milestones
                .Include(m => m.Level)
                    .ThenInclude(l => l.Project)
                .Include(m => m.AssignedUser)
                .ToListAsync();
        }

        public async Task<IEnumerable<Milestone>> GetByLevelIdAsync(int levelId)
        {
            return await _context.Milestones
                .Include(m => m.Level)
                    .ThenInclude(l => l.Project)
                .Include(m => m.AssignedUser)
                .Where(m => m.LevelId == levelId)
                .ToListAsync();
        }

        public async Task<IEnumerable<Milestone>> GetByUserIdAsync(int userId)
        {
            return await _context.Milestones
                .Include(m => m.Level)
                    .ThenInclude(l => l.Project)
                .Include(m => m.AssignedUser)
                .Where(m => m.AssignedUserId == userId)
                .OrderByDescending(m => m.StartDate)
                .ToListAsync();
        }

        public async Task<Milestone?> GetByIdAsync(int id)
        {
            return await _context.Milestones
                .Include(m => m.Level)
                    .ThenInclude(l => l.Project)
                .FirstOrDefaultAsync(m => m.Id == id);
        }

        public async Task<Milestone> CreateAsync(Milestone milestone)
        {
            _context.Milestones.Add(milestone);
            await _context.SaveChangesAsync();
            return milestone;
        }

        public async Task<Milestone> UpdateAsync(Milestone milestone)
        {
            _context.Milestones.Update(milestone);
            await _context.SaveChangesAsync();
            return milestone;
        }

        public async Task<bool> DeleteAsync(int id)
        {
            var milestone = await _context.Milestones.FindAsync(id);
            if (milestone == null)
                return false;

            _context.Milestones.Remove(milestone);
            await _context.SaveChangesAsync();
            return true;
        }

        public async Task<bool> ExistsAsync(int id)
        {
            return await _context.Milestones.AnyAsync(m => m.Id == id);
        }
    }
}

