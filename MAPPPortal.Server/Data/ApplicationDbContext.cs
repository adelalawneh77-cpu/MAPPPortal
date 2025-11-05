using MAPPPortal.Server.Entities;
using Microsoft.EntityFrameworkCore;

namespace MAPPPortal.Server.Data
{
    public class ApplicationDbContext : DbContext
    {
        public ApplicationDbContext(DbContextOptions<ApplicationDbContext> options)
            : base(options)
        {
        }

        // DbSets for entities
        public DbSet<Project> Projects { get; set; } = null!;
        public DbSet<Level> Levels { get; set; } = null!;
        public DbSet<Milestone> Milestones { get; set; } = null!;
        public DbSet<User> Users { get; set; } = null!;

        protected override void OnModelCreating(ModelBuilder modelBuilder)
        {
            base.OnModelCreating(modelBuilder);

            // Configure Project entity
            modelBuilder.Entity<Project>(entity =>
            {
                entity.HasKey(e => e.Id);
                entity.Property(e => e.Id)
                    .ValueGeneratedOnAdd();
                entity.Property(e => e.Name)
                    .IsRequired()
                    .HasMaxLength(200);
                entity.Property(e => e.Description)
                    .HasColumnType("nvarchar(max)");
                entity.Property(e => e.Issues)
                    .HasColumnType("nvarchar(max)");
            });

            // Configure Level entity and its relationship with Project
            modelBuilder.Entity<Level>(entity =>
            {
                entity.HasKey(e => e.Id);
                entity.Property(e => e.Id)
                    .ValueGeneratedOnAdd();
                entity.Property(e => e.Name)
                    .IsRequired()
                    .HasMaxLength(200);
                entity.Property(e => e.ProjectId)
                    .IsRequired();

                // Configure relationship: Level belongs to one Project, Project has many Levels
                entity.HasOne(l => l.Project)
                    .WithMany(p => p.Levels)
                    .HasForeignKey(l => l.ProjectId)
                    .OnDelete(DeleteBehavior.Cascade);
            });

            // Configure User entity
            modelBuilder.Entity<User>(entity =>
            {
                entity.HasKey(e => e.Id);
                entity.Property(e => e.Id)
                    .ValueGeneratedOnAdd();
                entity.Property(e => e.Username)
                    .IsRequired()
                    .HasMaxLength(100);
                entity.Property(e => e.Password)
                    .IsRequired()
                    .HasMaxLength(200);
                entity.Property(e => e.FullName)
                    .HasMaxLength(200);
                entity.Property(e => e.Email)
                    .HasMaxLength(100);
            });

            // Configure Milestone entity and its relationship with Level and User
            modelBuilder.Entity<Milestone>(entity =>
            {
                entity.HasKey(e => e.Id);
                entity.Property(e => e.Id)
                    .ValueGeneratedOnAdd();
                entity.Property(e => e.Name)
                    .IsRequired()
                    .HasMaxLength(200);
                entity.Property(e => e.LevelId)
                    .IsRequired();
                entity.Property(e => e.Percentage)
                    .HasColumnType("decimal(5,2)")
                    .HasDefaultValue(0);
                entity.Property(e => e.StartDate)
                    .HasColumnType("datetime2");
                entity.Property(e => e.EndDate)
                    .HasColumnType("datetime2");

                // Configure relationship: Milestone belongs to one Level, Level has many Milestones
                entity.HasOne(m => m.Level)
                    .WithMany(l => l.Milestones)
                    .HasForeignKey(m => m.LevelId)
                    .OnDelete(DeleteBehavior.Cascade);

                // Configure relationship: Milestone can be assigned to one User, User has many Milestones
                entity.HasOne(m => m.AssignedUser)
                    .WithMany(u => u.AssignedMilestones)
                    .HasForeignKey(m => m.AssignedUserId)
                    .OnDelete(DeleteBehavior.SetNull);
            });
        }
    }
}

