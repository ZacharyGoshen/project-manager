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
    public class CommentController : BaseController
    {
        [HttpGet]
        public JsonResult Get(int commentId)
        {
            var context = new MyContext();
            var comment = context.Comments
                .Where(c => c.CommentId == commentId)
                .Include(c => c.Task)
                .Include(c => c.User)
                .Select(c => new
                {
                    CreationTime = c.CreationTime,
                    Id = c.CommentId,
                    TaskId = c.Task.TaskId,
                    Text = c.Text,
                    UserId = c.User.UserId
                })
                .ToList();
            return Json(comment);
        }

        [HttpGet]
        public JsonResult GetAllInTask(int taskId)
        {
            var context = new MyContext();
            var comments = context.Comments
                .Where(c => c.Task.TaskId == taskId)
                .Include(c => c.Task)
                .Include(c => c.Task)
                .Include(c => c.User)
                .Select(c => new
                {
                    CreationTime = c.CreationTime,
                    Id = c.CommentId,
                    TaskId = c.Task.TaskId,
                    Text = c.Text,
                    UserId = c.User.UserId
                })
                .ToList();
            return Json(comments);
        }

        [HttpGet]
        public JsonResult GetAllInProject(int projectId)
        {
            var context = new MyContext();
            
            var comments = context.Comments
                .Where(c => c.Task.Project.ProjectId == projectId)
                .Include(c => c.Task)
                .Include(c => c.User)
                .Select(c => new
                {
                    id = c.CommentId,
                    text = c.Text,
                    creationTime = c.CreationTime,
                    taskId = c.Task.TaskId,
                    userId = c.User.UserId,
                    userFirstName = c.User.FirstName,
                    userLastName = c.User.LastName
                })
                .ToList();
            return Json(comments);
        }

        public struct CommentJson
        {
            public string CreationTime { get; set; }
            public int TaskId { get; set; }
            public string Text { get; set; }
            public int UserId { get; set; }
        }

        [HttpPost]
        [Route("comment")]
        public JsonResult Create([FromBody] [Bind("CreationTime", "TaskId", "Text", "UserId")] CommentJson commentJson)
        {
            var context = new MyContext();
            var comment = new Comment()
            {
                CreationTime = commentJson.CreationTime,
                Task = context.Tasks.Find(commentJson.TaskId),
                Text = commentJson.Text,
                User = context.Users.Find(commentJson.UserId)
            };
            context.Comments.Add(comment);
            context.SaveChanges();

            return Json(comment.CommentId);
        }

        [HttpDelete]
        [Route("comment/{id}")]
        public JsonResult Delete(int id)
        {
            var context = new DAL.MyContext();
            var comment = context.Comments.Find(id);
            context.Comments.Attach(comment);
            context.Comments.Remove(comment);
            context.SaveChanges();

            return Json(true);
        }
    }
}
