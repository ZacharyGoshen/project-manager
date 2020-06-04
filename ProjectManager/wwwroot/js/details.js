/** Set up the event listeners of the task details view
 */
function setUpTaskDetailsEventListeners() {
    updateTaskDetailsNameOnEnter();
}

/** Update the name of the task in the database, details view, and current view
 * when the enter key is pressed in the task name input
 */
function updateTaskDetailsNameOnEnter() {
    $("#taskDetailsName").keypress(function (event) {
        if (event.keyCode === 13) {
            event.preventDefault();

            let taskId = $("#taskDetailsContainer").data("taskId");
            let taskName = $(this).val();
            changeNameOfTaskInDatabase(taskId, taskName);

            $(this).blur();
            if (currentView == "board") {
                updateBoardTaskNameHtml(taskId, taskName);
            }
        }
    });
}

/** Open the task details view and update it with the given task's data
 * 
 * @param {number} taskId The ID of the task being viewed
 */
function openTaskDetails(taskId) {
    $.ajax({
        type: "POST",
        url: "/Home/GetTask",
        data: { taskId: taskId },
        success: function (task) {
            updateTaskDetailsHtml(task);
        }
    });

    let windowHeight = window.innerHeight;
    let windowWidth = window.innerWidth;
    let detailsHeight = windowHeight * 0.8;
    let detailsWidth = windowWidth * 0.5;
    let detailsTopOffset = (windowHeight / 2) - (detailsHeight / 2);
    let detailsLeftOffset = (windowWidth / 2) - (detailsWidth / 2);

    $("#taskDetailsScreen").removeClass("hidden");
    $("#taskDetailsScreen").innerHeight(windowHeight);
    $("#taskDetailsScreen").innerWidth(windowWidth);
    $("#taskDetailsScreen").offset({ top: 0, left: 0 });

    $("#taskDetailsContainer").removeClass("hidden");
    $("#taskDetailsContainer").innerHeight(detailsHeight);
    $("#taskDetailsContainer").innerWidth(detailsWidth);
    $("#taskDetailsContainer").offset({ top: detailsTopOffset, left: detailsLeftOffset });
}

/** Closes the task details view */
function closeTaskDetails() {
    $("#taskDetailsScreen").addClass("hidden");
    $("#taskDetailsContainer").addClass("hidden");
}

/** Update the task details view with the given task's data
 * 
 * @param {object} task The task being viewed
 */
function updateTaskDetailsHtml(task) {
    $("#taskDetailsContainer").data("taskId", task.taskId);

    $("#taskDetailsName").val(task.name);

    if (task.assignedUser) {
        $("#taskDetailsAssignee").html(`
            <div class="default-profile-pic">
                ` + task.assignedUser.firstName[0] + task.assignedUser.lastName[0] + `
                </div>
            <div>` + task.assignedUser.firstName + ` ` + task.assignedUser.lastName + `</div>
        `);
    } else {
        $("#taskDetailsAssignee").html(`
            <div id="taskDetailsAssignUserButton">
                <input class="pick-user-icon" type="image" src="../images/user.png" />
            </div>
            <div>None</div>
        `);
    }

    $("#taskDetailsCreator").html(`
        <div class="default-profile-pic">
            ` + task.submittingUser.firstName[0] + task.submittingUser.lastName[0] + `
        </div>
        <div>` + task.submittingUser.firstName + ` ` + task.submittingUser.lastName + `</div>
    `);

    let taskDueDate = new Date(task.dueDateRangeStart + "Z");
    taskDueDate.setDate(taskDueDate.getDate() + 1);
    if (taskDueDate.getTime() == new Date("0001-01-01T00:00:00Z").getTime()) {
        $("#taskDetailsDueDate").html("<div>None</div>");
    } else {
        $("#taskDetailsDueDate").html(`
            <div class="board-task-due-date">` + taskDueDate.toDateString().slice(4, 10) + `</div>
        `);
    }
}

/** Toggle the assignee selection container of a task's details view between
 * open and closed */
function toggleDetailsAssigneeSelectionContainer() {
    let button = $("#taskDetailsAssignee");
    let xOffset = button.offset().left;
    let yOffset = button.offset().top + button.outerHeight();
    toggleAssigneeSelectionContainer(xOffset, yOffset);

    let taskId = $("#taskDetailsContainer").data("taskId");
    setUpAssigneeSearchResultClickEvent(taskId);
}

/** Toggle the assignee selection container of a task's details view between
 * open and closed */
function toggleDetailsDueDateSelectionContainer() {
    let button = $("#taskDetailsDueDate");
    let xOffset = button.offset().left;
    let yOffset = button.offset().top + button.outerHeight();
    toggleDueDateSelectionContainer(xOffset, yOffset);

    let taskId = $("#taskDetailsContainer").data("taskId");
    $("#dueDateSelectionContainer").data("taskId", taskId);
    setUpCalendarDateClickEvent(taskId);
}