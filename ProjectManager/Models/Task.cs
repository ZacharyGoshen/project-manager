using System;
using System.Collections.Generic;

namespace ProjectManager.Models
{
    public class Task
    {
        public int TaskId { get; set; }
        public string Name { get; set; }
        public string Description { get; set; }
        public DateTime CreationTime { get; set; }
        public DateTime DueDate { get; set; }
        public int Order { get; set; }
        public int Priority { get; set; }
        public bool IsCompleted { get; set; }

        public Project Project { get; set; }
        public User AssignedUser { get; set; }
        public User SubmittingUser { get; set; }
        public Category Category { get; set; }
        public IList<Comment> Comments { get; set; }
        public IList<TagTask> TagTasks { get; set; }
    }
}
