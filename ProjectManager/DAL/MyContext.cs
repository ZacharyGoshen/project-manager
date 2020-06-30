using ProjectManager.Models;
using Microsoft.EntityFrameworkCore;
using System;
using System.Collections.Generic;
using System.Text;
using System.Linq;

namespace ProjectManager.DAL
{
    public class MyContext : DbContext
    {
        public DbSet<User> Users { get; set; }
        public DbSet<Project> Projects { get; set; }
        public DbSet<Task> Tasks { get; set; }
        public DbSet<Comment> Comments { get; set; }
        public DbSet<Category> Categories { get; set; }
        public DbSet<Tag> Tags { get; set; }
        public DbSet<UserProject> UserProjects { get; set; }
        public DbSet<TagTask> TagTasks { get; set; }

        protected override void OnConfiguring(DbContextOptionsBuilder optionsBuilder)
        {
            optionsBuilder.UseSqlServer("Server=localhost,1433; Database=MyDB; User=SA; Password=<YourStrong@Passw0rd>");
        }

        protected override void OnModelCreating(ModelBuilder modelBuilder)
        {
            // Create one to many relationship between project and tasks
            modelBuilder.Entity<Project>()
                .HasMany(p => p.Tasks)
                .WithOne(t => t.Project);

            // Create one to many relationship between project and categories
            modelBuilder.Entity<Project>()
                .HasMany(p => p.Categories)
                .WithOne(c => c.Project);

            // Create one to many relationship between project and tags
            modelBuilder.Entity<Project>()
                .HasMany(p => p.Tags)
                .WithOne(t => t.Project);

            // Create one to many relationship between category and tasks
            modelBuilder.Entity<Category>()
                .HasMany(c => c.Tasks)
                .WithOne(t => t.Category);

            // Create many to many relationship between users and projects
            modelBuilder.Entity<User>()
                .HasMany(u => u.UserProjects)
                .WithOne(up => up.User);
            modelBuilder.Entity<Project>()
                .HasMany(p => p.TeamMembers)
                .WithOne(up => up.Project);

            // Create many to many relationship between tags and tasks
            modelBuilder.Entity<Tag>()
                .HasMany(t => t.TagTasks)
                .WithOne(tt => tt.Tag);
            modelBuilder.Entity<Task>()
                .HasMany(t => t.TagTasks)
                .WithOne(tt => tt.Task);

            // Create one to many relationship between user and comments
            modelBuilder.Entity<User>()
                .HasMany(u => u.Comments)
                .WithOne(c => c.User);

            // Create one to many relationship between assigned user and tasks
            modelBuilder.Entity<User>()
                .HasMany(u => u.AssignedTasks)
                .WithOne(t => t.AssignedUser);

            // Create one to many relationship between submitting user and tasks
            modelBuilder.Entity<User>()
                .HasMany(u => u.SubmittedTasks)
                .WithOne(t => t.SubmittingUser);

            // Create one to many relationship between task and comments
            modelBuilder.Entity<Task>()
                .HasMany(t => t.Comments)
                .WithOne(c => c.Task);

            // Seed Users
            modelBuilder.Entity<User>().HasData(
                new
                {
                    UserId = 1,
                    FirstName = "Zachary",
                    LastName = "Goshen",
                    Email = "zachgoshen@gmail.com",
                    Password = "g8DKmISNL498xl1NL1cRSVNERPM3jR0eeFyfPIVbFno=",
                    Salt = StringToByteArray("642D5272CF0349B9BC950ACC2619AB25"),
                    BackgroundColor = 5,
                    CurrentProjectId = 1
                },
                new
                {
                    UserId = 2,
                    FirstName = "Erick",
                    LastName = "Goshen",
                    Email = "erickgoshen@gmail.com",
                    Password = "6ku4MbX8vTRnrAekAxT6OKaTjCcIUrx9tMpqCz4dqe4=",
                    Salt = StringToByteArray("33F706A69D130284DDDB42270C3C7C0A"),
                    BackgroundColor = 10,
                    CurrentProjectId = 1
                }
                );

            // Seed Projects
            modelBuilder.Entity<Project>().HasData(
                new
                {
                    ProjectId = 1,
                    Name = "Task Manager",
                    Description = "This is a project called task manager",
                    DueDate = new DateTime(),
                    OwnerUserId = 1
                }
                );

            // Seed Tasks
            modelBuilder.Entity<Task>().HasData(
                new
                {
                    TaskId = 1,
                    Name = "Very low priority task",
                    Description = "This task is very low priority",
                    ProjectId = 1,
                    CategoryId = 1,
                    SubmittingUserUserId = 1,
                    AssignedUserUserId = 1,
                    Priority = 1,
                    IsCompleted = false,
                    CreationTime = DateTime.Now,
                    DueDate = new DateTime(),
                    Order = 4
                },
                new
                {
                    TaskId = 2,
                    Name = "Low priority task",
                    Description = "This task is low priority",
                    ProjectId = 1,
                    CategoryId = 1,
                    SubmittingUserUserId = 1,
                    AssignedUserUserId = 2,
                    Priority = 2,
                    IsCompleted = false,
                    CreationTime = DateTime.Now,
                    DueDate = new DateTime(),
                    Order = 3
                },
                new
                {
                    TaskId = 3,
                    Name = "Medium priority task",
                    Description = "This task is medium priority",
                    ProjectId = 1,
                    CategoryId = 1,
                    SubmittingUserUserId = 1,
                    AssignedUserUserId = 1,
                    Priority = 3,
                    IsCompleted = false,
                    CreationTime = DateTime.Now,
                    DueDate = new DateTime(),
                    Order = 2
                },
                new
                {
                    TaskId = 4,
                    Name = "High priority task",
                    Description = "This task is very high priority",
                    ProjectId = 1,
                    CategoryId = 1,
                    SubmittingUserUserId = 1,
                    AssignedUserUserId = 2,
                    Priority = 4,
                    IsCompleted = false,
                    CreationTime = DateTime.Now,
                    DueDate = new DateTime(),
                    Order = 1
                },
                new
                {
                    TaskId = 5,
                    Name = "Very high priority task",
                    Description = "This task is very high priority",
                    ProjectId = 1,
                    CategoryId = 1,
                    SubmittingUserUserId = 1,
                    AssignedUserUserId = 1,
                    Priority = 5,
                    IsCompleted = false,
                    CreationTime = DateTime.Now,
                    DueDate = new DateTime(),
                    Order = 0
                },
                new
                {
                    TaskId = 6,
                    Name = "In progress task",
                    Description = "This task is in progress",
                    ProjectId = 1,
                    CategoryId = 2,
                    SubmittingUserUserId = 1,
                    AssignedUserUserId = 2,
                    Priority = 3,
                    IsCompleted = false,
                    CreationTime = DateTime.Now,
                    DueDate = new DateTime(),
                    Order = 0
                },
                new
                {
                    TaskId = 7,
                    Name = "Completed task",
                    Description = "This task has been completed",
                    ProjectId = 1,
                    CategoryId = 3,
                    SubmittingUserUserId = 1,
                    AssignedUserUserId = 1,
                    Priority = 2,
                    IsCompleted = true,
                    CreationTime = DateTime.Now,
                    DueDate = new DateTime(),
                    Order = 0
                }
                );

            // Seed Categories
            modelBuilder.Entity<Category>().HasData(
                new
                {
                    CategoryId = 1,
                    Name = "To Do",
                    ProjectId = 1,
                    Order = 0
                },
                new
                {
                    CategoryId = 2,
                    Name = "In Progress",
                    ProjectId = 1,
                    Order = 1
                },
                new
                {
                    CategoryId = 3,
                    Name = "Completed",
                    ProjectId = 1,
                    Order = 2
                }
                );

            // Seed UserProjects
            modelBuilder.Entity<UserProject>().HasData(
                new
                {
                    UserProjectId = 1,
                    UserId = 1,
                    ProjectId = 1
                },
                new
                {
                    UserProjectId = 2,
                    UserId = 2,
                    ProjectId = 1
                }
                );
        }

        private byte[] StringToByteArray(string hex)
        {
            return Enumerable.Range(0, hex.Length)
                             .Where(x => x % 2 == 0)
                             .Select(x => Convert.ToByte(hex.Substring(x, 2), 16))
                             .ToArray();
        }
    }
}
