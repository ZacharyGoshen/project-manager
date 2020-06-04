using System;
using System.Collections.Generic;
using System.Diagnostics;
using System.Linq;
using System.Threading.Tasks;
using System.Web;
using Microsoft.AspNetCore.Mvc;
using Microsoft.Extensions.Logging;
using ProjectManager.Models;
using ProjectManager.DAL;
using Microsoft.AspNetCore.Http;
using ProjectManager.ViewModels;
using Microsoft.EntityFrameworkCore;

namespace ProjectManager.Controllers
{
    public class HomeController : BaseController
    {
        public IActionResult Index()
        {
            using (var context = new DAL.MyContext())
            {
                context.Database.EnsureCreated();
                var tasks = context.Tasks
                    .Include(t => t.Category)
                    .Include(t => t.AssignedUser)
                    .Include(t => t.SubmittingUser)
                    .Include(t => t.Project)
                    .OrderBy(t => t.Category)
                    .ToList();

                var model = new TaskListViewModel()
                {
                    Tasks = tasks
                };

                return View(model);
            }
        }

        public IActionResult Details(int id)
        {
            using (var context = new DAL.MyContext())
            {
                context.Database.EnsureCreated();
                var task = context.Tasks
                    .Include(t => t.Category)
                    .Include(t => t.AssignedUser)
                    .Include(t => t.SubmittingUser)
                    .Include(t => t.Project)
                    .Where(t => t.TaskId == id)
                    .First();

                var model = new TaskDetailsViewModel()
                {
                    Task = task
                };

                return View(model);
            }
        }

        [HttpGet]
        public IActionResult Board()
        {
            using (var context = new DAL.MyContext())
            {
                context.Database.EnsureCreated();

                var project = context.Projects.First();

                var categories = context.Categories
                    .Where(c => c.Project == project)
                    .OrderBy(c => c.Order)
                    .ToList(); ;

                var tasksByCategory = new List<List<ProjectManager.Models.Task>>() { };
                foreach (ProjectManager.Models.Category category in categories)
                {
                    tasksByCategory.Add(context.Tasks
                        .Include(t => t.Category)
                        .Include(t => t.AssignedUser)
                        .Include(t => t.SubmittingUser)
                        .Include(t => t.Project)
                        .Where(t => t.Project == project)
                        .Where(t => t.Category == category)
                        .OrderBy(t => t.Order)
                        .ToList());
                }

                var users = context.Users.ToList();

                var model = new BoardViewModel()
                {
                    Tasks = tasksByCategory,
                    Categories = categories,
                    Users = users
                };

                return View(model);
            }
        }

        public JsonResult GetCategoriesInProject(int projectId)
        {
            using (var context = new DAL.MyContext())
            {
                var project = context.Projects.Find(projectId);
                var categories = context.Categories
                    .Where(c => c.Project == project)
                    .OrderBy(c => c.Order)
                    .ToList();
                return Json(categories);
            }
        }

        [HttpPost]
        public JsonResult NewCategory(int projectId, string categoryName)
        {
            using (var context = new DAL.MyContext())
            {
                var newCategory = new ProjectManager.Models.Category()
                {
                    Name = categoryName
                };
                newCategory.Project = context.Projects.Find(projectId);
                newCategory.Order = context.Categories.Where(c => c.Project == newCategory.Project).ToList().Count;
                context.Categories.Add(newCategory);
                context.SaveChanges();

                return Json(newCategory.CategoryId);
            }
        }

        [HttpPost]
        public void MoveCategory(int categoryId, int newIndex)
        {
            using (var context = new DAL.MyContext())
            {
                var categoryToMove = context.Categories
                    .Include(c => c.Project)
                    .Where(c => c.CategoryId == categoryId)
                    .First();
                var oldIndex = categoryToMove.Order;

                var categoriesInProject = context.Categories
                    .Where(c => c.Project == categoryToMove.Project)
                    .ToList();
                foreach (ProjectManager.Models.Category category in categoriesInProject)
                {
                    var entity = context.Categories.Find(category.CategoryId);
                    if (entity.Order > oldIndex)
                    {
                        entity.Order -= 1;
                    }
                    if (entity.Order >= newIndex)
                    {
                        entity.Order += 1;
                    }
                    context.Categories.Update(entity);
                }

                categoryToMove.Order = newIndex;
                context.SaveChanges();
            }
        }

        [HttpPost]
        public void DeleteCategory(int categoryId)
        {
            using (var context = new DAL.MyContext())
            {
                var categoryToDelete = context.Categories
                    .Include(c => c.Project)
                    .Where(c => c.CategoryId == categoryId)
                    .First();

                var categoriesWithHigherOrder = context.Categories
                    .Where(c => c.Project == categoryToDelete.Project)
                    .Where(c => c.Order > categoryToDelete.Order)
                    .ToList();

                foreach (ProjectManager.Models.Category category in categoriesWithHigherOrder)
                {
                    var entity = context.Categories.Find(category.CategoryId);
                    entity.Order -= 1;
                    context.Categories.Update(entity);
                }
                context.Categories.Attach(categoryToDelete);
                context.Categories.Remove(categoryToDelete);
                context.SaveChanges();
            }
        }

        public JsonResult GetTask(int taskId)
        {
            using (var context = new DAL.MyContext())
            {
                var task = context.Tasks
                    .Include(t => t.AssignedUser)
                    .Include(t => t.SubmittingUser)
                    .Where(t => t.TaskId == taskId)
                    .First();
                return Json(task);
            }
        }

        public JsonResult GetTasksInCategory(int categoryId)
        {
            using (var context = new DAL.MyContext())
            {
                var tasks = context.Tasks
                    .Include(t => t.AssignedUser)
                    .Include(t => t.SubmittingUser)
                    .Where(t => t.Category == context.Categories.Find(categoryId))
                    .OrderBy(t => t.Order)
                    .ToList();
                return Json(tasks);
            }
        }

        public JsonResult GetTasksInProject(int projectId)
        {
            using (var context = new DAL.MyContext())
            {
                var tasks = context.Tasks
                    .Include(t => t.AssignedUser)
                    .Include(t => t.SubmittingUser)
                    .Include(t => t.Category)
                    .Where(t => t.Project == context.Projects.Find(projectId))
                    .OrderBy(t => t.Order)
                    .ToList();
                return Json(tasks);
            }
        }

        public JsonResult NewTask(int categoryId, string taskName)
        {
            using (var context = new DAL.MyContext())
            {
                var newTask = new ProjectManager.Models.Task()
                {
                    Name = taskName,
                    CreationDate = DateTime.Now,
                    Order = 0
                };

                newTask.Project = context.Projects.Find(1);
                newTask.Category = context.Categories.Find(categoryId);
                newTask.SubmittingUser = context.Users.Find(1);

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

        public void AssignUserToTask(int taskId, int userId)
        {
            using (var context = new DAL.MyContext())
            {
                var assignedTask = context.Tasks.Find(taskId);
                var assignedUser = context.Users.Find(userId);

                assignedTask.AssignedUser = assignedUser;
                context.SaveChanges();
            }
        }

        public void SetDueDate(int taskId, int day, int month, int year)
        {
            using (var context = new DAL.MyContext())
            {
                var task = context.Tasks.Find(taskId);
                task.DueDateRangeStart = new DateTime(year, month, day);
                task.DueDateRangeEnd = new DateTime(year, month, day);
                context.SaveChanges();
            }
        }

        public void MoveTask(int taskId, int newCategoryId, int newTaskIndex)
        {
            using (var context = new DAL.MyContext())
            {
                var taskToMove = context.Tasks
                    .Include(t => t.Category)
                    .Where(t => t.TaskId == taskId)
                    .First();
                var categoryBeforeMove = taskToMove.Category;

                var tasksInOriginalColumn = context.Tasks
                    .Where(t => t.Category == categoryBeforeMove)
                    .Where(t => t.Order > taskToMove.Order)
                    .ToList();
                foreach (ProjectManager.Models.Task task in tasksInOriginalColumn)
                {
                    var entity = context.Tasks.Find(task.TaskId);
                    entity.Order -= 1;
                    context.Tasks.Update(entity);
                }

                context.SaveChanges();

                var categoryAfterMove = context.Categories.Find(newCategoryId);
                var tasksInNewColumn = context.Tasks
                    .Where(t => t.Category == categoryAfterMove)
                    .Where(t => t.Order >= newTaskIndex)
                    .ToList();
                foreach (ProjectManager.Models.Task task in tasksInNewColumn)
                {
                    var entity = context.Tasks.Find(task.TaskId);
                    entity.Order += 1;
                    context.Tasks.Update(entity);
                }

                taskToMove.Category = categoryAfterMove;
                taskToMove.Order = newTaskIndex;

                context.SaveChanges();
            }
        }

        public void DeleteTask(int taskId)
        {
            using (var context = new DAL.MyContext())
            {
                var taskToDelete = context.Tasks
                    .Include(t => t.Category)
                    .Where(t => t.TaskId == taskId)
                    .First();

                var tasksWithHigherOrder = context.Tasks
                    .Where(t => t.Category == taskToDelete.Category)
                    .Where(t => t.Order > taskToDelete.Order)
                    .ToList();

                foreach (ProjectManager.Models.Task task in tasksWithHigherOrder)
                {
                    var entity = context.Tasks.Find(task.TaskId);
                    entity.Order -= 1;
                    context.Tasks.Update(entity);
                }

                context.Tasks.Attach(taskToDelete);
                context.Tasks.Remove(taskToDelete);
                context.SaveChanges();
            }
        }
    }
}
