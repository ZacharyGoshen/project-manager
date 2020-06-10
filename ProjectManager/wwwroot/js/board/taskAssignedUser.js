/** Set the location of the assignee selection container to right below the
 * button clicked and then toggle it between open and closed
 *
 * @param {number} taskId The ID of the task whose assignee is being selected
 */
function toggleBoardAssigneeSelectionContainer(taskId) {
    let task = findBoardTaskWithId(taskId);
    let button = task.find(".board-task-third-row").children().eq(0);
    let buttonCoordinates = button.offset();
    let buttonHeight = button.height();
    let containerXOffset = buttonCoordinates.left;
    let containerYOffset = buttonCoordinates.top + buttonHeight;
    toggleAssigneeSelectionContainer(containerXOffset, containerYOffset, taskId);

    setUpAssigneeSearchResultClickEvent(taskId);
}

/** Update the html of the board task to show the user that was assigned
 * 
 * @param {number} taskId The ID of the task who's being assigned a user
 * @param {string} firstName The assigned user's first name
 * @param {string} lastName The assigned user's last name
 */
function updateBoardTaskAssigneeHtml(taskId, firstName, lastName) {
    let task = findBoardTaskWithId(taskId);

    if (firstName == null && lastName == null) {
        task.find(".board-task-assignee").html(`
            <input class="unassigned-user-icon" type="image" src="../images/user.png" />
        `);
    } else {
        task.find(".board-task-assignee").html(`
            <div class="default-profile-pic">
                <div>` + firstName[0] + lastName[0] + `</div>
            </div>
        `);
    }
}