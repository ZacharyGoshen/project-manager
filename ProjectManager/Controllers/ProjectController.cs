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
        public JsonResult Get(int projectId)
        {
            var context = new MyContext();
            var project = context.UserProjects
                .Where(up => up.Project.ProjectId == projectId)
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
                .First();
            return Json(project);
        }

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

        [HttpPost]
        public JsonResult Create(int userId, string name, string description)
        {
            var context = new MyContext();

            var project = new Project()
            {
                Name = name,
                Description = description,
                Owner = context.Users.Find(userId)
            };
            context.Projects.Add(project);

            var userProject = new UserProject()
            {
                User = context.Users.Find(userId),
                Project = project
            };
            context.UserProjects.Add(userProject);

            context.SaveChanges();

            return Json(project.ProjectId);
        }

        [HttpPost]
        public void UpdateName(int projectId, string name)
        {
            var context = new DAL.MyContext();
            var project = context.Projects.Find(projectId);
            project.Name = name;
            context.SaveChanges();
        }

        [HttpPost]
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

        [HttpPost]
        public void UpdateOwner(int projectId, int userId)
        {
            var context = new MyContext();
            var project = context.Projects.Find(projectId);
            var owner = context.Users.Find(userId);
            project.Owner = owner;
            context.SaveChanges();
        }

        [HttpPost]
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

        [HttpPost]
        public void RemoveTeamMember(int projectId, int userId)
        {
            var context = new MyContext();
            var project = context.Projects
                .Where(p => p.ProjectId == projectId)
                .Include(p => p.Owner)
                .Include(p => p.TeamMembers)
                .First();
            var teamMember = context.Users.Find(userId);
            var userProject = context.UserProjects
                .Where(up => up.User == teamMember)
                .Where(up => up.Project == project)
                .First();

            if (project.Owner.UserId == userId && project.TeamMembers.Count != 1)
            {
                project.Owner = context.UserProjects
                    .Where(up => up.Project.ProjectId == projectId && up.User.UserId != userId)
                    .Include(up => up.User)
                    .Select(up => up.User)
                    .First();
                context.SaveChanges();
            }

            var tasks = context.Tasks.Where(t => t.AssignedUser.UserId == userId).ToList();
            var taskController = new TaskController();
            foreach (var task in tasks)
            {
                taskController.UpdateAssignedUser(task.TaskId, 0);
            }

            var comments = context.Comments.Where(c => c.User.UserId == userId && c.Task.Project.ProjectId == projectId).ToList();
            var commentController = new CommentController();
            foreach (var comment in comments)
            {
                commentController.Delete(comment.CommentId);
            }

            if (teamMember.CurrentProjectId == projectId)
            {
                teamMember.CurrentProjectId = 0;
            }

            context.UserProjects.Attach(userProject);
            context.UserProjects.Remove(userProject);
            context.SaveChanges();
        }

        [HttpPost]
        public void Delete(int projectId)
        {
            var context = new DAL.MyContext();
            var categoryController = new CategoryController();
            var categories = context.Categories
                .Where(c => c.Project.ProjectId == projectId)
                .ToList();
            foreach (var category in categories)
            {
                categoryController.Delete(category.CategoryId);
            }

            context = new DAL.MyContext();
            var tagController = new TagController();
            var tags = context.Tags
                .Where(t => t.Project.ProjectId == projectId)
                .ToList();
            foreach (var tag in tags)
            {
                tagController.Delete(tag.TagId);
            }

            context = new DAL.MyContext();
            var inviteController = new InviteController();
            var invites = context.Invites
                .Where(i => i.Project.ProjectId == projectId)
                .ToList();
            foreach (var invite in invites)
            {
                inviteController.Delete(invite.InviteId);
            }

            context = new DAL.MyContext();
            var teamMembers = context.Projects
                .Where(p => p.ProjectId == projectId)
                .Include(p => p.TeamMembers)
                .ThenInclude(up => up.User)
                .First()
                .TeamMembers
                .Select(up => up.User)
                .ToList();
            foreach (var teamMember in teamMembers)
            {
                RemoveTeamMember(projectId, teamMember.UserId);
            }

            context = new DAL.MyContext();
            var project = context.Projects
                .Where(p => p.ProjectId == projectId)
                .Include(p => p.TeamMembers)
                .ThenInclude(up => up.User)
                .First();

            context.Projects.Attach(project);
            context.Projects.Remove(project);

            context.SaveChanges();
        }
    }
}
