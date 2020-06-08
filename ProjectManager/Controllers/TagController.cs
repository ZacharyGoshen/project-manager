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
        public void New(string tagName, int taskId, int projectId)
        {
            Console.WriteLine(projectId);

            var context = new MyContext();
            var task = context.Tasks.Find(taskId);
            var project = context.Projects.Find(projectId);

            Console.WriteLine(project);

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
        }
    }
}
