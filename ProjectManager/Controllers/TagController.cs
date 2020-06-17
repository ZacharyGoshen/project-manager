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
        public JsonResult New(int projectId, string name)
        {
            var context = new MyContext();
            var project = context.Projects.Find(projectId);

            var tag = new Tag()
            {
                Name = name,
                Project = project
            };

            context.Tags.Add(tag);
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

        public void Remove(int tagId)
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
