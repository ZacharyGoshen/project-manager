using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using ProjectManager.Models;
using Microsoft.AspNetCore.Mvc;
using System.Security.Cryptography;
using Microsoft.AspNetCore.Cryptography.KeyDerivation;
using Microsoft.AspNetCore.Http;

namespace ProjectManager.Controllers
{
    public class UserController : BaseController
    {
        public IActionResult Index()
        {
            using (var context = new DAL.MyContext())
            {
                context.Database.EnsureCreated();
                var users = context.Users.ToList();

                return View(users);
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
        }

        public void RemoveAssignedTask(int taskId, int userId)
        {
            var context = new DAL.MyContext();
            var assignedUser = context.Users.Find(userId);
            var assignedTask = context.Tasks.Find(taskId);

            assignedUser.AssignedTasks.Remove(assignedTask);
            context.SaveChanges();
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
