/** Toggles the priority selection container between open and closed
 *
 * @param {number} xOffset The x offset of the container
 * @param {number} yOffset The y offset of the container
 */
function togglePrioritySelectionContainer(xOffset, yOffset) {
    let container = $("#prioritySelectionContainer");
    if (container.hasClass("hidden")) {
        container.removeClass("hidden");
        container.offset({ top: yOffset, left: xOffset });
    } else {
        container.addClass("hidden");
    }
}

/** Sets up the click events that sets a task's priority when a priority option
 * is clicked
 *
 * @param {number} taskId
 */
function setUpPriorityClickEvent(taskId) {
    $(".priority-selection-option").each(function () {
        $(this).off("click");
        let priority = $(this).data("priority");
        $(this).click(function () {
            setPriorityInDatabase(taskId, priority);
            togglePrioritySelectionContainer(0, 0);

            if (!$("#taskDetailsContainer").hasClass("hidden")) {
                updateTaskDetailsPriorityHtml(priority);
            }

            if (currentView == "board") {
                updateBoardTaskPriorityHtml(taskId, priority);
            }
        });
    });
}

/** Get the css class corresponding to the given task priority
 * 
 * @param {number} priority The priority of a task
 * @returns {string} The name of a css class corresponding the the given task priority
 */
function getPriorityCssClassName(priority) {
    switch (priority) {
        case 1:
            return "task-priority-very-low";
        case 2:
            return "task-priority-low";
        case 3:
            return "task-priority-medium";
        case 4:
            return "task-priority-high";
        case 5:
            return "task-priority-very-high";
        default:
            return "";
    }
}

/** Get the name that the given priority represents
 *
 * @param {number} priority The priority of a task
 * @returns {string} The name that the given priority represents
 */
function getPriorityString(priority) {
    switch (priority) {
        case 1:
            return "Very Low";
        case 2:
            return "Low";
        case 3:
            return "Medium";
        case 4:
            return "High";
        case 5:
            return "Very High";
        default:
            return "";
    }
}