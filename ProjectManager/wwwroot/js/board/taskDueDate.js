/** Set the location of the due date selection container to right below the
 * button clicked and then toggle it between open and closed
 * 
 * @param {number} taskId The ID of the task whose due date is being selected
 */
function toggleBoardDueDateSelectionContainer(taskId) {
    let task = findBoardTaskWithId(taskId);
    let button = task.find(".board-task-third-row").children().eq(1);
    let buttonCoordinates = button.offset();
    let buttonHeight = button.height();
    let containerXOffset = buttonCoordinates.left;
    let containerYOffset = buttonCoordinates.top + buttonHeight;
    toggleDueDateSelectionContainer(containerXOffset, containerYOffset);

    $("#dueDateSelectionContainer").data("taskId", taskId);
    setUpCalendarClickEvents(boardCalendarDateOnClick);
}

/** Update the database and board view when a calendar date is clicked in the
 * board view
 * 
 * @param {object} calendarDate The calendar date
 */
function boardCalendarDateOnClick(calendarDate) {
    let day = calendarDate.data("day");
    let month = calendarDate.data("month");
    let year = calendarDate.data("year");
    let taskId = $("#dueDateSelectionContainer").data("taskId");

    setDueDateInDatabase(taskId, day, month + 1, year);

    let dueDate = new Date(year, month, day);
    updateBoardTaskDueDateHtml(taskId, dueDate);
};

/** Update the html of the board task to show the updated due date
 * 
 * @param {number} taskId The ID of the task who's due date is being updated
 * @param {object} dueDate The due date of the task
 */
function updateBoardTaskDueDateHtml(taskId, dueDate) {
    let task = findBoardTaskWithId(taskId);

    if (dueDate.getTime() == new Date("0001-01-01T00:00:00Z").getTime()) {
        task.find(".board-task-due-date").html(`
            <input class="unassigned-due-date-icon" type="image" src="../images/clock.png" />
        `);
    } else {
        task.find(".board-task-due-date").html(`
            <div>` + dueDate.toLocaleDateString(undefined, { month: "short", day: "numeric" }) + `</div>
        `);
    }
}