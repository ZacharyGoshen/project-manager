using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using Microsoft.AspNetCore.Mvc;
using ProjectManager.DAL;
using ProjectManager.Models;

namespace ProjectManager.Controllers
{
    public class TaskController : Controller
    {
        public void SetIsCompleted(int taskId, bool isCompleted)
        {
            var context = new MyContext();
            var task = context.Tasks.Find(taskId);
            task.IsCompleted = isCompleted;
            context.SaveChanges();
        }

        public void SetPriority(int taskId, int priority)
        {
            var context = new MyContext();
            var task = context.Tasks.Find(taskId);
            task.Priority = priority;
            context.SaveChanges();
        }

        public void AddTag(int taskId, int tagId)
        {
            var context = new MyContext();
            var task = context.Tasks.Find(taskId);
            var tag = context.Tags.Find(tagId);

            var tagTask = new TagTask()
            {
                Tag = tag,
                Task = task
            };

            context.TagTasks.Add(tagTask);
            context.SaveChanges();
        }
    }
}
