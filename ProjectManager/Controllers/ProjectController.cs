using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using Microsoft.AspNetCore.Mvc;
using ProjectManager.DAL;
using ProjectManager.Models;

namespace ProjectManager.Controllers
{
    public class ProjectController : Controller
    {
        public void New(int userId, string name)
        {
            var context = new MyContext();
            var user = context.Users.Find(userId);

            var project = new Project()
            {
                Name = name
            };

            var userProject = new UserProject()
            {
                User = user,
                Project = project
            };
            project.TeamMembers = new List<UserProject>() { userProject };

            context.Projects.Add(project);
            context.SaveChanges();
        }
    }
}
