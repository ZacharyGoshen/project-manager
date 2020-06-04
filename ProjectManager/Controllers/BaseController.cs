using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using Microsoft.AspNetCore.Mvc;
using Microsoft.AspNetCore.Http;

// For more information on enabling MVC for empty projects, visit https://go.microsoft.com/fwlink/?LinkID=397860

namespace ProjectManager.Controllers
{
    public class BaseController : Controller
    {
        protected int UserId
        {
            get { return HttpContext.Session.GetInt32("UserId") ?? 0; }
            set { HttpContext.Session.SetInt32("UserId", value); }
        }

    }
}
