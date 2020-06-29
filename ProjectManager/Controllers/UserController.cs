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
        public JsonResult GetIdOfLoggedIn()
        {
            return Json(this.UserId);
        }

        [HttpGet]
        public JsonResult GetAllInProject(int projectId)
        {
            var context = new MyContext();
            var users = context.UserProjects
                .Where(up => up.Project.ProjectId == projectId)
                .Include(up => up.User)
                .ThenInclude(u => u.AssignedTasks)
                .Select(up => new
                {
                    UserId = up.User.UserId,
                    FirstName = up.User.FirstName,
                    LastName = up.User.LastName,
                    Email = up.User.Email,
                    BackgroundColor = up.User.BackgroundColor,
                    AssignedTaskIds = up.User.AssignedTasks.Select(t => t.TaskId)
                })
                .ToList();
            return Json(users);
        }

        public JsonResult FindFirstTenThatContainName(string name, int projectId)
        {
            var context = new DAL.MyContext();
            List<User> users = new List<User>();
            if (projectId == 0)
            {
                users = context.Users.ToList();
            }
            else
            {
                var project = context.Projects.Find(projectId);
                var userProjects = context.UserProjects
                    .Include(up => up.User)
                    .Include(up => up.Project)
                    .Where(up => up.Project == project);
                foreach (var userProject in userProjects)
                {
                    users.Add(userProject.User);
                }
            }
            var matchingUsers = new List<User>();
            foreach (var user in users)
            {
                var fullName = user.FirstName.ToLower() + " " + user.LastName.ToLower();
                if (fullName.Contains(name) && matchingUsers.Count < 10)
                {
                    matchingUsers.Add(user);
                }
            }

            return Json(matchingUsers);
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
                var user = context.Users.Where(u => u.Email == email).FirstOrDefault();
                return Json(user);
            }
        }

        [HttpPost]
        public JsonResult New(string firstName, string lastName, string email, string password)
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
                return Json("success");
            }
            else
            {
                return Json("failure");
            }
        }

        public void SetFirstName(int userId, string firstName)
        {
            var context = new DAL.MyContext();
            var user = context.Users.Find(userId);
            user.FirstName = firstName;
            context.SaveChanges();
        }

        public void SetLastName(int userId, string lastName)
        {
            var context = new DAL.MyContext();
            var user = context.Users.Find(userId);
            user.LastName = lastName;
            context.SaveChanges();
        }

        public void SetEmail(int userId, string email)
        {
            var context = new DAL.MyContext();
            var user = context.Users.Find(userId);
            user.Email = email;
            context.SaveChanges();
        }

        public void SetPassword(int userId, string password)
        {
            var context = new DAL.MyContext();
            var user = context.Users.Find(userId);
            user.Password = HashPassword(password, user.Salt);
            context.SaveChanges();
        }

        public void SetBackgroundColor(int userId, int backgroundColor)
        {
            var context = new DAL.MyContext();
            var user = context.Users.Find(userId);
            user.BackgroundColor = backgroundColor;
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
                    return Json("success");
                }
            }
            return Json("failure");
        }

        [HttpPost]
        public void LogOut()
        {
            this.UserId = 0;
            this.CurrentProjectId = 0;
        }

        public void RemoveAssignedTask(int taskId, int userId)
        {
            var context = new DAL.MyContext();
            var assignedUser = context.Users.Find(userId);
            var assignedTask = context.Tasks.Find(taskId);

            assignedUser.AssignedTasks.Remove(assignedTask);
            context.SaveChanges();
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
    }
}
