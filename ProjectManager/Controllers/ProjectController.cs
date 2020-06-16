using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using Microsoft.AspNetCore.Mvc;
using ProjectManager.DAL;
using ProjectManager.Models;

namespace ProjectManager.Controllers
{
    public class ProjectController : BaseController
    {
        public JsonResult New(string name, string description, int day, int month, int year, int ownerId, int[] teamMemberIds)
        {
            var context = new MyContext();

            var project = new Project()
            {
                Name = name,
                Description = description,
                Owner = context.Users.Find(ownerId)
            };

            if ((day == -1) && (month == -1) && (year == -1))
            {
                project.DueDate = new DateTime();
            }

            var teamMemberUserProjects = new List<UserProject>();
            foreach (var teamMemberId in teamMemberIds)
            {
                var teamMember = context.Users.Find(teamMemberId);
                var teamMemberUserProject = new UserProject()
                {
                    User = teamMember,
                    Project = project
                };
                teamMemberUserProjects.Add(teamMemberUserProject);
                //context.UserProjects.Add(teamMemberUserProject);
            }
            project.TeamMembers = teamMemberUserProjects;

            context.Projects.Add(project);
            context.SaveChanges();

            return Json(project.ProjectId);
        }

        public void SetCurrentProject(int projectId)
        {
            this.CurrentProjectId = projectId;
        }
    }
}
