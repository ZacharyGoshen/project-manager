using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using Microsoft.AspNetCore.Mvc;
using ProjectManager.DAL;
using ProjectManager.Models;

namespace ProjectManager.Controllers
{
    public class CommentController : Controller
    {
        [HttpPost]
        public JsonResult New(string text, int taskId, int userId)
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

            return Json(comment);
        }
    }
}
