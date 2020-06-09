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

        public void RemoveTag(int taskId, int tagId)
        {
            var context = new MyContext();
            var task = context.Tasks.Find(taskId);
            var tag = context.Tags.Find(tagId);

            var tagTask = context.TagTasks
                .Where(tt => tt.Tag == tag)
                .Where(tt => tt.Task == task)
                .First();

            context.TagTasks.Attach(tagTask);
            context.TagTasks.Remove(tagTask);
            context.SaveChanges();
        }

        public void RemoveAllTags(int taskId)
        {
            var context = new DAL.MyContext();
            var task = context.Tasks
                .Where(t => t.TaskId == taskId)
                .First();

            var tagTasks = context.TagTasks
                .Where(tt => tt.Task == task)
                .ToList();

            foreach (TagTask tagTask in tagTasks)
            {
                context.TagTasks.Attach(tagTask);
                context.TagTasks.Remove(tagTask);
            }

            context.SaveChanges();
        }

        public void Delete(int taskId)
        {
            var context = new DAL.MyContext();

            var taskToDelete = context.Tasks
                .Include(t => t.Category)
                .Where(t => t.TaskId == taskId)
                .First();

            var tasksWithHigherOrder = context.Tasks
                .Where(t => t.Category == taskToDelete.Category)
                .Where(t => t.Order > taskToDelete.Order)
                .ToList();

            foreach (Models.Task task in tasksWithHigherOrder)
            {
                var entity = context.Tasks.Find(task.TaskId);
                entity.Order -= 1;
                context.Tasks.Update(entity);
            }

            RemoveAllTags(taskId);

            context.Tasks.Attach(taskToDelete);
            context.Tasks.Remove(taskToDelete);
            context.SaveChanges();
        }
    }
}
