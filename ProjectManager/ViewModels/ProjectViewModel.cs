using System;
using System.Collections.Generic;
using ProjectManager.Models;

namespace ProjectManager.ViewModels
{
    public class ProjectViewModel
    {
        public User LoggedInUser { get; set; }
        public Project CurrentProject { get; set; }
        public List<Project> Projects { get; set; }
        public List<List<Task>> Tasks { get; set; }
        public List<Category> Categories { get; set; }
        public List<User> Users { get; set; }
        public List<Tag> Tags { get; set; }
    }
}
