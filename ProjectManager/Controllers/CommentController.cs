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
    public class CommentController : Controller
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
                    CommentId = c.CommentId,
                    Text = c.Text,
                    CreationTime = c.CreationTime,
                    TaskId = c.Task.TaskId,
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
                .Include(c => c.User)
                .Select(c => new
                {
                    CommentId = c.CommentId,
                    Text = c.Text,
                    CreationTime = c.CreationTime,
                    TaskId = c.Task.TaskId,
                    UserId = c.User.UserId
                })
                .ToList();
            return Json(comments);
        }

        [HttpPost]
        public JsonResult Create(int taskId, int userId, string text)
        {
            var context = new MyContext();
            var comment = new Comment()
            {
                Text = text,
                CreationTime = TimeZoneInfo.ConvertTimeToUtc(DateTime.Now),
                Task = context.Tasks.Find(taskId),
                User = context.Users.Find(userId)
            };
            context.Comments.Add(comment);
            context.SaveChanges();

            return Json(comment.CommentId);
        }

        [HttpPost]
        public void Delete(int commentId)
        {
            var context = new DAL.MyContext();
            var comment = context.Comments.Find(commentId);

            context.Comments.Attach(comment);
            context.Comments.Remove(comment);
            context.SaveChanges();
        }
    }
}
