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

    let userName = searchResult.find(".user-search-result-name").html();
    let firstName = userName.split(" ")[0];
    let lastName = userName.split(" ")[1];
    updateBoardTaskAssigneeHtml(taskId, firstName, lastName);
};

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