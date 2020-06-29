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
    toggleUserSelectionContainer(containerXOffset, containerYOffset);

    $("#userSelectionContainer").data("taskId", taskId);
    reloadUserSearchResultsOnInput(boardAssigneeSearchResultOnClick, true);
}

/** Updates the database and board view when an assignee search result is
 * clicked in the board view
 * 
 * @param {object} searchResult The assignee search result
 */
function boardAssigneeSearchResultOnClick(searchResult) {
    let userId = searchResult.data("userId");
    let taskId = $("#userSelectionContainer").data("taskId");

    assignUserToTaskInDatabase(taskId, userId);

    let task = findBoardTaskWithId(taskId);
    let profilePicture = searchResult.children()[0];
    task.find(".board-task-assignee").html("");
    task.find(".board-task-assignee").append(profilePicture);
};