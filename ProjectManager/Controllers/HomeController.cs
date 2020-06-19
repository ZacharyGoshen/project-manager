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
        public IActionResult Login()
        {
            return View();
        }

        public IActionResult List()
        {
            if (this.UserId == 0)
            {
                return RedirectToAction("Login", "Home");
            }

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

        [HttpGet]
        public IActionResult Board()
        {
            if (this.UserId == 0)
            {
                return RedirectToAction("Login", "Home");
            }

            var context = new DAL.MyContext();
            context.Database.EnsureCreated();

            var loggedInUser = context.Users.Find(this.UserId);

            var userProjects = context.UserProjects
                .Where(up => up.User == loggedInUser)
                .Include(up => up.Project)
                .ToList();
            var projects = new List<Project>();
            foreach (var userProject in userProjects)
            {
                projects.Add(userProject.Project);
            }

            var ownedProjects = context.Projects
                .Where(p => p.Owner == loggedInUser)
                .ToList();
            foreach (var ownedProject in ownedProjects)
            {
                if (projects.IndexOf(ownedProject) == -1)
                {
                    projects.Add(ownedProject);
                }
            }

            var model = new ProjectViewModel()
            {
                LoggedInUser = loggedInUser,
                Projects = projects
            };


            if (projects.Count > 0)
            {
                var currentProject = projects[0];
                if (this.CurrentProjectId != 0)
                {
                    currentProject = context.Projects.Find(CurrentProjectId);
                }
                model.CurrentProject = currentProject;
                var categoriesInCurrentProject = context.Categories
                    .Where(c => c.Project == currentProject)
                    .OrderBy(c => c.Order)
                    .ToList(); ;
                model.Categories = categoriesInCurrentProject;

                var tasksByCategory = new List<List<ProjectManager.Models.Task>>() { };
                foreach (Category category in categoriesInCurrentProject)
                {
                    tasksByCategory.Add(context.Tasks
                        .Include(t => t.Category)
                        .Include(t => t.AssignedUser)
                        .Include(t => t.SubmittingUser)
                        .Include(t => t.Project)
                        .Include(t => t.TagTasks)
                        .ThenInclude(tt => tt.Tag)
                        .Where(t => t.Project == currentProject)
                        .Where(t => t.Category == category)
                        .OrderBy(t => t.Order)
                        .ToList());
                }
                model.Tasks = tasksByCategory;

                model.Users = context.Users.ToList();
                model.Tags = context.Tags.Where(t => t.Project == currentProject).ToList();
            }
            else
            {
                model.CurrentProject = null;
                model.Categories = new List<Category>();
                model.Tasks = new List<List<Models.Task>>();
                model.Users = new List<User>();
                model.Tags = new List<Tag>();
            }
            return View(model);
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
                    .Include(t => t.Comments)
                    .Include(t => t.TagTasks)
                    .ThenInclude(tt => tt.Tag)
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

        public JsonResult NewTask(int userId, int projectId, int categoryId, string taskName)
        {
            using (var context = new DAL.MyContext())
            {
                var newTask = new ProjectManager.Models.Task()
                {
                    Name = taskName,
                    CreationTime = TimeZoneInfo.ConvertTimeToUtc(DateTime.Now),
                    Order = 0
                };

                newTask.SubmittingUser = context.Users.Find(userId);
                newTask.Project = context.Projects.Find(projectId);
                newTask.Category = context.Categories.Find(categoryId);

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

        public void ChangeTaskName(int taskId, string taskName)
        {
            using (var context = new DAL.MyContext())
            {
                var task = context.Tasks.Find(taskId);
                task.Name = taskName;
                context.SaveChanges();
            }
        }

        public void SetTaskDescription(int taskId, string taskDescription)
        {
            using (var context = new DAL.MyContext())
            {
                var task = context.Tasks.Find(taskId);
                task.Description = taskDescription;
                context.SaveChanges();
            }
        }

        public void AssignUserToTask(int taskId, int userId)
        {
            var context = new DAL.MyContext();
            var assignedTask = context.Tasks.Find(taskId);
            var assignedUser = context.Users.Find(userId);

            assignedTask.AssignedUser = assignedUser;
            context.SaveChanges();
        }

        public void SetDueDate(int taskId, int day, int month, int year)
        {
            var context = new DAL.MyContext();
            var task = context.Tasks.Find(taskId);
            if ((day == -1) && (month == -1) && (year == -1))
            {
                task.DueDateRangeStart = new DateTime();
                task.DueDateRangeEnd = new DateTime();
            }
            else
            {
                task.DueDateRangeStart = TimeZoneInfo.ConvertTimeToUtc(new DateTime(year, month, day));
                task.DueDateRangeEnd = TimeZoneInfo.ConvertTimeToUtc(new DateTime(year, month, day));
            }
            context.SaveChanges();
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
    }
}
