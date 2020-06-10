using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using Microsoft.AspNetCore.Mvc;
using ProjectManager.DAL;
using ProjectManager.Models;

namespace ProjectManager.Controllers
{
    public class TagController : Controller
    {
        public JsonResult New(string tagName, int taskId, int projectId)
        {
            var context = new MyContext();
            var task = context.Tasks.Find(taskId);
            var project = context.Projects.Find(projectId);

            var tag = new Tag()
            {
                Name = tagName,
                Project = project
            };

            var tagTask = new TagTask()
            {
                Tag = tag,
                Task = task
            };

            context.Tags.Add(tag);
            context.TagTasks.Add(tagTask);
            context.SaveChanges();

            return Json(tag.TagId);
        }

        public void SetColorIndex(int tagId, int colorIndex)
        {
            var context = new MyContext();
            var tag = context.Tags.Find(tagId);
            tag.ColorIndex = colorIndex;
            context.SaveChanges();
        }
    }
}
