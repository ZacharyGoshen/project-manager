using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using ProjectManager.DAL;
using ProjectManager.Models;

namespace ProjectManager.Controllers
{
    public class InviteController : Controller
    {
        [HttpGet]
        public JsonResult GetAllToUser(int userId)
        {
            var context = new MyContext();
            var invites = context.Invites
                .Where(i => i.Invitee.UserId == userId)
                .Include(i => i.Inviter)
                .Include(i => i.Project)
                .Select(i => new
                {
                    InviteId = i.InviteId,
                    InviteeId = i.Invitee.UserId,
                    InviterId = i.Inviter.UserId,
                    InviterFirstName = i.Inviter.FirstName,
                    InviterLastName = i.Inviter.LastName,
                    ProjectId = i.Project.ProjectId,
                    ProjectName = i.Project.Name
                })
                .ToList();
            return Json(invites);
        }

        [HttpPost]
        public JsonResult Create(int inviterId, int projectId, string email)
        {
            var context = new MyContext();

            var inviter = context.Users.Find(inviterId);
            if (inviter.Email == email)
            {
                return Json(-1);
            }

            if (context.Users.Where(u => u.Email == email).ToList().Count == 0)
            {
                return Json(-2);
            }

            if (context.Invites.Where(i => i.Inviter.UserId == inviterId && i.Invitee.Email == email).ToList().Count != 0)
            {
                return Json(-3);
            }
            if (context.UserProjects.Where(up => up.Project.ProjectId == projectId && up.User.Email == email).ToList().Count != 0)
            {
                return Json(-4);
            }
            else
            {
                var invite = new Invite()
                {
                    Invitee = context.Users.Where(u => u.Email == email).First(),
                    Inviter = context.Users.Find(inviterId),
                    Project = context.Projects.Find(projectId),
                };
                context.Invites.Add(invite);
                context.SaveChanges();

                return Json(invite.InviteId);
            }
        }

        [HttpPost]
        public void Delete(int inviteId)
        {
            var context = new MyContext();
            var invite = context.Invites.Find(inviteId);
            context.Invites.Attach(invite);
            context.Invites.Remove(invite);
            context.SaveChanges();
        }
    }
}

