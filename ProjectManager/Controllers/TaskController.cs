using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using Microsoft.AspNetCore.Mvc;
using ProjectManager.DAL;

namespace ProjectManager.Controllers
{
    public class TaskController : Controller
    {
        public void SetPriority(int taskId, int priority)
        {
            var context = new MyContext();
            var task = context.Tasks.Find(taskId);
            task.Priority = priority;
            context.SaveChanges();
        }
    }
}
