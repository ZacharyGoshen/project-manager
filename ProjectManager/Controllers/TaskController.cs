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
        [HttpGet]
        public JsonResult Get(int taskId)
        {
            var context = new MyContext();
            var task = context.Tasks
                .Where(t => t.TaskId == taskId)
                .Include(t => t.Category)
                .Include(t => t.AssignedUser)
                .Include(t => t.TagTasks)
                .Select(t => new
                {
                    TaskId = t.TaskId,
                    Name = t.Name,
                    Description = t.Description,
                    CreationTime = t.CreationTime,
                    DueDate = t.DueDate,
                    Order = t.Order,
                    Priority = t.Priority,
                    IsCompleted = t.IsCompleted,
                    CategoryId = t.Category.CategoryId,
                    AssignedUserId = t.AssignedUser.UserId,
                    TagIds = t.TagTasks.Select(tt => tt.Tag.TagId)
                })
                .First();
            return Json(task);
        }

        [HttpGet]
        public JsonResult GetAllInProject(int projectId)
        {
            var context = new MyContext();
            var tasks = context.Tasks
                .Where(t => t.Project.ProjectId == projectId)
                .Include(t => t.Category)
                .Include(t => t.AssignedUser)
                                .Include(t => t.TagTasks)
                .Select(t => new
                {
                    TaskId = t.TaskId,
                    Name = t.Name,
                    Description = t.Description,
                    CreationTime = t.CreationTime,
                    DueDate = t.DueDate,
                    Order = t.Order,
                    Priority = t.Priority,
                    IsCompleted = t.IsCompleted,
                    CategoryId = t.Category.CategoryId,
                    AssignedUserId = t.AssignedUser.UserId,
                    TagIds = t.TagTasks.Select(tt => tt.Tag.TagId)
                })
                .ToList();
            return Json(tasks);
        }

        [HttpPost]
        public JsonResult Create(int userId, int projectId, int categoryId, string taskName)
        {
            using (var context = new DAL.MyContext())
            {
                var newTask = new ProjectManager.Models.Task()
                {
                    Name = taskName,
                    CreationTime = TimeZoneInfo.ConvertTimeToUtc(DateTime.Now),
                    Order = 0,
                    SubmittingUser = context.Users.Find(userId),
                    Project = context.Projects.Find(projectId),
                    Category = context.Categories.Find(categoryId)
                };

                var tasks = context.Tasks.Where(t => t.Category == newTask.Category).ToList();
                foreach (ProjectManager.Models.Task task in tasks)
                {
                    var entity = context.Tasks.Find(task.TaskId);
                    entity.Order += 1;
                    context.Tasks.Update(entity);
                }
                context.Tasks.Add(newTask);
                context.SaveChanges();

                return Json(newTask.TaskId);
            }
        }

        public void UpdateIsCompleted(int taskId, bool isCompleted)
        {
            var context = new DAL.MyContext();
            var task = context.Tasks.Find(taskId);
            task.IsCompleted = isCompleted;
            context.SaveChanges();
        }

        public void UpdateName(int taskId, string name)
        {
            var context = new DAL.MyContext();
            var task = context.Tasks.Find(taskId);
            task.Name = name;
            context.SaveChanges();
        }

        public void UpdateDescription(int taskId, string description)
        {
            var context = new DAL.MyContext();
            var task = context.Tasks.Find(taskId);
            task.Description = description;
            context.SaveChanges();
        }

        public void UpdateAssignedUser(int taskId, int userId)
        {
            var context = new MyContext();
            var task = context.Tasks
                .Where(t => t.TaskId == taskId)
                .Include(t => t.AssignedUser)
                .First();
            if (userId == 0)
            {
                task.AssignedUser.AssignedTasks.Remove(task);
            }
            else
            {
                var user = context.Users.Find(userId);
                task.AssignedUser = user;
            }

            context.SaveChanges();
        }

        public void UpdateDueDate(int taskId, int year, int month, int day)
        {
            var context = new DAL.MyContext();
            var task = context.Tasks.Find(taskId);
            if ((day == 1) && (month == 0) && (year == 0))
            {
                task.DueDate = new DateTime();
            }
            else
            {
                task.DueDate = TimeZoneInfo.ConvertTimeToUtc(new DateTime(year, month, day));
            }
            context.SaveChanges();
        }

        public void UpdatePriority(int taskId, int priority)
        {
            var context = new DAL.MyContext();
            var task = context.Tasks.Find(taskId);
            task.Priority = priority;
            context.SaveChanges();
        }

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

        [HttpPost]
        public void Delete(int taskId)
        {
            var context = new DAL.MyContext();
            var commentController = new CommentController();
            var comments = context.Comments
                .Where(c => c.Task.TaskId == taskId)
                .ToList();
            foreach (var comment in comments)
            {
                commentController.Delete(comment.CommentId);
            }

            context = new DAL.MyContext();
            var tags = context.TagTasks
                .Where(tt => tt.Task.TaskId == taskId)
                .Select(tt => tt.Tag)
                .ToList();
            foreach (var tag in tags)
            {
                RemoveTag(taskId, tag.TagId);
            }

            context = new DAL.MyContext();

            var taskToDelete = context.Tasks
                .Where(t => t.TaskId == taskId)
                .Include(t => t.Category)
                .First();
            context.Tasks.Attach(taskToDelete);
            context.Tasks.Remove(taskToDelete);

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

            context.SaveChanges();
        }
    }
}
