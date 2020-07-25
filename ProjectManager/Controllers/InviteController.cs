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
    public class InviteController : BaseController
    {
        [HttpGet]
        public JsonResult GetAllWithUser(int userId)
        {
            var context = new MyContext();
            var invites = context.Invites
                .Where(i => i.Invitee.UserId == userId || i.Inviter.UserId == userId)
                .Include(i => i.Inviter)
                .Include(i => i.Project)
                .Select(i => new
                {
                    id = i.InviteId,
                    inviteeId = i.Invitee.UserId,
                    inviterId = i.Inviter.UserId,
                    inviterFirstName = i.Inviter.FirstName,
                    inviterLastName = i.Inviter.LastName,
                    projectId = i.Project.ProjectId,
                    projectName = i.Project.Name
                })
                .ToList();
            return Json(invites);
        }

        public struct ProjectJson
        {
            public int InviteeId { get; set; }
            public string InviterFirstName { get; set; }
            public int InviterId { get; set; }
            public string InviterLastName { get; set; }
            public int ProjectId { get; set; }
            public string ProjectName { get; set; }
        }

        [HttpPost]
        [Route("invite")]
        public JsonResult Create([FromBody] [Bind("InviteeId", "InviterFirstName", "InviterId", "InviterLastName", "ProjectId", "ProjectName")] ProjectJson inviteJson)
        {
            var context = new MyContext();
            var invite = new Invite()
            {
                Invitee = context.Users.Find(inviteJson.InviteeId),
                Inviter = context.Users.Find(inviteJson.InviterId),
                Project = context.Projects.Find(inviteJson.ProjectId)
            };
            context.Invites.Add(invite);
            context.SaveChanges();

            return Json(invite.InviteId);
        }

        [HttpDelete]
        [Route("invite/{id}")]
        public JsonResult Delete(int id)
        {
            var context = new MyContext();
            var invite = context.Invites.Find(id);
            context.Invites.Attach(invite);
            context.Invites.Remove(invite);
            context.SaveChanges();

            return Json(true);
        }
    }
}

