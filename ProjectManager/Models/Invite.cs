using System;
namespace ProjectManager.Models
{
    public class Invite
    {
        public int InviteId { get; set; }

        public User Invitee { get; set; }
        public User Inviter { get; set; }
        public Project Project { get; set; }
    }
}
