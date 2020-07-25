using System;
using System.Collections.Generic;

namespace ProjectManager.Models
{
    public class Tag
    {
        public int TagId { get; set; }

        public int BackgroundColor { get; set; }
        public string Name { get; set; }
        public Project Project { get; set; }
        public IList<TagTask> TagTasks { get; set; }
    }
}
