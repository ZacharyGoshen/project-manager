using System;
namespace ProjectManager.Models
{
    public class UserProject
    {
        public int UserProjectId { get; set; }

        public User User { get; set; }
        public Project Project { get; set; }
    }
}
