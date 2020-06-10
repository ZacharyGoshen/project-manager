using System;
using System.Collections.Generic;

namespace ProjectManager.Models
{
    public class Tag
    {
        public int TagId { get; set; }
        public String Name { get; set; }
        public int ColorIndex { get; set; }

        public Project Project { get; set; }
        public IList<TagTask> TagTasks { get; set; }
    }
}
