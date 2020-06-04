/** Set up the event listeners of the task details view
 */
function setUpTaskDetailsEventListeners() {
    updateTaskDetailsNameOnEnter();
    updateTaskDetailsDescriptionOnEnter()

    setUpTaskDetailsNameOnFocus();
    setUpTaskDetailsDescriptionOnFocus();
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

            if (taskName != "") {
                changeNameOfTaskInDatabase(taskId, taskName);
                if (currentView == "board") {
                    updateBoardTaskNameHtml(taskId, taskName);
                }
            }

            $(this).blur();
        }
    });
}

/** Update the description of the task in the database and details view
 * when the enter key is pressed in the task description input
 */
function updateTaskDetailsDescriptionOnEnter() {
    $("#taskDetailsDescription").keypress(function (event) {
        if (event.keyCode === 13) {
            event.preventDefault();

            let taskId = $("#taskDetailsContainer").data("taskId");
            let taskDescription = $(this).val();
            setTaskDescriptionInDatabase(taskId, taskDescription);

            $(this).blur();
        }
    });
}

/** Update the task name in the database and current view when the task details
 * name text box loses focus. Don't allow a blank name
 */
function setUpTaskDetailsNameOnFocus() {
    $("#taskDetailsName").focusout(function () {
        let taskId = $("#taskDetailsContainer").data("taskId");
        let taskName = $(this).val();

        if (taskName != "") {
            changeNameOfTaskInDatabase(taskId, taskName);
            if (currentView == "board") {
                updateBoardTaskNameHtml(taskId, taskName);
            }
        }
    });
}

/** Update the task decription in the database and show the placeholder text
 * if none is supplied when the task details description text box loses focus
 */
function setUpTaskDetailsDescriptionOnFocus() {
    $("#taskDetailsDescription").focus(function () {
        if ($(this).val() == "Add a description to this task") {
            $(this).val("");
            $(this).css("color", "black");
        }
    });
    $("#taskDetailsDescription").focusout(function () {
        let taskId = $("#taskDetailsContainer").data("taskId");
        let taskDescription = null;

        if ($(this).val() == "") {
            $(this).val("Add a description to this task");
            $(this).css("color", "#9e9e9e");
        } else {
            taskDescription = $(this).val();
        }

        setTaskDescriptionInDatabase(taskId, taskDescription);
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
    updateTaskDetailsDescriptionHtml(task.description);

    if (task.assignedUser) {
        updateTaskDetailsAssigneeHtml(task.assignedUser.firstName, task.assignedUser.lastName);
    } else {
        updateTaskDetailsAssigneeHtml(null, null);
    }

    $("#taskDetailsCreator").html(`
        <div class="default-profile-pic">
            ` + task.submittingUser.firstName[0] + task.submittingUser.lastName[0] + `
        </div>
        <div>` + task.submittingUser.firstName + ` ` + task.submittingUser.lastName + `</div>
    `);

    let dueDate = new Date(task.dueDateRangeStart + "Z");
    dueDate.setDate(dueDate.getDate() + 1);
    updateTaskDetailsDueDateHtml(dueDate);
}

/** Update the task details view's description html
 * 
 * @param {string} description The description of the task
 */
function updateTaskDetailsDescriptionHtml(description) {
    if (description == null) {
        $("#taskDetailsDescription").val("Add a description to this task");
        $("#taskDetailsDescription").css("color", "#9e9e9e");
    } else {
        $("#taskDetailsDescription").val(description);
        $("#taskDetailsDescription").css("color", "black");
    }
}

/** Update the task details view's assignee html
 * 
 * @param {string} firstName The first name of the assignee
 * @param {string} lastName The last name of the assignee
 */
function updateTaskDetailsAssigneeHtml(firstName, lastName) {
    if (firstName == null && lastName == null) {
        $("#taskDetailsAssignee").html(`
            <div id="taskDetailsAssignUserButton">
                <input class="pick-user-icon" type="image" src="../images/user.png" />
            </div>
            <div>None</div>
        `);
    } else {
        $("#taskDetailsAssignee").html(`
            <div class="default-profile-pic">
                ` + firstName[0] + lastName[0] + `
                </div>
            <div>` + firstName + ` ` + lastName + `</div>
        `);
    }
}

/** Update the task details view's due date html
 * 
 * @param {object} dueDate A Date object containing task's due date
 */
function updateTaskDetailsDueDateHtml(dueDate) {
    if (dueDate.getTime() == new Date("0001-01-01T00:00:00Z").getTime()) {
        $("#taskDetailsDueDate").html("<div>None</div>");
    } else {
        $("#taskDetailsDueDate").html(`
            <div class="board-task-due-date">` + dueDate.toDateString().slice(4, 10) + `</div>
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