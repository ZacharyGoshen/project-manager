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
                    id = up.Project.ProjectId,
                    name = up.Project.Name,
                    description = up.Project.Description,
                    categoryIds = up.Project.Categories.Select(c => c.CategoryId),
                    taskIds = up.Project.Tasks.Select(t => t.TaskId),
                    ownerId = up.Project.Owner.UserId,
                    teamMemberIds = up.Project.TeamMembers.Select(up => up.User.UserId)
                })
                .ToList();
            return Json(projects);
        }

        public struct ProjectJson
        {
            public int[] CategoryIds { get; set; }
            public string Description { get; set; }
            public string DueDate { get; set; }
            public string Name { get; set; }
            public int OwnerId { get; set; }
            public int[] TagIds { get; set; }
            public int[] TaskIds { get; set; }
            public int[] TeamMemberIds { get; set; }
        }

        [HttpGet]
        [Route("project/{id}")]
        public JsonResult Get(int id)
        {
            var context = new MyContext();
            var project = context.UserProjects
                .Where(up => up.Project.ProjectId == id)
                .Include(up => up.Project.Categories)
                .Include(up => up.Project.Tasks)
                .Include(up => up.Project.Owner)
                .Include(up => up.Project.TeamMembers)
                .Select(up => new ProjectJson()
                {
                    CategoryIds = up.Project.Categories.Select(c => c.CategoryId).ToArray(),
                    Description = up.Project.Description,
                    DueDate = up.Project.DueDate,
                    Name = up.Project.Name,
                    OwnerId = up.Project.Owner.UserId,
                    TagIds = up.Project.Tags.Select(t => t.TagId).ToArray(),
                    TaskIds = up.Project.Tasks.Select(t => t.TaskId).ToArray(),
                    TeamMemberIds = up.Project.TeamMembers.Select(up => up.User.UserId).ToArray()
                })
                .First();
            return Json(project);
        }

        [HttpPost]
        [Route("project")]
        public JsonResult Create([FromBody] [Bind("CategoryIds", "Description", "DueDate", "Name", "OwnerId", "TagIds", "TaskIds", "TeamMemberIds")] ProjectJson projectJson)
        {
            var context = new MyContext();
            var project = new Project()
            {
                Description = projectJson.Description,
                Name = projectJson.Name,
                Owner = context.Users.Find(projectJson.OwnerId),
                TeamMembers = new List<UserProject>()
            };
            project.TeamMembers.Add(new UserProject()
            {
                Project = project,
                User = context.Users.Find(projectJson.OwnerId)
            });
            context.Projects.Add(project);
            context.SaveChanges();

            return Json(project.ProjectId);
        }

        [HttpPut]
        [Route("project/{id}")]
        public JsonResult Update(int id, [FromBody] [Bind("CategoryIds", "Description", "DueDate", "Name", "OwnerId", "TagIds", "TaskIds", "TeamMemberIds")] ProjectJson projectJson)
        {
            var context = new MyContext();
            var project = context.Projects.Where(p => p.ProjectId == id).Include(p => p.TeamMembers).First();
            foreach (var categoryId in projectJson.CategoryIds)
            {
                var category = context.Categories.Find(categoryId);
                if (category != null && category.Project.ProjectId != id)
                {
                    project.Categories.Add(category);
                }
            }
            foreach (var category in context.Categories.Where(c => c.Project.ProjectId == id))
            {
                if (!projectJson.CategoryIds.Contains(category.CategoryId))
                {
                    category.Project = null;
                }
            }
            project.Description = projectJson.Description;
            project.DueDate = projectJson.DueDate;
            project.Name = projectJson.Name;
            project.Owner = context.Users.Find(projectJson.OwnerId);
            foreach (var tagId in projectJson.TagIds)
            {
                var tag = context.Tags.Find(tagId);
                if (tag != null && tag.Project.ProjectId != id)
                {
                    project.Tags.Add(tag);
                }
            }
            foreach (var tag in context.Tags.Where(t => t.Project.ProjectId == id))
            {
                if (!projectJson.TagIds.Contains(tag.TagId))
                {
                    tag.Project = null;
                }
            }
            foreach (var taskId in projectJson.TaskIds)
            {
                var task = context.Tasks.Find(taskId);
                if (task != null && task.Project.ProjectId != id)
                {
                    project.Tasks.Add(task);
                }
            }
            foreach (var task in context.Tasks.Where(t => t.Project.ProjectId == id))
            {
                if (!projectJson.TaskIds.Contains(task.TaskId))
                {
                    task.Project = null;
                }
            }
            foreach (var teamMemberId in projectJson.TeamMemberIds)
            {
                if (!context.UserProjects.Any(up => up.Project.ProjectId == id && up.User.UserId == teamMemberId))
                {
                    project.TeamMembers.Add(new UserProject()
                    {
                        Project = project,
                        User = context.Users.Find(teamMemberId)
                    });
                }
            }
            var teamMemberIds = context.UserProjects.Where(up => up.Project.ProjectId == id).Select(up => up.User.UserId).ToList();
            foreach (var teamMemberId in teamMemberIds)
            {
                if (!projectJson.TeamMemberIds.Contains(teamMemberId))
                {
                    var userProject = context.UserProjects.Where(up => up.User.UserId == teamMemberId).First();
                    if (userProject != null)
                    {
                        context.UserProjects.Attach(userProject);
                        context.UserProjects.Remove(userProject);
                    }
                }
            }
            context.SaveChanges();

            return Json(true);
        }

        [HttpDelete]
        [Route("project/{id}")]
        public JsonResult Delete(int id)
        {
            var context = new DAL.MyContext();
            var userProjects = context.UserProjects.Where(up => up.Project.ProjectId == id).ToList();
            foreach (var userProject in userProjects)
            {
                context.UserProjects.Attach(userProject);
                context.UserProjects.Remove(userProject);
            }
            var project = context.Projects.Find(id);
            context.Projects.Attach(project);
            context.Projects.Remove(project);
            context.SaveChanges();

            return Json(true);
        }
    }
}
