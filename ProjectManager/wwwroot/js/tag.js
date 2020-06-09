/** Toggles the tag selection container between open and closed
 *
 * @param {number} xOffset The x offset of the container
 * @param {number} yOffset The y offset of the container
 */
function toggleTagSelectionContainer(xOffset, yOffset) {
    let container = $("#tagSelectionContainer");
    if (container.hasClass("hidden")) {
        container.removeClass("hidden");
        container.offset({ top: yOffset, left: xOffset });
    } else {
        container.addClass("hidden");
    }
}

/** Sets up the click events that add a tag to a task when a tag search result
 * is clicked
 *
 * @param {number} taskId The ID of the task getting a tag added to it
 */
function setUpTagSearchResultsClickEvent(taskId) {
    $(".tag-search-result").each(function () {
        $(this).off("click");
        let tagId = $(this).data("tagId");
        $(this).click(function () {
            addTagToTaskInDatabase(taskId, tagId);
            toggleTagSelectionContainer(0, 0);

            let tagName = $(this).find(".task-tag").html();

            if (currentView == "board") {
                addTagHtmlToBoardTask(taskId, tagId, tagName);
            }

            if (!$("#taskDetailsContainer").hasClass("hidden")) {
                addTagHtmlToTaskDetails(tagId, tagName);
            }
        });
    });
}

/** Finds all tags whose name matches the input of the tag search box and
 * displays them
 */
function reloadTagSearchResultsOnInput() {
    let searchBox = $("#tagSearchBox");
    searchBox.keydown(function (event) {
        resetTagSearchResults();

        let lastKeyPressed = String.fromCharCode(event.which)
        if (!event.shiftKey) {
            lastKeyPressed = lastKeyPressed.toLowerCase();
        }

        let input = searchBox.val() + lastKeyPressed;
        if (event.keyCode === 8) {
            input = input.substring(0, input.length - 2);
        }
        $("#createTagButton").html("+ Create tag named '" + input + "'");

        input = input.toLowerCase().trim();

        $(".tag-search-result .task-tag").each(function () {
            let name = $(this).text().toLowerCase();
            if (input.length != 0 && name.includes(input)) {
                $(this).parent().removeClass("hidden");
            }
        });
    });
}

/** Hides all of the previous tag search results */
function resetTagSearchResults() {
    $(".tag-search-result").each(function () {
        $(this).addClass("hidden");
    });
}

/** Create a new tag in the database, and add its html to the details and
 * current view
 */
function createTag() {
    let taskId = $("#taskDetailsContainer").data("taskId");
    let projectId = $("#projectDropDownDiv").data("projectId");

    let createTagButtonText = $("#createTagButton").html();
    let tagName = createTagButtonText.slice(createTagButtonText.indexOf("'") + 1, -1);

    $.ajax({
        type: "POST",
        url: "/Tag/New",
        data: { tagName: tagName, taskId: taskId, projectId: projectId },
        success: function (tagId) {
            addTagHtmlToTaskDetails(tagId, tagName);

            if (currentView == "board") {
                addTagHtmlToBoardTask(taskId, tagId, tagName);
            }
        }
    });
}