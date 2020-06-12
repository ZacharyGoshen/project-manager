/** Add the new task when the enter key is pressed within the new task form
 * 
 * @param {objct} category The category of the the new task
 */
function addNewBoardTaskOnEnter(category) {
    let newTaskTextBox = category.find(".new-board-task-text-box");
    let userId = $("#loggedInUser").data("userId");
    let projectId = $("#currentProjectName").data("projectId");
    let categoryId = category.data("categoryId");
    let categoryIndex = category.data("categoryIndex");

    newTaskTextBox.keypress(function (event) {
        if (event.keyCode === 13) {
            let taskName = newTaskTextBox.val();
            event.preventDefault();
            $.ajax({
                type: "POST",
                url: "/Home/NewTask",
                data: { userId: userId, projectId: projectId, categoryId: categoryId, taskName: taskName },
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

/** Create a new task with the given ID and name
 * 
 * @param {number} taskId The task's ID
 * @param {number} taskName The task's name
 * @returns {string} The HTML of the new task
 */
function generateNewBoardTaskHtml(taskId, taskName) {
    return `
        <div class="board-task" data-task-id="` + taskId + `" data-task-index="0">
            <div class="board-task-left-section">
                <div class="board-task-second-row">
                    <div class="board-task-name">` + taskName + `</div>
                </div>
                <div class="board-task-third-row">
                    <div class="board-task-assignee" onclick="toggleBoardAssigneeSelectionContainer(` + taskId + `)">
                        <input class="unassigned-user-icon" type="image" src="../images/user.png" />
                    </div>
                    <div class="board-task-due-date" onclick="toggleBoardDueDateSelectionContainer(` + taskId + `)">
                        <input class="unassigned-due-date-icon" type="image" src="../images/clock.png" />
                    </div>
                </div>
            </div>
            <div class="board-task-right-section">
                <div class="board-task-delete-button" onclick="deleteBoardTask(` + taskId + `)">x</div>
            </div>
        </div>
        `;
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