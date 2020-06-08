using System;
using System.Collections.Generic;
using ProjectManager.Models;

namespace ProjectManager.ViewModels
{
    public class BoardViewModel
    {
        public string NewCategoryName { get; set; }

        public string NewTaskName { get; set; }
        public int NewTaskCategoryId { get; set; }

        public int CategoryToDeleteId { get; set; }

        public int AssignedTaskId { get; set; }
        public int AssignedUserId { get; set; }

        public int TaskToDeleteId { get; set; }

        public int DueDateTaskId { get; set; }
        public int DueDateStartMonth { get; set; }
        public int DueDateStartDay { get; set; }
        public int DueDateStartYear { get; set; }
        public int DueDateEndMonth { get; set; }
        public int DueDateEndDay { get; set; }
        public int DueDateEndYear { get; set; }

        public int CategoryToMoveId { get; set; }
        public int ColumnBeforeMove { get; set; }
        public int ColumnAfterMove { get; set; }

        public int CategoryIdBeforeMove { get; set; }
        public int CategoryIdAfterMove { get; set; }
        public int RowBeforeMove { get; set; }
        public int RowAfterMove { get; set; }

        public List<List<Task>> Tasks { get; set; }
        public List<Category> Categories { get; set; }
        public List<User> Users { get; set; }
        public List<Tag> Tags { get; set; }
    }
}
