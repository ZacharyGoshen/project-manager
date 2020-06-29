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
    public class TagController : Controller
    {
        [HttpGet]
        public JsonResult Get(int tagId)
        {
            var context = new MyContext();
            var tag = context.Tags
                .Where(t => t.TagId == tagId)
                .Include(t => t.TagTasks)
                .Select(t => new
                {
                    TagId = t.TagId,
                    Name = t.Name,
                    BackgroundColor = t.BackgroundColor,
                    TaskIds = t.TagTasks.Select(tt => tt.Task.TaskId)
                })
                .First();
            return Json(tag);
        }

        [HttpGet]
        public JsonResult GetAllInProject(int projectId)
        {
            var context = new MyContext();
            var tags = context.Tags
                .Where(t => t.Project.ProjectId == projectId)
                .Include(t => t.TagTasks)
                .Select(t => new
                {
                    TagId = t.TagId,
                    Name = t.Name,
                    BackgroundColor = t.BackgroundColor,
                    TaskIds = t.TagTasks.Select(tt => tt.Task.TaskId)
                })
                .ToList();
            return Json(tags);
        }

        public JsonResult Create(int projectId, string tagName)
        {
            var context = new MyContext();
            var project = context.Projects.Find(projectId);

            var tag = new Tag()
            {
                Name = tagName,
                Project = project
            };
            context.Tags.Add(tag);
            context.SaveChanges();

            return Json(tag.TagId);
        }

        public void UpdateBackgroundColor(int tagId, int backgroundColor)
        {
            var context = new MyContext();
            var tag = context.Tags.Find(tagId);
            tag.BackgroundColor = backgroundColor;
            context.SaveChanges();
        }

        public void Delete(int tagId)
        {
            var context = new MyContext();
            var tag = context.Tags.Find(tagId);

            var tagTasks = context.TagTasks
                .Where(tt => tt.Tag == tag)
                .ToList();
            foreach (var tagTask in tagTasks) {
                context.TagTasks.Attach(tagTask);
                context.TagTasks.Remove(tagTask);
            }

            context.Tags.Attach(tag);
            context.Tags.Remove(tag);
            context.SaveChanges();
        }
    }
}
