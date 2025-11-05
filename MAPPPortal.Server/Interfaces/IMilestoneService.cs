using MAPPPortal.Server.Entities;

namespace MAPPPortal.Server.Interfaces
{
    public interface IMilestoneService
    {
        Task<IEnumerable<Milestone>> GetAllAsync();
        Task<IEnumerable<Milestone>> GetByLevelIdAsync(int levelId);
        Task<IEnumerable<Milestone>> GetByUserIdAsync(int userId);
        Task<Milestone?> GetByIdAsync(int id);
        Task<Milestone> CreateAsync(Milestone milestone);
        Task<Milestone> UpdateAsync(Milestone milestone);
        Task<bool> DeleteAsync(int id);
        Task<bool> ExistsAsync(int id);
    }
}

