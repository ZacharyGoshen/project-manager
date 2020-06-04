using System;
using System.Collections.Generic;
using ProjectManager.Models;

namespace ProjectManager.ViewModels
{
    public class TaskDetailsViewModel
    {
        public Task Task;

        public string priorityToStr(TaskPriority priority)
        {
            switch (priority)
            {
                case TaskPriority.VeryLow:
                    return "Very Low";
                case TaskPriority.Low:
                    return "Low";
                case TaskPriority.Medium:
                    return "Medium";
                case TaskPriority.High:
                    return "High";
                case TaskPriority.VeryHigh:
                    return "Very High";
            }
            return "";
        }

        public string priorityToClass(TaskPriority priority)
        {
            switch (priority)
            {
                case TaskPriority.VeryLow:
                    return "veryLowPriority";
                case TaskPriority.Low:
                    return "lowPriority";
                case TaskPriority.Medium:
                    return "mediumPriority";
                case TaskPriority.High:
                    return "highPriority";
                case TaskPriority.VeryHigh:
                    return "veryHighPriority";
            }
            return "";
        }
    }
}
