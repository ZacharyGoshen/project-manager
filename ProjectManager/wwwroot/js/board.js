currentView = "board";
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
        setUpTaskDetailsEventListeners();

        setTaskContainerHeights();

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
    });
}

/** Resize each column's scroll box so that its height fill the remainder of
* the screen
*/
function setTaskContainerHeights() {
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
}

/** Add the new category when the enter key is pressed within the new category form
 */
function addNewBoardCategoryOnEnter() {
    $("#newCategoryNameTextBox").keypress(function (event) {
        if (event.keyCode === 13) {
            let categoryName = $(this).val();
            let categoryIndex = $(this).parent().data("categoryIndex");
            event.preventDefault();
            $.ajax({
                type: "POST",
                url: "/Home/NewCategory",
                data: { projectId: 1, categoryName: categoryName },
                success: function (categoryId) {
                    let newCategoryHtml = generateNewBoardCategoryHtml(categoryId, categoryName, categoryIndex);
                    insertCategoryInBoard(newCategoryHtml, categoryIndex);
                    setUpBoardCategoryEventListeners(findBoardCategoryWithId(categoryId));
                    toggleNewBoardCategoryForm();
                }
            });
        }
    });
}

/** Add the new task when the enter key is pressed within the new task form
 */ 
function addNewBoardTaskOnEnter(category) {
    let newTaskTextBox = category.find(".new-board-task-text-box");
    let categoryId = category.data("categoryId");
    let categoryIndex = category.data("categoryIndex");

    newTaskTextBox.keypress(function (event) {
        if (event.keyCode === 13) {
            let taskName = newTaskTextBox.val();
            event.preventDefault();
            $.ajax({
                type: "POST",
                url: "/Home/NewTask",
                data: { categoryId: categoryId, taskName: taskName },
                success: function (taskId) {
                    let newTaskHtml = generateNewBoardTaskHtml(taskId, taskName);
                    insertBoardTaskInCategory(newTaskHtml, categoryId, 0);
                    setUpBoardTaskEventListeners(findBoardTaskWithId(taskId));
                    toggleNewTaskForm(categoryIndex);
                }
            });
        }
    });
}

/** Toggle the new category form between open and closed and move the cursor
 * to the form if opened
 */
function toggleNewBoardCategoryForm() {
    let newCategoryForm = $("#newCategoryNameTextBox");
    let newCategoryButton = $("#addBoardCategoryButton");

    if (newCategoryForm.hasClass("hidden")) {
        newCategoryButton.addClass("hidden");
        newCategoryForm.removeClass("hidden");
        newCategoryForm.focus();
        newCategoryForm.select();
    } else {
        newCategoryButton.removeClass("hidden");
        newCategoryForm.addClass("hidden");
        newCategoryForm.blur();
        newCategoryForm.val("");
    }
}

/** Toggle the new task form between open and closed and move the cursor
 * to the form if opened. Closes any other new task form currently open
 * 
 * @param {number} categoryIndex The category index of the new task
 */
function toggleNewTaskForm(categoryIndex) {
    let newTaskContainer = $(".board-category").eq(categoryIndex).find(".new-board-task-container");
    if (!newTaskContainer.hasClass("hidden")) {
        newTaskContainer.find(".new-board-task-text-box").val("");
        newTaskContainer.addClass("hidden");
    } else {
        $(".new-board-task-container").addClass("hidden");
        newTaskContainer.removeClass("hidden");
        let textBox = newTaskContainer.find("textarea");
        textBox.focus();
        textBox.select();
    }
}

/** Set the location of the assignee selection container to right below the
 * button clicked and then toggle it between open and closed
 *
 * @param {number} taskId The ID of the task whose assignee is being selected
 */
function toggleBoardAssigneeSelectionContainer(taskId) {
    let task = findBoardTaskWithId(taskId);
    let button = task.find(".board-task-second-row").children().eq(0);
    let buttonCoordinates = button.offset();
    let buttonHeight = button.height();
    let containerXOffset = buttonCoordinates.left;
    let containerYOffset = buttonCoordinates.top + buttonHeight;
    toggleAssigneeSelectionContainer(containerXOffset, containerYOffset, taskId);

    setUpAssigneeSearchResultClickEvent(taskId);
}

/** Sets the location of the due date selection container to right below the
 * button clicked and then toggle it between open and closed
 * 
 * @param {number} taskId The ID of the task whose due date is being selected
 */
function toggleBoardDueDateSelectionContainer(taskId) {
    let task = findBoardTaskWithId(taskId);
    let button = task.find(".board-task-second-row").children().eq(1);
    let buttonCoordinates = button.offset();
    let buttonHeight = button.height();
    let containerXOffset = buttonCoordinates.left;
    let containerYOffset = buttonCoordinates.top + buttonHeight;
    toggleDueDateSelectionContainer(containerXOffset, containerYOffset, taskId);

    $("#dueDateSelectionContainer").data("taskId", taskId);
    setUpCalendarDateClickEvent(taskId);
}

/** Generate the html of a new board category
 * 
 * @param {number} categoryId The ID of the new category
 * @param {string} categoryName The name of the new category
 * @param {number} categoryIndex The index of the new category
 */ 
function generateNewBoardCategoryHtml(categoryId, categoryName, categoryIndex) {
    return `
        <div class="board-category" data-category-id="` + categoryId + `" data-category-index="` + categoryIndex + `">
            <div class="board-category-header">
                <div class="board-category-name">` + categoryName + `</div>
                <button class="board-category-delete-button" type="button" onclick="deleteBoardCategory(` + categoryId + `)">x</button>
            </div>
            <div class="board-new-task-button-container">
                <button class="add-task-to-board-button" onclick="toggleNewTaskForm(` + categoryIndex + `)">+</button>
            </div>
            <div class="new-board-task-container hidden">
                <textarea class="new-board-task-text-box"></textarea>
            </div>

            <div class="board-task-container">
                <div class="board-task-drop-area" data-task-index="0"></div>
                <div class="board-task-container-extra-height"></div>
            </div>
        </div>
        `;
}

/** Create a new task with the given ID and name
 * 
 * @param {number} taskId The task's ID
 * @param {number} taskName The task's name
 * @returns {string} The HTML of the new task
 */
function generateNewBoardTaskHtml(taskId, taskName) {
    return `
        <div class="board-task" data-task-id="` + taskId + `" data-task-index="0">
            <div class="board-task-first-row">
                <button type="submit" class="board-task-delete-button" onclick="deleteBoardTask(` + taskId + `)">x</button>
                <a class="board-task-name unstyledLink hoverPointer" onclick="openTaskDetails(` + taskId + `)">` + taskName + `</a>
            </div>
            <div class="board-task-second-row">
                <div class="board-task-assignee" onclick="toggleBoardAssigneeSelectionContainer(` + taskId + `)">
                    <input class="unassigned-user-icon" type="image" src="../images/user.png" />
                </div>
                <div class="board-task-due-date" onclick="toggleBoardDueDateSelectionContainer(` + taskId + `)">
                    <input class="unassigned-due-date-icon" type="image" src="../images/clock.png" />
                </div>
            </div>
        </div>
        `;
}

/** Insert a category and its drop area's html into the board and increment
 * the indices of all the categories and drop areas to the right of it
 * 
 * @param {string} categoryToInsert The HTML of the task that is being inserted
 */
function insertCategoryInBoard(categoryToInsert, destinationIndex) {
    $(".board-category").each(function () {
        let category = $(this);
        let categoryIndex = category.data("categoryIndex");
        if (categoryIndex >= destinationIndex) {
            category.data("categoryIndex", categoryIndex + 1);
        }
    });

    $(".board-category-drop-area").each(function () {
        let dropArea = $(this);
        let dropAreaIndex = dropArea.data("categoryIndex");
        if (dropAreaIndex >= destinationIndex) {
            dropArea.data("categoryIndex", dropAreaIndex + 1);
        }
    });

    let dropAreaToInsert = `<div class="board-category-drop-area" data-category-index="` + destinationIndex + `"></div>`;

    if (destinationIndex == 0) {
        let categoryContainer = $("#boardCategoryContainer");
        categoryContainer.prepend(categoryToInsert);
        categoryContainer.prepend(dropAreaToInsert);
    } else {
        let categoryToLeft = $(".board-category").eq(destinationIndex - 1);
        categoryToLeft.after(categoryToInsert);
        categoryToLeft.after(dropAreaToInsert);
    }
}

/** Insert a task and its drop area's html into a category and increment the
 * indices of all the tasks and drop areas below it
 * 
 * @param {string} taskToInsert The HTML of the task that is being inserted
 * @param {number} destinationCategoryId The ID of the category getting a new task
 * @param {number} destinationTaskIndex The index of the task in its new category
 */
function insertBoardTaskInCategory(taskToInsert, destinationCategoryId, destinationTaskIndex) {
    let destinationCategory = findBoardCategoryWithId(destinationCategoryId);

    destinationCategory.find(".board-task").each(function () {
        let taskInSameCategory = $(this);
        let taskInSamecategoryIndex = taskInSameCategory.data("taskIndex");
        if (taskInSamecategoryIndex >= destinationTaskIndex) {
            taskInSameCategory.data("taskIndex", taskInSamecategoryIndex + 1);
        }
    });

    destinationCategory.find(".board-task-drop-area").each(function () {
        let dropAreaInSameCategory = $(this);
        let dropAreaInSamecategoryIndex = dropAreaInSameCategory.data("taskIndex");
        if (dropAreaInSamecategoryIndex >= destinationTaskIndex) {
            dropAreaInSameCategory.data("taskIndex", dropAreaInSamecategoryIndex + 1);
        }
    });

    let dropAreaToInsert = `<div class="board-task-drop-area" data-task-index="` + destinationTaskIndex + `"></div>`;

    if (destinationTaskIndex == 0) {
        let taskContainer = destinationCategory.find(".board-task-container");
        taskContainer.prepend(taskToInsert);
        taskContainer.prepend(dropAreaToInsert);
    } else {
        let taskAbove = destinationCategory.find(".board-task").eq(destinationTaskIndex - 1);
        taskAbove.after(taskToInsert);
        taskAbove.after(dropAreaToInsert);
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

/** Update the html of the board task to show the user that was assigned
 * 
 * @param {number} taskId The ID of the task who's being assigned a user
 * @param {string} firstName The assigned user's first name
 * @param {string} lastName The assigned user's last name
 */
function updateBoardTaskAssigneeHtml(taskId, firstName, lastName) {
    let task = findBoardTaskWithId(taskId);

    task.find(".board-task-assignee").html(`
        <div class="default-profile-pic">
            ` + firstName[0] + lastName[0] + `
        </div>
    `);
}

/** Update the html of the board task to show the updated due date
 * 
 * @param {number} taskId The ID of the task who's due date is being updated
 * @param {object} dueDate The due date of the task
 */
function updateBoardTaskDueDateHtml(taskId, dueDate) {
    let task = findBoardTaskWithId(taskId);

    task.find(".board-task-due-date").html(`
        <div>` + dueDate.toLocaleDateString(undefined, { month: "short", day: "numeric" }) + `</div>
    `);
}

/** Remove a category and its drop area from the board and decrement the
 * indices of all the categories and drop areas to the right of it
 *
 * @param {number} categoryId The ID of the category being removed
 */
function removeCategoryHtmlFromBoard(categoryId) {
    let categoryToRemove = findBoardCategoryWithId(categoryId);
    let categoryToRemoveIndex = categoryToRemove.data("categoryIndex");
    let dropAreaToRemove = categoryToRemove.parent().find(".board-category-drop-area").eq(categoryToRemoveIndex);

    categoryToRemove.parent().find(".board-category").each(function () {
        let category = $(this);
        let categoryIndex = category.data("categoryIndex");
        if (categoryIndex > categoryToRemoveIndex) {
            category.data("categoryIndex", categoryIndex - 1);
        }
    });

    categoryToRemove.parent().find(".board-category-drop-area").each(function () {
        let dropArea = $(this);
        let dropAreaIndex = dropArea.data("categoryIndex");
        if (dropAreaIndex > categoryToRemoveIndex) {
            dropArea.data("categoryIndex", dropAreaIndex - 1);
        }
    });

    categoryToRemove.remove();
    dropAreaToRemove.remove();
}

/** Remove a task and its drop area from its category and decrement the indices
 * of all the tasks and drop areas below it
 * 
 * @param {number} taskId The ID of the task being removed
 */
function removeBoardTaskHtmlFromCategory(taskId) {
    let taskToRemove = findBoardTaskWithId(taskId);
    let taskToRemoveIndex = taskToRemove.data("taskIndex");
    let dropAreaToRemove = taskToRemove.parent().find(".board-task-drop-area").eq(taskToRemoveIndex);

    taskToRemove.parent().find(".board-task").each(function () {
        let taskInSameCategory = $(this);
        let taskInSamecategoryIndex = taskInSameCategory.data("taskIndex");
        if (taskInSamecategoryIndex > taskToRemoveIndex) {
            taskInSameCategory.data("taskIndex", taskInSamecategoryIndex - 1);
        }
    });

    taskToRemove.parent().find(".board-task-drop-area").each(function () {
        let dropAreaInSameCategory = $(this);
        let dropAreaInSamecategoryIndex = dropAreaInSameCategory.data("taskIndex");
        if (dropAreaInSamecategoryIndex > taskToRemoveIndex) {
            dropAreaInSameCategory.data("taskIndex", dropAreaInSamecategoryIndex - 1);
        }
    });

    taskToRemove.remove();
    dropAreaToRemove.remove();
}

/** Remove the selected category if it has no tasks. Otherwise display an error
 * 
 * @param {any} numberOfTasksInCategory
 * @param {any} categoryIndex
 * @param {any} categoryId
 */
function deleteBoardCategory(categoryId) {
    let category = findBoardCategoryWithId(categoryId);
    let numberOfTasksInCategory = category.find(".board-task").length;

    if (numberOfTasksInCategory == 0) {
        deleteCategoryInDatabase(categoryId);
        removeCategoryHtmlFromBoard(categoryId);
    } else {
        showRemoveNotEmptyCategoryWarning(category)
    }
}

/** Delete the task in the database and removes its html from the board
 * 
 * @param {number} taskId The ID of the task being deleted
 */
function deleteBoardTask(taskId) {
    deleteTaskInDatabase(taskId);
    removeBoardTaskHtmlFromCategory(taskId);
}

/** Display a warning below the delete category button telling the user they
 * can not delete a category that still has tasks in it
 * 
 * @param {object} category
 */
function showRemoveNotEmptyCategoryWarning(category) {
    let deleteButton = category.find(".board-category-delete-button");
    let buttonCoordinates = deleteButton.offset();
    let buttonHeight = deleteButton.height();
    let alert = $("#removeBoardCategoryAlert");
    alert.removeClass("hidden");
    alert.offset({ top: buttonCoordinates.top + buttonHeight, left: buttonCoordinates.left });
}

/** Find the board category with the matching ID
 * 
 * @param {number} categoryId The ID of the category you want to find
 * @returns {object} The category you want to find
 */
function findBoardCategoryWithId(categoryId) {
    let category = null;
    $(".board-category").each(function () {
        if ($(this).data("categoryId") == categoryId) {
            category = $(this);
        }
    });
    return category;
}

/** Find the board task with the matching ID
 * 
 * @param {number} taskId The ID of the task you want to find
 * @returns {object} The task you want to find
 */
function findBoardTaskWithId(taskId) {
    let task = null;
    $(".board-task").each(function () {
        if ($(this).data("taskId") == taskId) {
            task = $(this);
        }
    });
    return task;
}

/** Insert the dragged category into its new position and update the database
 */
function endBoardCategoryDrag() {
    if (categoryBeingDragged) {
        categoryBeingDragged = false;

        resetCategoryMargins();

        let categoryId = $("#draggedCategoryCopy").data("categoryId");
        let newIndex = $("#boardCategoryDropAreaIndicator").data("categoryIndex");
        let categoryToInsert = `
                <div class="board-category" data-category-id="` + categoryId + `" data-category-index="` + newIndex + `">
                    ` + $("#draggedCategoryCopy").html() + `
                </div>`;
        insertCategoryInBoard(categoryToInsert, newIndex);

        $("#draggedCategoryCopy").empty();
        $("#draggedCategoryCopy").removeData();
        $("#draggedCategoryCopy").addClass("hidden");
        $("#boardCategoryDropAreaIndicator").empty();
        $("#boardCategoryDropAreaIndicator").removeData();
        $("#boardCategoryDropAreaIndicator").addClass("hidden");

        let movedCategory = findBoardCategoryWithId(categoryId);
        setUpBoardCategoryEventListeners(movedCategory);

        moveCategoryInDatabase(categoryId, newIndex);
    }
}

/** Insert the dragged task into its new column and update the database
 */
function endBoardTaskDrag() {
    if (taskBeingDragged) {
        taskBeingDragged = false;

        resetTaskMargins();

        let taskId = $("#draggedTaskCopy").data("taskId");
        let newCategoryId = $("#boardTaskDropAreaIndicator").data("categoryId");
        let newTaskIndex = $("#boardTaskDropAreaIndicator").data("taskIndex");
        let taskToInsert = `
                <div class="board-task" data-task-id="` + taskId + `" data-task-index="` + newTaskIndex + `">
                    ` + $("#draggedTaskCopy").html() + `
                </div>`;
        insertBoardTaskInCategory(taskToInsert, newCategoryId, newTaskIndex);

        $("#draggedTaskCopy").empty();
        $("#draggedTaskCopy").removeData();
        $("#draggedTaskCopy").addClass("hidden");
        $("#boardTaskDropAreaIndicator").empty();
        $("#boardTaskDropAreaIndicator").removeData();
        $("#boardTaskDropAreaIndicator").addClass("hidden");

        let movedTask = findBoardTaskWithId(taskId);
        setUpBoardTaskEventListeners(movedTask);

        moveTaskInDatabase(taskId, newCategoryId, newTaskIndex);
    }
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