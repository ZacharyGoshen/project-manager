/** Set up the event listeners of the task details view
 */
function setUpTaskDetailsEventListeners() {
    hideElementOnClickOutside($("#prioritySelectionContainer"),
        ["#prioritySelectionContainer", "#taskDetailsPriority"]);

    updateTaskDetailsNameOnEnter();
    setUpTaskDetailsNameOnFocus();
    
    updateTaskDetailsDescriptionOnEnter();
    setUpTaskDetailsDescriptionOnFocus();

    addCommentToTaskOnEnter();
    setUpTaskDetailsCommentOnFocus();
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

/** Adds a comment to the task in the database and displays it in the details
 * view when the enter key is pressed in the comment input
 */
function addCommentToTaskOnEnter() {
    $("#taskDetailsCommentInput").keypress(function (event) {
        if (event.keyCode === 13) {
            event.preventDefault();

            let text = $(this).val();
            let taskId = $("#taskDetailsContainer").data("taskId");
            let userId = $("#loggedInUser").data("userId");
            if (text != "") {
                addCommentToDatabase(text, taskId, userId);
            }

            $(this).val("");
            $(this).blur();

            let userName = $("#loggedInUser").data("userName");
            let firstName = userName.split(" ")[0];
            let lastName = userName.split(" ")[1];
            addCommentHtmlToTaskDetails(text, firstName, lastName);
            scrollToBottomOfContainer($("#taskDetailsContainer"));
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

/** Show the placeholder text if none is supplied when the task comment text box
 * loses focus
 */
function setUpTaskDetailsCommentOnFocus() {
    $("#taskDetailsCommentInput").focus(function () {
        if ($(this).val() == "Add a comment to this task") {
            $(this).val("");
            $(this).css("color", "black");
        }
    });
    $("#taskDetailsCommentInput").focusout(function () {
        if ($(this).val() == "") {
            $(this).val("Add a comment to this task");
            $(this).css("color", "#9e9e9e");
        }
    });
}

/** Removes the assigned user from the task in the database, the details view
 * and the current view
 */
function removeTaskAssignee() {
    let taskId = $("#taskDetailsContainer").data("taskId");
    let userId = $("#taskDetailsAssignee").data("userId");
    removeAssignedTaskFromUserInDatabase(taskId, userId);

    updateTaskDetailsAssigneeHtml(null, null);
    if (currentView == "board") {
        updateBoardTaskAssigneeHtml(taskId, null, null);
    }
}

/** Removes the due date from the task in the database, the details view
 * and the current view
 */
function removeTaskDueDate() {
    let taskId = $("#taskDetailsContainer").data("taskId");
    setDueDateInDatabase(taskId, -1, -1, -1);

    let minimumDateTime = new Date("0001-01-01T00:00:00Z");
    updateTaskDetailsDueDateHtml(minimumDateTime);
    if (currentView == "board") {
        updateBoardTaskDueDateHtml(taskId, minimumDateTime);
    }
}

/** Removes the priority from the task in the database, the details view
 * and the current view
 */
function removeTaskPriority() {
    let taskId = $("#taskDetailsContainer").data("taskId");
    setPriorityInDatabase(taskId, 0);

    updateTaskDetailsPriorityHtml(0);
    if (currentView == "board") {
        updateBoardTaskPriorityHtml(taskId, 0);
    }
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

    let detailsScreen = $("#taskDetailsScreen");
    let detailsBody = $("#taskDetailsContainer");
    let header = $("#taskDetailsHeader");
    let footer = $("#taskDetailsFooter");

    detailsScreen.removeClass("hidden");
    detailsBody.removeClass("hidden");
    header.removeClass("hidden");
    footer.removeClass("hidden");

    detailsScreen.innerHeight(window.innerHeight);
    detailsScreen.innerWidth(window.innerWidth);
    detailsScreen.offset({ top: 0, left: 0 });

    let windowHeightPercentage = 0.9;
    let containerHeight = windowHeightPercentage * window.innerHeight;
    let containerWidth = window.innerWidth * 0.5;
    let containerTopOffset = (window.innerHeight / 2) - (containerHeight / 2);
    let containerLeftOffset = (window.innerWidth / 2) - (containerWidth / 2);

    header.offset({ top: containerTopOffset, left: containerLeftOffset });
    header.outerWidth(containerWidth);

    detailsBody.outerHeight(containerHeight - header.outerHeight() - footer.outerHeight());
    detailsBody.outerWidth(containerWidth);
    detailsBody.offset({
        top: header.offset().top + header.outerHeight(),
        left: containerLeftOffset
    });

    footer.offset({
        top: detailsBody.offset().top + detailsBody.outerHeight(),
        left: containerLeftOffset
    });
    footer.outerWidth(containerWidth);
}

/** Closes the task details view */
function closeTaskDetails() {
    $("#taskDetailsScreen").addClass("hidden");
    $("#taskDetailsContainer").addClass("hidden");
    $("#taskDetailsHeader").addClass("hidden");
    $("#taskDetailsFooter").addClass("hidden");
}

/** Update the task details view with the given task's data
 * 
 * @param {object} task The task being viewed
 */
function updateTaskDetailsHtml(task) {
    $("#taskDetailsContainer").data("taskId", task.taskId);

    updateTaskDetailsCompletedButtonHtml(task.isCompleted);

    $("#taskDetailsName").val(task.name);
    updateTaskDetailsDescriptionHtml(task.description);

    if (task.assignedUser) {
        $("#taskDetailsAssignee").data("userId", task.assignedUser.userId);
        updateTaskDetailsAssigneeHtml(task.assignedUser.firstName, task.assignedUser.lastName);
    } else {
        updateTaskDetailsAssigneeHtml(null, null);
    }

    let dueDate = new Date(task.dueDateRangeStart + "Z");
    updateTaskDetailsDueDateHtml(dueDate);

    updateTaskDetailsPriorityHtml(task.priority);

    let creationDate = convertUTCStringToUTCDate(task.creationTime);
    let creationDateDay = creationDate.toLocaleDateString(undefined, { month: "short", day: "numeric" });
    let creationDateTime = creationDate.toLocaleTimeString([], { hour12: true, hour: "numeric", minute: "numeric" });
    let commentContainerHtml = `
        <div id="#taskDetailsCreator">
            <div class="default-profile-pic">
                ` + task.submittingUser.firstName[0] + task.submittingUser.lastName[0] + `
            </div>
            <div>` + task.submittingUser.firstName + ` ` + task.submittingUser.lastName + ` created this task.</div>
            <div class="task-details-time">` + creationDateDay + " at " + creationDateTime + `</div>
        </div>
    `;

    for (comment of task.comments) {
        let commentCreationDate = convertUTCStringToUTCDate(comment.creationTime);
        let commentCreationDateDay = commentCreationDate.toLocaleDateString(undefined, { month: "short", day: "numeric" });
        let commentCreationDateTime = commentCreationDate.toLocaleTimeString([], { hour12: true, hour: "numeric", minute: "numeric" });

        commentContainerHtml += `
            <div class="taskDetailsComment">
                <div class="default-profile-pic">
                    ` + comment.user.firstName[0] + comment.user.lastName[0] + `
                </div>
                <div>` + comment.text + `</div>
                <div class="task-details-time">` + commentCreationDateDay + " at " + commentCreationDateTime + `</div>
            </div>
        `;
    }
    $("#taskDetailsThirdSection").html(commentContainerHtml);
}

function updateTaskDetailsCompletedButtonHtml(isCompleted) {
    let button = $("#taskDetailsCompletedButton");
    if (isCompleted) {
        button.removeClass("task-details-completed-button-off");
        button.addClass("task-details-completed-button-on");
        button.data("isCompleted", true);
        button.html("&#10003 Completed");
    } else {
        button.removeClass("task-details-completed-button-on");
        button.addClass("task-details-completed-button-off");
        button.data("isCompleted", false);
        button.html("&#10003 Mark Completed");
    }
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
            <input class="unassigned-user-icon" type="image" src="../images/user.png" />
            <div>None</div>
        `);
    } else {
        $("#taskDetailsAssignee").html(`
            <div class="default-profile-pic">
                ` + firstName[0] + lastName[0] + `
            </div>
            <div>` + firstName + ` ` + lastName + `</div>
            <div class="task-details-remove-button" onclick="removeTaskAssignee()">
                <div>x</div>
            </div>
        `);
    }
}

/** Update the task details view's due date html
 * 
 * @param {object} dueDate A Date object containing task's due date
 */
function updateTaskDetailsDueDateHtml(dueDate) {
    if (dueDate.getTime() == new Date("0001-01-01T00:00:00Z").getTime()) {
        $("#taskDetailsDueDate").html(`
            <input class="unassigned-due-date-icon" type="image" src="../images/clock.png" />
            <div>None</div>
        `);
    } else {
        $("#taskDetailsDueDate").html(`
            <input class="unassigned-due-date-icon" type="image" src="../images/clock.png" />
            <div>` + dueDate.toLocaleDateString(undefined, { month: "long", day: "numeric" }) + `</div>
            <div class="task-details-remove-button" onclick="removeTaskDueDate()">
                <div>x</div>
            </div>
        `);
    }
}

/** Update the task details view's priority html
 * 
 * @param {number} priority An integer between 0-5 representing the task's priority
 */
function updateTaskDetailsPriorityHtml(priority) {
    if (priority == 0) {
        $("#taskDetailsPriority").html(`
            <div class="task-priority task-priority-none">None</div>
        `);
    } else {
        let priorityClassName = getPriorityCssClassName(priority);
        let priorityString = getPriorityString(priority);
        $("#taskDetailsPriority").html(`
            <div class="task-priority ` + priorityClassName + `">` + priorityString + `</div>
            <div class="task-details-remove-button" onclick="removeTaskPriority()">
                <div>x</div>
            </div>
        `);
    }
}

/** Update the task details view's comment html
 * 
 * @param {any} text
 * @param {any} firstName
 * @param {any} lastName
 */
function addCommentHtmlToTaskDetails(text, firstName, lastName) {
    let commentCreationDate = new Date();
    let commentCreationDateDay = commentCreationDate.toString().slice(4, 10);
    let commentCreationDateTime = commentCreationDate.toString().slice(16, 21);

    $("#taskDetailsThirdSection").append(`
        <div class="taskDetailsComment">
            <div class="default-profile-pic">
                ` + firstName[0] + lastName[0] + `
            </div>
            <div>` + text + `</div>
            <div class="task-details-time">` + commentCreationDateDay + " at " + commentCreationDateTime + `</div>
        </div>
    `);
}

/** Toggle the task between completed and not completed and update the database,
 * details view, and current view
 */
function taskDetailsToggleCompleted() {
    let button = $("#taskDetailsCompletedButton");
    let isCompleted = button.data("isCompleted");
    updateTaskDetailsCompletedButtonHtml(!isCompleted);

    let taskId = $("#taskDetailsContainer").data("taskId");
    setTaskIsCompletedInDatabase(taskId, !isCompleted);

    if (currentView == "board") {
        updateBoardTaskCompletedHtml(taskId, !isCompleted);
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

/** Toggle the priority selection container of a task's details view between
 * open and closed */
function toggleDetailsPrioritySelectionContainer() {
    let button = $("#taskDetailsPriority");
    let xOffset = button.offset().left;
    let yOffset = button.offset().top + button.outerHeight();
    togglePrioritySelectionContainer(xOffset, yOffset);

    let taskId = $("#taskDetailsContainer").data("taskId");
    $("#prioritySelectionContainer").data("taskId", taskId);
    setUpPriorityClickEvent(taskId);
}