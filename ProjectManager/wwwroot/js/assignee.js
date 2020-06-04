/** Toggles the assignee selection container between open and closed
 * 
 * @param {number} xOffset The x offset of the container
 * @param {number} yOffset The y offset of the container
 */
function toggleAssigneeSelectionContainer(xOffset, yOffset) {
    let container = $("#assigneeSelectionContainer");
    if (container.hasClass("hidden")) {
        container.removeClass("hidden");
        container.offset({ top: yOffset, left: xOffset });
    } else {
        resetAssigneeSearchResults()
        $("#assigneeSearchBox").val("");
        $("#assigneeSearchBox").blur();
        container.addClass("hidden");
    }
}

/** Sets up the click events that assigns a user to a task when an assignee
 * search result is clicked
 *
 * @param {number} taskId
 */
function setUpAssigneeSearchResultClickEvent(taskId) {
    $(".assignee-search-result").each(function () {
        $(this).off("click");
        let userId = $(this).data("userId");
        $(this).click(function () {
            assignUserToTaskInDatabase(taskId, userId);
            toggleAssigneeSelectionContainer(0, 0);

            let userName = $(this).find(".assignee-search-result-name").html();
            let firstName = userName.split(" ")[0];
            let lastName = userName.split(" ")[1];

            if (currentView == "board") {
                updateBoardTaskAssigneeHtml(taskId, firstName, lastName)
            }

            if (!$("#taskDetailsContainer").hasClass("hidden")) {
                updateTaskDetailsAssigneeHtml(firstName, lastName);
            }
        });
    });
}

/** Finds all users whose name matches the input of the assignee search box and
 * displays them
 */
function reloadAssigneeSearchResultsOnInput() {
    let searchBox = $("#assigneeSearchBox");
    $(searchBox).keydown(function (event) {
        resetAssigneeSearchResults()

        let lastKeyPressed = String.fromCharCode(event.which)
        let input = $("#assigneeSelectionContainer input").val() + lastKeyPressed;
        if (event.keyCode === 8) {
            input = input.substring(0, input.length - 2);
        }
        input = input.toLowerCase().trim();

        $(".assignee-search-result-name").each(function () {
            let name = $(this).text().toLowerCase();
            if (input.length != 0 && name.includes(input)) {
                $(this).parent().removeClass("hidden");
            }
        });
    });
}

/** Hides all of the previous assignee search results */
function resetAssigneeSearchResults() {
    $(".assignee-search-result").each(function () {
        $(this).addClass("hidden");
    });
}