let mouseMoveEvent = null;
let taskBeingDragged = false;
let categoryBeingDragged = false;
let verticalScrollIntervalId = 0;
let horizontalScrollIntervalId = 0;

onBoardViewLoad();

/** Set up the event listeners of the board view after the page has finished
 * loading
 */
function onBoardViewLoad() {
    $(document).ready(function () {
        currentView = "board";

        createNewProjectOnEnter();

        setUpTaskDetailsEventListeners();

        setBoardContainerTopMargin();
        setBoardTaskContainerHeights();

        $(document).mousemove(function (event) {
            mouseMoveEvent = event;
        });

        $(document).mouseup(function () {
            $(document).off("mousemove.moveCategory");
            $(document).off("mousemove.moveTask");
            endBoardCategoryDrag();
            endBoardTaskDrag();
        });

        $(".board-category").each(function () {
            let category = $(this);
            setUpBoardCategoryEventListeners(category);
        });

        $(".board-task").each(function () {
            let task = $(this);
            setUpBoardTaskEventListeners(task);

            let taskId = task.data("taskId");
            let priority = task.find(".board-task-priority").data("priority");
            updateBoardTaskPriorityHtml(taskId, priority);
        });

        showElementOnClickOutside($("#addBoardCategoryButton"), ["#addBoardCategoryButton", "#newCategoryNameTextBox"]);
        hideElementOnClickOutside($("#newCategoryNameTextBox"), ["#newCategoryNameTextBox", "#addBoardCategoryButton"]);
        addNewBoardCategoryOnEnter();

        hideElementOnClickOutside($("#removeBoardCategoryAlert"), ["#removeBoardCategoryAlert", ".board-category-delete-button"])

        $(".new-board-task-container").each(function () {
            hideElementOnClickOutside($(this), [$(this), $(this).parent().find(".add-task-to-board-button")]);
        });

        hideElementOnClickOutside($("#assigneeSelectionContainer"),
            ["#assigneeSelectionContainer", "#taskDetailsAssignee", ".board-task-assignee"]);
        removeFocusOnClickOutside($("#assigneeSearchBox"), [$("#assigneeSearchBox")]);
        showElementOnFocus($("#assigneeSearchResultsContainer"), $("#assigneeSearchBox"));
        hideElementOnClickOutside($("#assigneeSearchResultsContainer"), ["#assigneeSearchBox"]);
        reloadAssigneeSearchResultsOnInput();

        hideElementOnClickOutside($("#dueDateSelectionContainer"),
            ["#dueDateSelectionContainer", "#taskDetailsDueDate", ".board-task-due-date"]);

        hideElementOnClickOutside($("#tagSelectionContainer"),
            ["#tagSelectionContainer", "#taskDetailsAddTagButton", "#createTagButton"]);
        removeFocusOnClickOutside($("#tagSearchBox"), [$("#tagSearchBox")]);
        showElementOnFocus($("#tagSearchResultsContainer"), $("#tagSearchBox"));
        hideElementOnClickOutside($("#tagSearchResultsContainer"), ["#tagSearchBox"]);
        reloadTagSearchResultsOnInput();
    });
}

/** Set the top margin of the board view content container so that it starts
 * right below the nav bar
 */
function setBoardContainerTopMargin() {
    let navBar = $("#navBar");
    let marginTop = navBar.outerHeight() + 10;
    $("#boardContainer").css("margin-top", marginTop + "px");
}

/** Resize each column's scroll box so that its height fill the remainder of
* the screen
*/
function setBoardTaskContainerHeights() {
    $(".board-task-container").each(function () {
        let taskContainer = $(this);
        let taskContainerTopOffset = taskContainer.offset().top;
        let taskContainerHeight = window.innerHeight - taskContainerTopOffset;
        taskContainer.outerHeight(taskContainerHeight);
    })
}

/** Set up the event listeners attached to a given category
 *
 * @param {object} category The given category
 */
function setUpBoardCategoryEventListeners(category) {
    startBoardCategoryDragOnMouseDown(category);
    addNewBoardTaskOnEnter(category);

    let header = category.find(".board-category-header");
    header.hover(
        function () {
            header.parent().css("border-color", "#9e9e9e");
        },
        function () {
            header.parent().css("border-color", "white");
        }
    );

    category.find(".board-task").each(function () {
        let task = $(this);
        setUpBoardTaskEventListeners(task);
    });
}

/** Set up the event listeners attached to a given task
 *  
 * @param {object} task The given task
 */
function setUpBoardTaskEventListeners(task) {
    startBoardTaskDragOnMouseDown(task);

    let taskId = task.data("taskId");
    task.click(function () {
        if (!getElementHovered(mouseMoveEvent, $(".board-task-assignee"))
            && !getElementHovered(mouseMoveEvent, $(".board-task-due-date"))) {
            openTaskDetails(taskId);
        }
    });
}

/** Update the html of the board task to show its new priority
 *
 * @param {number} taskId The ID of the task who's priority is changing
 * @param {string} isCompleted The task's new priority
 */
function updateBoardTaskPriorityHtml(taskId, priority) {
    let task = findBoardTaskWithId(taskId);
    let priorityClassName = getPriorityCssClassName(priority);
    let priorityString = getPriorityString(priority);

    task.find(".board-task-priority").remove();
    if (priority != 0) {
        task.find(".board-task-left-section").prepend(`
            <div class="board-task-priority task-priority `+ priorityClassName + `" data-priority="` + priority + `">
                ` + priorityString + `
            </div>
        `);
    }
}

/** Update the html of the board task to show its new completion status
 *
 * @param {number} taskId The ID of the task who's completion status is changing
 * @param {string} isCompleted The task's new completion status
 */
function updateBoardTaskCompletedHtml(taskId, isCompleted) {
    let task = findBoardTaskWithId(taskId);
    if (isCompleted) {
        task.find(".board-task-second-row").prepend(`
            <div class="board-task-completed-icon">
                <div>&#10003</div>
            </div>
        `);
        task.addClass("board-task-completed");
    } else {
        task.find(".board-task-completed-icon").remove();
        task.removeClass("board-task-completed");
    }
}

/** Update the html of the board task to show its new name
 *
 * @param {number} taskId The ID of the task who's name is being changed
 * @param {string} taskName The task's new name
 */
function updateBoardTaskNameHtml(taskId, taskName) {
    let task = findBoardTaskWithId(taskId);
    task.find(".board-task-name").html(taskName);
}

/** Add a tag's html to a board task
 * 
 * @param {number} taskId The ID of the task the tag is being added to
 * @param {number} tagId The ID of the tag
 * @param {number} tagName The name of the tag
 */
function addTagHtmlToBoardTask(taskId, tagId, tagName, colorIndex) {
    let task = findBoardTaskWithId(taskId);
    task.find(".board-task-fourth-row").append(`
        <div class="board-task-tag color-option-` + colorIndex + `" data-tag-id="` + tagId + `">` + tagName + `</div>
    `);
}

/** Update the color of a tag of a board task
 * 
 * @param {number} taskId The ID of the task being updated
 * @param {number} tagId The ID of the task being updated
 * @param {number} colorIndex The index of the new color
 */
function updateBoardTaskTagColorHtml(taskId, tagId, colorIndex) {
    let tag = findBoardTaskTagWithId(taskId, tagId);
    tag.removeClass();
    tag.addClass("board-task-tag");
    tag.addClass("color-option-" + colorIndex);
}

/** Remove a tag's html from a board task
 * 
 * @param {number} taskId The ID of the task the tag belongs to
 * @param {number} tagId The ID of the tag
 */
function removeBoardTaskTagHtml(taskId, tagId) {
    let tag = findBoardTaskTagWithId(taskId, tagId);
    tag.remove();
}

/** Hide all the pop ups of the board view
 */
function hideBoardViewPopUps() {
    $("#assigneeSelectionContainer").addClass("hidden");
    $("#dueDateSelectionContainer").addClass("hidden");
    $("#removeBoardCategoryAlert").addClass("hidden");
    $("#addBoardCategoryButton").removeClass("hidden");
    $("#newCategoryNameTextBox").addClass("hidden");
    $(".new-board-task-container").addClass("hidden");
}