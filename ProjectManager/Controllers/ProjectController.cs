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
        public JsonResult Get(int projectId)
        {
            var context = new MyContext();
            var project = context.Projects
                .Include(p => p.Owner)
                .Include(p => p.TeamMembers)
                .ThenInclude(up => up.User)
                .Include(p => p.Tags)
                .Where(p => p.ProjectId == projectId)
                .First();
            return Json(project);
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

        public void SetName(int projectId, string name)
        {
            var context = new MyContext();
            var project = context.Projects.Find(projectId);
            project.Name = name;
            context.SaveChanges();
        }

        public void SetDescription(int projectId, string description)
        {
            var context = new MyContext();
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

        public void SetOwner(int projectId, int userId)
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
