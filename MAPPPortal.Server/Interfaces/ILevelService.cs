using MAPPPortal.Server.Entities;

namespace MAPPPortal.Server.Interfaces
{
    public interface ILevelService
    {
        Task<IEnumerable<Level>> GetAllAsync();
        Task<IEnumerable<Level>> GetByProjectIdAsync(int projectId);
        Task<Level?> GetByIdAsync(int id);
        Task<Level> CreateAsync(Level level);
        Task<Level> UpdateAsync(Level level);
        Task<bool> DeleteAsync(int id);
        Task<bool> ExistsAsync(int id);
    }
}

