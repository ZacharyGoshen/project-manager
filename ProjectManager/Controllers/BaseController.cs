﻿using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using Microsoft.AspNetCore.Mvc;
using Microsoft.AspNetCore.Http;

namespace ProjectManager.Controllers
{
    public class BaseController : Controller
    {
        protected int UserId
        {
            get { return HttpContext.Session.GetInt32("UserId") ?? 0; }
            set { HttpContext.Session.SetInt32("UserId", value); }
        }

        protected int Demo
        {
            get { return HttpContext.Session.GetInt32("Demo") ?? 0; }
            set { HttpContext.Session.SetInt32("Demo", value); }
        }
    }
}
