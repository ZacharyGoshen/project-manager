using System;
namespace ProjectManager.Models
{
    public class TagTask
    {
        public int TagTaskId { get; set; }

        public Tag Tag { get; set; }
        public Task Task { get; set; }
    }
}
