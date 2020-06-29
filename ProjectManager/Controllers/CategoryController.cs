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
    public class CategoryController : Controller
    {
        [HttpGet]
        public JsonResult Get(int categoryId)
        {
            var context = new MyContext();
            var category = context.Categories
                .Where(c => c.CategoryId== categoryId)
                .Include(c => c.Project)
                .Include(c => c.Tasks)
                .Select(c => new
                {
                    CategoryId = c.CategoryId,
                    Name = c.Name,
                    ProjectId = c.Project.ProjectId,
                    TaskIds = c.Tasks.Select(t => t.TaskId)
                })
                .First();
            return Json(category);
        }

        [HttpGet]
        public JsonResult GetAllInProject(int projectId)
        {
            var context = new MyContext();
            var categories = context.Categories
                .Where(c => c.Project.ProjectId == projectId)
                .Include(c => c.Project)
                .Include(c => c.Tasks)
                .Select(c => new
                {
                    CategoryId = c.CategoryId,
                    Name = c.Name,
                    ProjectId = c.Project.ProjectId,
                    TaskIds = c.Tasks.Select(t => t.TaskId)
                })
                .ToList();
            return Json(categories);
        }

        [HttpPost]
        public JsonResult Create(int projectId, string categoryName)
        {
            using (var context = new DAL.MyContext())
            {
                var newCategory = new ProjectManager.Models.Category()
                {
                    Name = categoryName,
                    Project = context.Projects.Find(projectId)
                };
                context.Categories.Add(newCategory);
                context.SaveChanges();

                return Json(newCategory.CategoryId);
            }
        }

        [HttpPost]
        public void AddTask(int categoryId, int taskId)
        {
            var context = new MyContext();
            var category = context.Categories.Find(categoryId);
            var task = context.Tasks.Find(taskId);
            category.Tasks.Add(task);
            context.SaveChanges();
        }

        public void Delete(int categoryId)
        {
            var context = new DAL.MyContext();
            var taskController = new TaskController();
            var tasks = context.Tasks
                .Where(t => t.Category.CategoryId == categoryId)
                .ToList();
            foreach (var task in tasks)
            {
                taskController.Delete(task.TaskId);
            }

            context = new DAL.MyContext();
            var category = context.Categories.Find(categoryId);
            context.Categories.Attach(category);
            context.Categories.Remove(category);
            context.SaveChanges();
        }
    }
}
