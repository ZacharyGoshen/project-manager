using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using ProjectManager.DAL;
using ProjectManager.Models;

namespace ProjectManager.Controllers
{
    public class ProjectController : BaseController
    {
        [HttpGet]
        public JsonResult GetAllWithUser(int userId)
        {
            var context = new MyContext();
            var projects = context.UserProjects
                .Where(up => up.User.UserId == userId)
                .Include(up => up.Project.Categories)
                .Include(up => up.Project.Tasks)
                .Include(up => up.Project.Owner)
                .Include(up => up.Project.TeamMembers)
                .Select(up => new
                {
                    ProjectId = up.Project.ProjectId,
                    Name = up.Project.Name,
                    Description = up.Project.Description,
                    CategoryIds = up.Project.Categories.Select(c => c.CategoryId),
                    TaskIds = up.Project.Tasks.Select(t => t.TaskId),
                    OwnerId = up.Project.Owner.UserId,
                    TeamMemberIds = up.Project.TeamMembers.Select(up => up.User.UserId)
                })
                .ToList();
            return Json(projects);
        }

        public JsonResult New(string name, string description, int day, int month, int year, int ownerId, int[] teamMemberIds)
        {
            var context = new MyContext();

            var project = new Project()
            {
                Name = name,
                Description = description,
                Owner = context.Users.Find(ownerId)
            };

            if ((day == -1) && (month == -1) && (year == -1))
            {
                project.DueDate = new DateTime();
            } else
            {
                project.DueDate = new DateTime(year, month, day);
            }

            var teamMemberUserProjects = new List<UserProject>();
            foreach (var teamMemberId in teamMemberIds)
            {
                var teamMember = context.Users.Find(teamMemberId);
                var teamMemberUserProject = new UserProject()
                {
                    User = teamMember,
                    Project = project
                };
                teamMemberUserProjects.Add(teamMemberUserProject);
            }
            project.TeamMembers = teamMemberUserProjects;

            context.Projects.Add(project);
            context.SaveChanges();

            return Json(project.ProjectId);
        }

        public void SetCurrentProject(int projectId)
        {
            this.CurrentProjectId = projectId;
        }

        public void UpdateName(int projectId, string name)
        {
            var context = new DAL.MyContext();
            var project = context.Projects.Find(projectId);
            project.Name = name;
            context.SaveChanges();
        }

        public void UpdateDescription(int projectId, string description)
        {
            var context = new DAL.MyContext();
            var project = context.Projects.Find(projectId);
            project.Description = description;
            context.SaveChanges();
        }

        public void SetDueDate(int projectId, int day, int month, int year)
        {
            var context = new MyContext();
            var project = context.Projects.Find(projectId);
            if ((day == -1) && (month == -1) && (year == -1))
            {
                project.DueDate = new DateTime();
            }
            else
            {
                project.DueDate = TimeZoneInfo.ConvertTimeToUtc(new DateTime(year, month, day));
            }
            context.SaveChanges();
        }

        public void UpdateOwner(int projectId, int userId)
        {
            var context = new MyContext();
            var project = context.Projects.Find(projectId);
            var owner = context.Users.Find(userId);
            project.Owner = owner;
            context.SaveChanges();
        }

        public void AddTeamMember(int projectId, int userId)
        {
            var context = new MyContext();
            var project = context.Projects
                .Include(p => p.TeamMembers)
                .Where(p => p.ProjectId == projectId)
                .First();
            var teamMember = context.Users.Find(userId);
            var userProject = new UserProject()
            {
                User = teamMember,
                Project = project
            };
            project.TeamMembers.Add(userProject);
            context.SaveChanges();
        }

        public void RemoveTeamMember(int projectId, int userId)
        {
            var context = new MyContext();
            var project = context.Projects.Find(projectId);
            var teamMember = context.Users.Find(userId);
            var userProject = context.UserProjects
                .Where(up => up.User == teamMember)
                .Where(up => up.Project == project)
                .First();
            context.UserProjects.Attach(userProject);
            context.UserProjects.Remove(userProject);
            context.SaveChanges();
        }
    }
}
