using System;
using System.Collections.Generic;

namespace ProjectManager.Models
{
    public class User
    {
        public int UserId { get; set; }
        public string FirstName { get; set; }
        public string LastName { get; set; }
        public string Email { get; set; }
        public string Password { get; set; }
        public byte[] Salt { get; set; }
        public int BackgroundColor { get; set; }
        public int CurrentProjectId { get; set; }

        public IList<Task> AssignedTasks { get; set; }
        public IList<Task> SubmittedTasks { get; set; }
        public IList<Comment> Comments { get; set; }
        public IList<UserProject> UserProjects { get; set; }
    }
}
