using System;
using System.Collections.Generic;
using System.Linq;
using ProjectManager.Models;
using Microsoft.AspNetCore.Mvc;
using System.Security.Cryptography;
using Microsoft.AspNetCore.Cryptography.KeyDerivation;
using Microsoft.EntityFrameworkCore;
using ProjectManager.DAL;

namespace ProjectManager.Controllers
{
    public class UserController : BaseController
    {
        [HttpGet]
        public JsonResult GetLoggedInId()
        {
            return Json(this.UserId);
        }

        [HttpGet]
        public JsonResult Get(int userId)
        {
            var context = new MyContext();
            var user = context.Users
                .Where(u => u.UserId == userId)
                .Include(u => u.AssignedTasks)
                .Include(u => u.Comments)
                .Include(u => u.Invites)
                .Include(u => u.SubmittedTasks)
                .Include(u => u.UserProjects).ThenInclude(up => up.Project)
                .Select(u => new
                {
                    AssignedTaskIds = u.AssignedTasks.Select(t => t.TaskId).ToArray(),
                    BackgroundColor = u.BackgroundColor,
                    CommentIds = u.Comments.Select(c => c.CommentId).ToArray(),
                    CurrentProjectId = u.CurrentProjectId,
                    Email = u.Email,
                    FirstName = u.FirstName,
                    Id = u.UserId,
                    InviteIds = u.Invites.Select(i => i.InviteId).ToArray(),
                    LastName = u.LastName,
                    ProjectIds = u.UserProjects.Select(up => up.Project.ProjectId).ToArray(),
                    SubmittedTaskIds = u.SubmittedTasks.Select(t => t.TaskId).ToArray()
                })
                .ToList();
            return Json(user);
        }

        [HttpGet]
        public JsonResult GetAllInProject(int projectId)
        {
            var context = new MyContext();
            var users = context.Users
                .Where(u => u.UserProjects.Select(up => up.Project.ProjectId).Contains(projectId))
                .Include(u => u.AssignedTasks)
                .Include(u => u.Comments)
                .Include(u => u.Invites)
                .Include(u => u.SubmittedTasks)
                .Include(u => u.UserProjects).ThenInclude(up => up.Project)
                .Select(u => new
                {
                    AssignedTaskIds = u.AssignedTasks.Select(t => t.TaskId).ToArray(),
                    BackgroundColor = u.BackgroundColor,
                    CommentIds = u.Comments.Select(c => c.CommentId).ToArray(),
                    CurrentProjectId = u.CurrentProjectId,
                    Email = u.Email,
                    FirstName = u.FirstName,
                    Id = u.UserId,
                    InviteIds = u.Invites.Select(i => i.InviteId).ToArray(),
                    LastName = u.LastName,
                    ProjectIds = u.UserProjects.Select(up => up.Project.ProjectId).ToArray(),
                    SubmittedTaskIds = u.SubmittedTasks.Select(t => t.TaskId).ToArray()
                })
                .ToList();
            return Json(users);
        }

        [HttpGet]
        public JsonResult GetCurrentProjectId(int userId)
        {
            var context = new DAL.MyContext();
            var user = context.Users.Find(userId);
            var currentProjectId = user.CurrentProjectId;
            return Json(currentProjectId);
        }

        public JsonResult GetWithEmail(string email)
        {
            var context = new DAL.MyContext();
            if (context.Users.Where(u => u.Email == email).ToList().Count == 0)
            {
                return Json(null);
            }
            else
            {
                var user = context.Users
                    .Where(u => u.Email == email)
                    .Include(u => u.AssignedTasks)
                    .Include(u => u.Comments)
                    .Include(u => u.Invites)
                    .Include(u => u.SubmittedTasks)
                    .Include(u => u.UserProjects).ThenInclude(up => up.Project)
                    .Select(u => new
                    {
                        AssignedTaskIds = u.AssignedTasks.Select(t => t.TaskId).ToArray(),
                        BackgroundColor = u.BackgroundColor,
                        CommentIds = u.Comments.Select(c => c.CommentId).ToArray(),
                        CurrentProjectId = u.CurrentProjectId,
                        Email = u.Email,
                        FirstName = u.FirstName,
                        Id = u.UserId,
                        InviteIds = u.Invites.Select(i => i.InviteId).ToArray(),
                        LastName = u.LastName,
                        ProjectIds = u.UserProjects.Select(up => up.Project.ProjectId).ToArray(),
                        SubmittedTaskIds = u.SubmittedTasks.Select(t => t.TaskId).ToArray()
                    })
                    .First();
                return Json(user);
            }

        }

        public void UpdatePassword(int userId, string password)
        {
            var context = new DAL.MyContext();
            var user = context.Users.Find(userId);
            user.Password = HashPassword(password, user.Salt);
            context.SaveChanges();
        }

        [HttpPost]
        public JsonResult LogIn(string email, string password)
        {
            var context = new DAL.MyContext();
            context.Database.EnsureCreated();
            if (context.Users.Where(e => e.Email == email).ToList().Count == 1)
            {
                var user = context.Users.Where(e => e.Email == email).First();
                string encrypted = HashPassword(password, user.Salt);
                if (encrypted == user.Password)
                {
                    this.UserId = user.UserId;
                    return Json(true);
                }
            }
            return Json(false);
        }

        [HttpPost]
        public void LogOut()
        {
            this.UserId = 0;
            this.Demo = 0;
        }

        [HttpPost]
        public JsonResult SignUp(string firstName, string lastName, string email, string password)
        {
            var context = new DAL.MyContext();
            context.Database.EnsureCreated();
            if (context.Users.Where(u => u.Email == email).ToList().Count == 0)
            {
                byte[] salt = GenerateSalt();
                string hashed = HashPassword(password, salt);
                var user = new User()
                {
                    FirstName = firstName,
                    LastName = lastName,
                    Email = email,
                    Password = hashed,
                    Salt = salt
                };

                context.Users.Add(user);
                context.SaveChanges();

                this.UserId = user.UserId;
                return Json(true);
            }
            else
            {
                return Json(false);
            }
        }

        public JsonResult Authenticate(int userId, string password)
        {
            var context = new DAL.MyContext();
            var user = context.Users.Find(userId);
            var hashedPassword = HashPassword(password, user.Salt);
            if (hashedPassword == user.Password)
            {
                return Json(true);
            }
            else
            {
                return Json(false);
            }
        }

        // generate a 128-bit salt using a secure PRNG
        private byte[] GenerateSalt() {
            var salt = new byte[128 / 8];
            using (var rng = RandomNumberGenerator.Create())
            {
                rng.GetBytes(salt);
            }
            return salt;
        }

        // derive a 256-bit subkey (use HMACSHA1 with 10,000 iterations)
        private string HashPassword(string password, byte[] salt)
        {
            string hashed = Convert.ToBase64String(KeyDerivation.Pbkdf2(
                password: password,
                salt: salt,
                prf: KeyDerivationPrf.HMACSHA1,
                iterationCount: 10000,
                numBytesRequested: 256 / 8));
            return hashed;
        }

        public struct UserJson
        {
            public int[] AssignedTaskIds { get; set; }
            public int BackgroundColor { get; set; }
            public int[] CommentIds { get; set; }
            public int CurrentProjectId { get; set; }
            public string Email { get; set; }
            public string FirstName { get; set; }
            public int[] InviteIds { get; set; }
            public string LastName { get; set; }
            public int[] ProjectIds { get; set; }
            public int[] SubmittedTaskIds { get; set; }
        }

        [HttpPut]
        [Route("user/{id}")]
        public JsonResult Update(int id, [FromBody] [Bind("AssignedTaskIds", "BackgroundColor", "CommentIds", "CurrentProjectId", "Email", "FirstName", "InviteIds", "LastName", "ProjectIds", "SubmittedTaskIds")] UserJson userJson)
        {
            var context = new MyContext();
            var user = context.Users.Find(id);
            foreach (var assignedTaskId in userJson.AssignedTaskIds)
            {
                var assignedTask = context.Tasks.Where(t => t.TaskId == assignedTaskId).Include(t => t.AssignedUser).First();
                if (assignedTask.AssignedUser.UserId != id)
                {
                    user.AssignedTasks.Add(assignedTask);
                }
            }
            foreach (var assignedTask in context.Tasks.Where(t => t.AssignedUser.UserId == id))
            {
                if (!userJson.AssignedTaskIds.Contains(assignedTask.TaskId))
                {
                    assignedTask.AssignedUser = null;
                }
            }
            user.BackgroundColor = userJson.BackgroundColor;
            foreach (var commentId in userJson.CommentIds)
            {
                var comment = context.Comments.Where(c => c.CommentId == commentId).Include(c => c.User).First();
                if (comment.User.UserId != id)
                {
                    user.Comments.Add(comment);
                }
            }
            foreach (var comment in context.Comments.Where(c => c.User.UserId == id))
            {
                if (!userJson.CommentIds.Contains(comment.CommentId))
                {
                    comment.User = null;
                }
            }
            user.CurrentProjectId = userJson.CurrentProjectId;
            user.Email = userJson.Email;
            user.FirstName = userJson.FirstName;
            user.LastName = userJson.LastName;
            context.SaveChanges();

            return Json(true);
        }
    }
}
