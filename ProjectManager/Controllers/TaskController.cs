﻿using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using ProjectManager.DAL;
using ProjectManager.Models;

namespace ProjectManager.Controllers
{
    public class TaskController : BaseController
    {
        [HttpGet]
        public JsonResult Get(int taskId)
        {
            var context = new MyContext();
            var task = context.Tasks
                .Where(t => t.TaskId == taskId)
                .Include(t => t.AssignedUser)
                .Include(t => t.Category)
                .Include(t => t.Comments)
                .Include(t => t.SubmittingUser)
                .Include(t => t.TagTasks)
                .Select(t => new
                {
                    assignedUserId = t.AssignedUser.UserId,
                    categoryId = t.Category.CategoryId,
                    commentIds = t.Comments.Select(c => c.CommentId).ToArray(),
                    creationTime = t.CreationTime,
                    description = t.Description,
                    dueDate = t.DueDate,
                    id = t.TaskId,
                    isCompleted = t.IsCompleted,
                    name = t.Name,
                    order = t.Order,
                    priority = t.Priority,
                    submittingUserId = t.SubmittingUser.UserId,
                    tagIds = t.TagTasks.Select(tt => tt.Tag.TagId).ToArray()
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
                .Include(t => t.AssignedUser)
                .Include(t => t.Category)
                .Include(t => t.Comments)
                .Include(t => t.SubmittingUser)
                .Include(t => t.TagTasks)
                .Select(t => new
                {
                    assignedUserId = t.AssignedUser.UserId,
                    categoryId = t.Category.CategoryId,
                    commentIds = t.Comments.Select(c => c.CommentId).ToArray(),
                    creationTime = t.CreationTime,
                    description = t.Description,
                    dueDate = t.DueDate,
                    id = t.TaskId,
                    isCompleted = t.IsCompleted,
                    name = t.Name,
                    order = t.Order,
                    priority = t.Priority,
                    submittingUserId = t.SubmittingUser.UserId,
                    tagIds = t.TagTasks.Select(tt => tt.Tag.TagId).ToArray()
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
                    CreationTime = "",
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

        [HttpPost]
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

        [HttpPost]
        public void UpdateDescription(int taskId, string description)
        {
            var context = new DAL.MyContext();
            var task = context.Tasks.Find(taskId);
            task.Description = description;
            context.SaveChanges();
        }

        //[HttpPost]
        //public void UpdateDueDate(int taskId, int year, int month, int day)
        //{
        //    var context = new DAL.MyContext();
        //    var task = context.Tasks.Find(taskId);
        //    if ((day == 1) && (month == 0) && (year == 0))
        //    {
        //        task.DueDate = new DateTime();
        //    }
        //    else
        //    {
        //        task.DueDate = TimeZoneInfo.ConvertTimeToUtc(new DateTime(year, month, day));
        //    }
        //    context.SaveChanges();
        //}

        [HttpPost]
        public void UpdateIsCompleted(int taskId, bool isCompleted)
        {
            var context = new DAL.MyContext();
            var task = context.Tasks.Find(taskId);
            task.IsCompleted = isCompleted;
            context.SaveChanges();
        }

        [HttpPost]
        public void UpdateName(int taskId, string name)
        {
            var context = new DAL.MyContext();
            var task = context.Tasks.Find(taskId);
            task.Name = name;
            context.SaveChanges();
        }

        [HttpPost]
        public void UpdatePriority(int taskId, int priority)
        {
            var context = new DAL.MyContext();
            var task = context.Tasks.Find(taskId);
            task.Priority = priority;
            context.SaveChanges();
        }

        [HttpPost]
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

        [HttpPost]
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

        [HttpPost]
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

        //[HttpPost]
        //public void Delete(int taskId)
        //{
        //    var context = new DAL.MyContext();
        //    var commentController = new CommentController();
        //    var comments = context.Comments
        //        .Where(c => c.Task.TaskId == taskId)
        //        .ToList();
        //    foreach (var comment in comments)
        //    {
        //        commentController.Delete(comment.CommentId);
        //    }

        //    context = new DAL.MyContext();
        //    var tags = context.TagTasks
        //        .Where(tt => tt.Task.TaskId == taskId)
        //        .Select(tt => tt.Tag)
        //        .ToList();
        //    foreach (var tag in tags)
        //    {
        //        RemoveTag(taskId, tag.TagId);
        //    }

        //    context = new DAL.MyContext();

        //    var taskToDelete = context.Tasks
        //        .Where(t => t.TaskId == taskId)
        //        .Include(t => t.Category)
        //        .First();
        //    context.Tasks.Attach(taskToDelete);
        //    context.Tasks.Remove(taskToDelete);

        //    var tasksWithHigherOrder = context.Tasks
        //        .Where(t => t.Category == taskToDelete.Category)
        //        .Where(t => t.Order > taskToDelete.Order)
        //        .ToList();
        //    foreach (Models.Task task in tasksWithHigherOrder)
        //    {
        //        var entity = context.Tasks.Find(task.TaskId);
        //        entity.Order -= 1;
        //        context.Tasks.Update(entity);
        //    }

        //    context.SaveChanges();
        //}

        public void Sort(int projectId, string property, bool descending)
        {
            var context = new DAL.MyContext();

            var categories = context.Categories
                .Where(c => c.Project.ProjectId == projectId)
                .ToList();
            foreach (Category category in categories)
            {
                var tasks = new List<Models.Task>();
                if (property == "name") {
                    if (descending)
                    {
                        tasks = context.Tasks
                            .Where(t => t.Category.CategoryId == category.CategoryId)
                            .OrderByDescending(t => t.Name)
                            .ToList();
                    }
                    else
                    {
                        tasks = context.Tasks
                            .Where(t => t.Category.CategoryId == category.CategoryId)
                            .OrderBy(t => t.Name)
                            .ToList();
                    }
                }
                else if (property == "dueDate")
                {
                    if (descending)
                    {
                        tasks = context.Tasks
                            .Where(t => t.Category.CategoryId == category.CategoryId)
                            .OrderByDescending(t => t.DueDate)
                            .ToList();
                    }
                    else
                    {
                        tasks = context.Tasks
                            .Where(t => t.Category.CategoryId == category.CategoryId)
                            .OrderBy(t => t.DueDate)
                            .ToList();
                    }
                }
                else if (property == "priority")
                {
                    if (descending)
                    {
                        tasks = context.Tasks
                            .Where(t => t.Category.CategoryId == category.CategoryId)
                            .OrderByDescending(t => t.Priority)
                            .ToList();
                    }
                    else
                    {
                        tasks = context.Tasks
                            .Where(t => t.Category.CategoryId == category.CategoryId)
                            .OrderBy(t => t.Priority)
                            .ToList();
                    }
                }

                var order = 0;
                foreach (Models.Task task in tasks)
                {
                    task.Order = order;
                    order += 1;
                }
            }

            context.SaveChanges();
        }

        [HttpPost]
        public void Move(int taskId, int categoryId, int order)
        {
            var context = new MyContext();
            var task = context.Tasks
                .Where(t => t.TaskId == taskId)
                .Include(t => t.Category)
                .First();

            var originCategory = context.Categories
                .Where(c => c.CategoryId == task.Category.CategoryId)
                .Include(c => c.Tasks)
                .First();

            foreach (var taskInOriginCategory in originCategory.Tasks)
            {
                if (taskInOriginCategory.Order > task.Order)
                {
                    taskInOriginCategory.Order -= 1;
                }
            }

            var destinationCategory = context.Categories
                .Where(c => c.CategoryId == categoryId)
                .Include(c => c.Tasks)
                .First();

            foreach (var taskInDestinationCategory in destinationCategory.Tasks)
            {
                if (taskInDestinationCategory.Order >= order)
                {
                    taskInDestinationCategory.Order += 1;
                }
            }

            task.Category = destinationCategory;
            task.Order = order;

            context.SaveChanges();
        }

        public struct TaskJson
        {
            public int AssignedUserId { get; set; }
            public int CategoryId { get; set; }
            public int[] CommentIds { get; set; }
            public string CreationTime { get; set; }
            public string Description { get; set; }
            public string DueDate { get; set; }
            public bool IsCompleted { get; set; }
            public string Name { get; set; }
            public int Order { get; set; }
            public int Priority { get; set; }
            public int ProjectId { get; set; }
            public int SubmittingUserId { get; set; }
            public int[] TagIds { get; set; }
        }

        [HttpPost]
        [Route("task")]
        public JsonResult Create([FromBody] [Bind("AssignedUserId", "CategoryId", "CommentIds", "CreationTime", "Description", "DueDate", "IsCompleted", "Name", "Order", "Priority", "ProjectId", "SubmittingUserId", "TagIds")] TaskJson taskJson)
        {
            var context = new MyContext();
            var task = new Models.Task()
            {
                Category = context.Categories.Find(taskJson.CategoryId),
                Name = taskJson.Name,
                Order = 0,
                Project = context.Projects.Find(taskJson.ProjectId),
                SubmittingUser = context.Users.Find(taskJson.SubmittingUserId)
            };
            context.Tasks.Add(task);
            context.SaveChanges();

            return Json(task.TaskId);
        }

        [HttpPut]
        [Route("task/{id}")]
        public JsonResult Update(int id, [FromBody] [Bind("AssignedUserId", "CategoryId", "CommentIds", "CreationTime", "Description", "DueDate", "IsCompleted", "Name", "Order", "Priority", "ProjectId", "SubmittingUserId", "TagIds")] TaskJson taskJson)
        {
            var context = new MyContext();
            var task = context.Tasks.Find(id);
            task.AssignedUser = context.Users.Find(taskJson.AssignedUserId);
            task.Category = context.Categories.Find(taskJson.CategoryId);
            task.DueDate = taskJson.DueDate;
            task.Order = taskJson.Order;
            context.SaveChanges();

            return Json(true);
        }

        [HttpDelete]
        [Route("task/{id}")]
        public JsonResult Delete(int id)
        {
            var context = new DAL.MyContext();
            var tagTasks = context.TagTasks.Where(tt => tt.Task.TaskId == id).ToList();
            foreach (var tagTask in tagTasks)
            {
                context.TagTasks.Attach(tagTask);
                context.TagTasks.Remove(tagTask);
            }
            var task = context.Tasks.Find(id);
            context.Tasks.Attach(task);
            context.Tasks.Remove(task);
            context.SaveChanges();

            return Json(true);
        }
    }
}
