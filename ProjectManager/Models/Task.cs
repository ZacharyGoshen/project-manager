using System;
using System.Collections.Generic;

namespace ProjectManager.Models
{
    public enum TaskPriority
    {
        None = 0,
        VeryLow = 1,
        Low = 2,
        Medium = 3,
        High = 4,
        VeryHigh = 5
    }

    public class Task
    {
        public int TaskId { get; set; }
        public string Name { get; set; }
        public string Description { get; set; }
        public DateTime CreationDate { get; set; }
        public DateTime DueDateRangeStart { get; set; }
        public DateTime DueDateRangeEnd { get; set; }
        public int Order { get; set; }

        public Project Project { get; set; }
        public User AssignedUser { get; set; }
        public User SubmittingUser { get; set; }
        public TaskPriority Priority { get; set; }
        public Category Category { get; set; }
    }
}
