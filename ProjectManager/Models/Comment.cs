using System;
namespace ProjectManager.Models
{
    public class Comment
    {
        public int CommentId { get; set; }
        public string Text { get; set; }
        public DateTime CreationTime { get; set; }

        public User User { get; set; }
        public Task Task { get; set; }
    }
}
