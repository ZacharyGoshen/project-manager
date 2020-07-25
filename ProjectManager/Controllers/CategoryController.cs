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
    public class CategoryController : BaseController
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
                    id = c.CategoryId,
                    name = c.Name,
                    order = c.Order,
                    projectId = c.Project.ProjectId,
                    taskIds = c.Tasks.Select(t => t.TaskId).ToArray()
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
                    id = c.CategoryId,
                    name = c.Name,
                    order = c.Order,
                    projectId = c.Project.ProjectId,
                    taskIds = c.Tasks.Select(t => t.TaskId).ToArray()
                })
                .ToList();
            return Json(categories);
        }

        public struct CategoryJson
        {
            public string Name { get; set; }
            public int Order { get; set; }
            public int ProjectId { get; set; }
            public int[] TaskIds { get; set; }
        }

        [HttpPost]
        [Route("category")]
        public JsonResult Create([FromBody] [Bind("Name", "Order", "ProjectId", "TaskIds")] CategoryJson categoryJson)
        {
            var context = new MyContext();
            var category = new Category()
            {
                Name = categoryJson.Name,
                Order = categoryJson.Order,
                Project = context.Projects.Find(categoryJson.ProjectId)
            };
            context.Categories.Add(category);
            context.SaveChanges();

            return Json(category.CategoryId);
        }

        [HttpPut]
        [Route("category/{id}")]
        public JsonResult Update(int id, [FromBody] [Bind("Name", "Order", "ProjectId", "TaskIds")] CategoryJson categoryJson)
        {
            Console.WriteLine(id);
            var context = new MyContext();
            var category = context.Categories.Where(c => c.CategoryId == id).Include(c => c.Tasks).First();
            category.Name = categoryJson.Name;
            category.Order = categoryJson.Order;
            category.Project = context.Projects.Find(categoryJson.ProjectId);
            foreach (var taskId in categoryJson.TaskIds)
            {
                var task = context.Tasks.Where(t => t.TaskId == taskId).Include(t => t.Category).First();
                if (task.Category != null && task.Category.CategoryId != id)
                {
                    category.Tasks.Add(task);
                }
            }
            foreach (var task in context.Tasks.Where(t => t.Category.CategoryId == id))
            {
                if (!categoryJson.TaskIds.Contains(task.TaskId))
                {
                    task.Category = null;
                }
            }
            context.SaveChanges();

            return Json(true);
        }

        [HttpDelete]
        [Route("category/{id}")]
        public JsonResult Delete(int id)
        {
            var context = new DAL.MyContext();
            var category = context.Categories.Find(id);
            context.Categories.Attach(category);
            context.Categories.Remove(category);
            context.SaveChanges();

            return Json(true);
        }
    }
}
