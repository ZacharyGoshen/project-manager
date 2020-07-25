using System;
using System.Collections.Generic;

namespace ProjectManager.Models
{
    public class Task
    {
        public int TaskId { get; set; }

        public User AssignedUser { get; set; }
        public Category Category { get; set; }
        public IList<Comment> Comments { get; set; }
        public string CreationTime { get; set; }
        public string Description { get; set; }
        public string DueDate { get; set; }
        public bool IsCompleted { get; set; }
        public string Name { get; set; }
        public int Order { get; set; }
        public int Priority { get; set; }
        public Project Project { get; set; }
        public User SubmittingUser { get; set; }
        public IList<TagTask> TagTasks { get; set; }
    }
}
