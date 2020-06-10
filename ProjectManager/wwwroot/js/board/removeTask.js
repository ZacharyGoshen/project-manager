/** Delete the task in the database and removes its html from the board
 * 
 * @param {number} taskId The ID of the task being deleted
 */
function deleteBoardTask(taskId) {
    deleteTaskInDatabase(taskId);
    removeBoardTaskHtmlFromCategory(taskId);
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