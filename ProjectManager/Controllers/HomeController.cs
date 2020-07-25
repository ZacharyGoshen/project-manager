using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using Microsoft.AspNetCore.Mvc;
using ProjectManager.DAL;

namespace ProjectManager.Controllers
{
    public class HomeController : BaseController
    {
        [HttpGet]
        public IActionResult Login()
        {
            return View();
        }

        [HttpGet]
        public IActionResult Board()
        {
            var context = new MyContext();
            context.Database.EnsureCreated();

            if (this.UserId == 0 && this.Demo == 0)
            {
                return RedirectToAction("Login");
            }
            else
            {
                return View();
            }
        }

        [HttpGet]
        public JsonResult getDemo()
        {
            return Json(this.Demo);
        }

        [HttpPost]
        public void SetDemo()
        {
            this.Demo = 1;
        }
    }
}
