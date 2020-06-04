using System;
using System.Collections.Generic;

namespace ProjectManager.Models
{
    public class Project
    {
        public int ProjectId { get; set; }
        public string Name { get; set; }

        public IList<Category> Categories { get; set; }
        public IList<Task> Tasks { get; set; }
        public IList<UserProject> UserProjects { get; set; }
    }
}
