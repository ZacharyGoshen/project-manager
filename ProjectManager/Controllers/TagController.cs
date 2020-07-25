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
    public class TagController : BaseController
    {
        [HttpGet]
        public JsonResult Get(int tagId)
        {
            var context = new MyContext();
            var tag = context.Tags
                .Where(t => t.TagId == tagId)
                .Include(t => t.Project)
                .Include(t => t.TagTasks)
                .Select(t => new
                {
                    BackgroundColor = t.BackgroundColor,
                    Id = t.TagId,
                    Name = t.Name,
                    ProjectId = t.Project.ProjectId,
                    TaskIds = t.TagTasks.Select(tt => tt.Task.TaskId).ToArray()
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
                .Include(t => t.Project)
                .Include(t => t.TagTasks)
                .Select(t => new
                {
                    BackgroundColor = t.BackgroundColor,
                    Id = t.TagId,
                    Name = t.Name,
                    ProjectId = t.Project.ProjectId,
                    TaskIds = t.TagTasks.Select(tt => tt.Task.TaskId).ToArray()
                })
                .ToList();
            return Json(tags);
        }

        public struct TagJson {
            public int BackgroundColor { get; set; }
            public string Name { get; set; }
            public int ProjectId { get; set; }
            public int[] TaskIds { get; set; }
        }

        [HttpPost]
        [Route("tag")]
        public JsonResult Create([FromBody] [Bind("BackgroundColor", "Name", "ProjectId", "TaskIds")] TagJson tagJson)
        {
            var context = new MyContext();
            var tag = new Tag()
            {
                BackgroundColor = tagJson.BackgroundColor,
                Name = tagJson.Name,
                Project = context.Projects.Find(tagJson.ProjectId)
            };
            context.Tags.Add(tag);
            context.SaveChanges();

            return Json(tag.TagId);
        }

        [HttpPut]
        [Route("tag/{id}")]
        public JsonResult Update(int id, [FromBody] [Bind("BackgroundColor", "Name", "ProjectId", "TaskIds")] TagJson tagJson)
        {
            var context = new MyContext();
            var tag = context.Tags.Where(t => t.TagId == id).Include(t => t.TagTasks).First();
            tag.BackgroundColor = tagJson.BackgroundColor;
            tag.Name = tagJson.Name;
            tag.Project = context.Projects.Find(tagJson.ProjectId);
            foreach (var taskId in tagJson.TaskIds)
            {
                if (!context.TagTasks.Any(tt => tt.Tag.TagId == id && tt.Task.TaskId == taskId))
                {
                    tag.TagTasks.Add(new TagTask()
                    {
                        Tag = tag,
                        Task = context.Tasks.Find(taskId)
                    });
                }
            }
            var taskIds = context.TagTasks.Where(tt => tt.Tag.TagId == id).Select(tt => tt.Task.TaskId).ToList();
            foreach (var taskId in taskIds)
            {
                if (!tagJson.TaskIds.Contains(taskId))
                {
                    var tagTask = context.TagTasks.Where(tt => tt.Task.TaskId == taskId).First();
                    context.TagTasks.Attach(tagTask);
                    context.TagTasks.Remove(tagTask);
                }
            }
            context.SaveChanges();

            return Json(true);
        }

        [HttpDelete]
        [Route("tag/{id}")]
        public JsonResult Delete(int id)
        {
            var context = new DAL.MyContext();
            var tagTasks = context.TagTasks.Where(tt => tt.Tag.TagId == id).ToList();
            foreach (var tagTask in tagTasks)
            {
                context.TagTasks.Attach(tagTask);
                context.TagTasks.Remove(tagTask);
            }
            var tag = context.Tags.Find(id);
            context.Tags.Attach(tag);
            context.Tags.Remove(tag);
            context.SaveChanges();

            return Json(true);
        }
    }
}
