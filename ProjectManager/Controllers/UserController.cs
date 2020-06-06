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

        [HttpGet]
        public IActionResult New()
        {
            return View();
        }

        [HttpPost]
        public IActionResult New(User user)
        {         
            byte[] salt = GenerateSalt();
            string hashed = HashPassword(user.Password, salt);

            user.Salt = salt;
            user.Password = hashed;          

            var context = new DAL.MyContext();
            context.Users.Add(user);
            context.SaveChanges();

            return RedirectToAction("Index");
        }

        public void RemoveAssignedTask(int taskId, int userId)
        {
            var context = new DAL.MyContext();
            var assignedUser = context.Users.Find(userId);
            var assignedTask = context.Tasks.Find(taskId);

            assignedUser.AssignedTasks.Remove(assignedTask);
            context.SaveChanges();
        }

        [HttpGet]
        public IActionResult Login()
        {
            return View();
        }

        [HttpPost]
        public IActionResult Login(User user)
        {
            using (var context = new DAL.MyContext())
            {
                User entity = context.Users.Single(e => e.Email == user.Email);
                if (entity != null)
                {
                    string encrypted = HashPassword(user.Password, entity.Salt);
                    if (encrypted == entity.Password)
                    {
                        this.UserId = entity.UserId;
                        Console.WriteLine(HttpContext.Session.GetInt32("UserId") + "\n");
                        Console.WriteLine("User successfully logged in!\n");
                    }
                    else
                    {
                        Console.WriteLine("Incorrect email or password\n");
                    }
                }
                else
                {
                    Console.Write("User not found\n");
                }
            }
            return RedirectToAction("Index", "Home");
        }

        [HttpGet]
        public IActionResult LogOut()
        {
            this.UserId = 0;
            return RedirectToAction("Index", "Home");
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
