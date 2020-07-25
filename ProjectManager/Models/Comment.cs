using System;
namespace ProjectManager.Models
{
    public class Comment
    {
        public int CommentId { get; set; }

        public string CreationTime { get; set; }
        public Task Task { get; set; }
        public string Text { get; set; }
        public User User { get; set; }
    }
}
