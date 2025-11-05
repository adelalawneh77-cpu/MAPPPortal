using MAPPPortal.Server.Entities;
using Microsoft.EntityFrameworkCore;

namespace MAPPPortal.Server.Data
{
    public static class DbSeeder
    {
        public static async Task SeedAsync(ApplicationDbContext context)
        {
            // Ensure database is created
            await context.Database.EnsureCreatedAsync();

            // Seed Admin User if not exists
            if (!await context.Users.AnyAsync(u => u.Username == "admin"))
            {
                var adminUser = new User
                {
                    Username = "admin",
                    Password = "123456", // In production, hash this password
                    FullName = "مدير النظام",
                    Email = "admin@mappportal.com"
                };

                context.Users.Add(adminUser);
                await context.SaveChangesAsync();
            }

            // You can add more seed data here if needed
        }
    }
}

