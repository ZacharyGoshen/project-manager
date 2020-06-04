using System;
using System.Collections.Generic;

namespace ProjectManager.Models
{
    public class Category
    {
        public int CategoryId { get; set; }
        public String Name { get; set; }
        public int Order { get; set; }

        public Project Project { get; set; }
        public IList<Task> Tasks { get; set; }
    }
}
