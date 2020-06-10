/** Set the completed status of a task in the database
 *
 * @param {number} taskId The ID of the task who's description is being set
 * @param {string} taskDescription The task's new description
 */
function setTaskIsCompletedInDatabase(taskId, isCompleted) {
    $.ajax({
        type: "POST",
        url: "/Task/SetIsCompleted",
        data: { taskId: taskId, isCompleted: isCompleted }
    });
}

/** Update the name of a task in the database
 *
 * @param {number} taskId The ID of the task who's name is being changed
 * @param {string} taskName The task's new name
 */
function changeNameOfTaskInDatabase(taskId, taskName) {
    $.ajax({
        type: "POST",
        url: "/Home/ChangeTaskName",
        data: { taskId: taskId, taskName: taskName }
    });
}

/** Set the description of a task in the database
 *
 * @param {number} taskId The ID of the task who's description is being set
 * @param {string} taskDescription The task's new description
 */
function setTaskDescriptionInDatabase(taskId, taskDescription) {
    $.ajax({
        type: "POST",
        url: "/Home/SetTaskDescription",
        data: { taskId: taskId, taskDescription: taskDescription }
    });
}

/** Updates the category and index of a task in the database
 * 
 * @param {number} taskId The ID of the task being updated
 * @param {number} newCategoryId The ID of the category the task is being moved to
 * @param {number} newTaskIndex The index in the category the task is being moved to
 */
function moveTaskInDatabase(taskId, newCategoryId, newTaskIndex) {
    $.ajax({
        type: "POST",
        url: "/Home/MoveTask",
        data: { taskId: taskId, newCategoryId: newCategoryId, newTaskIndex: newTaskIndex }
    });
}

/** Updates the due date of a task in the database
 * 
 * @param {number} taskId The ID of the task being updated
 * @param {number} day The due date day
 * @param {number} month The due date month
 * @param {number} year The due date year
 */
function setDueDateInDatabase(taskId, day, month, year) {
    $.ajax({
        type: "POST",
        url: "/Home/SetDueDate",
        data: { taskId: taskId, day: day, month: month, year: year }
    });
}

/** Update the assigned user of a task in the database
 * 
 * @param {number} taskId The ID of the task being updated
 * @param {number} userId The ID of the user being assigned to the task
 */
function assignUserToTaskInDatabase(taskId, userId) {
    $.ajax({
        type: "POST",
        url: "/Home/AssignUserToTask",
        data: { taskId: taskId, userId: userId }
    });
}

/** Update the priority of a task in the database
 * 
 * @param {number} taskId The ID of the task being updated
 * @param {number} priority A integer between 0-5 representing the task's new priority
 */
function setPriorityInDatabase(taskId, priority) {
    $.ajax({
        type: "POST",
        url: "/Task/SetPriority",
        data: { taskId: taskId, priority: priority }
    });
}

/** Add a tag to a task in the database
 * 
 * @param {number} taskId The ID of the task
 * @param {number} tagId The ID of a tag
 */
function addTagToTaskInDatabase(taskId, tagId) {
    $.ajax({
        type: "POST",
        url: "/Task/AddTag",
        data: { taskId: taskId, tagId: tagId }
    });
}

/** Remove a tag to a task in the database
 * 
 * @param {number} taskId The ID of the task
 * @param {number} tagId The ID of a tag
 */
function removeTagFromTaskInDatabase(taskId, tagId) {
    $.ajax({
        type: "POST",
        url: "/Task/RemoveTag",
        data: { taskId: taskId, tagId: tagId }
    });
}

/** Deletes task from the database
 * 
 * @param {number} taskId The ID of the task being deleted
 */
function deleteTaskInDatabase(taskId) {
    $.ajax({
        type: "POST",
        url: "/Task/Delete",
        data: { taskId: taskId }
    });
}