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

/** Toggles the tag color selection container between open and closed
 * 
 * @param {number} xOffset The x offset of the container
 * @param {number} yOffset The y offset of the container
 */
function toggleTagColorSelectionContainer(xOffset, yOffset) {
    let container = $("#tagColorSelectionContainer");
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
            toggleTagSelectionContainer(0, 0);
            $("#tagSearchBox").val("");
            resetTagSearchResults();

            if (!checkIfTaskHasTag(tagId)) {
                addTagToTaskInDatabase(taskId, tagId);

                let tagName = $(this).find(".task-tag").html();
                let colorIndex = $(this).data("colorIndex");

                if (currentView == "board") {
                    addTagHtmlToBoardTask(taskId, tagId, tagName, colorIndex);
                }

                if (!$("#taskDetailsContainer").hasClass("hidden")) {
                    addTagHtmlToTaskDetails(tagId, tagName, colorIndex);
                }
            }
        });
    });
}

/** Sets up the click events that add a tag to a task when a tag search result
 * is clicked
 *
 * @param {number} taskId The ID of the task getting a tag added to it
 */
function setUpTagColorClickEvent(taskId) {
    let colorContainer = $("#tagColorSelectionContainer");

    colorContainer.find(".color-option").each(function () {
        $(this).off("click");
        let colorIndex = $(this).data("colorIndex");
        $(this).click(function () {
            let tagId = colorContainer.data("tagId");
            toggleTagColorSelectionContainer(0, 0);
            setTagColorIndexInDatabase(tagId, colorIndex);

            if (!$("#taskDetailsContainer").hasClass("hidden")) {
                updateTaskDetailsTagColor(tagId, colorIndex);
            }

            if (currentView == "board") {
                updateBoardTaskTagColorHtml(taskId, tagId, colorIndex);
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

    $("#createTagButton").html("+ Create tag named ''");
}

/** Create a new tag in the database, and add its html to the details and
 * current view
 */
function createTag() {
    let taskId = $("#taskDetailsContainer").data("taskId");
    let projectId = $("#projectDropDownDiv").data("projectId");

    let createTagButtonText = $("#createTagButton").html();
    let tagName = createTagButtonText.slice(createTagButtonText.indexOf("'") + 1, -1);

    let newTagId = null;
    let ajaxRequest = $.ajax({
        type: "POST",
        url: "/Tag/New",
        data: { tagName: tagName, taskId: taskId, projectId: projectId },
        success: function (tagId) {
            newTagId = tagId;
        }
    });

    $.when(ajaxRequest).done(function () {
        addTagHtmlToTaskDetails(newTagId, tagName, 0);

        if (currentView == "board") {
            addTagHtmlToBoardTask(taskId, newTagId, tagName, 0);
        }

        let containerOffset = $("#tagSelectionContainer").offset();
        toggleTagSelectionContainer(0, 0);
        $("#tagSearchBox").val("");
        resetTagSearchResults();

        $("#tagColorSelectionContainer").data("tagId", newTagId);
        toggleTagColorSelectionContainer(containerOffset.left, containerOffset.top);
    });
}

/** Update the task details view's tag html
 * 
 * @param {number} tagId The ID of the tag being added
 * @param {number} tagName The name of the tag being added
 * @param {number} colorIndex The index of the color of the tag
 */
function addTagHtmlToTaskDetails(tagId, tagName, colorIndex) {
    $("#taskDetailsAddTagButton").before(`
        <div class="task-details-tag color-option-` + colorIndex + `" data-tag-id="` + tagId + `">
            <div class="task-details-tag-name">` + tagName + `</div>
            <div class="task-details-tag-remove-button" onclick="removeTagFromTask(` + tagId + `)">
                <div>x</div>
            </div>
        </div>
    `);
}

/** Update the color of a task details view's tag html
 * 
 * @param {number} tagId The ID of the tag being added
 * @param {number} colorIndex The index of the color of the tag
 */
function updateTaskDetailsTagColor(tagId, colorIndex) {
    let tag = findTaskDetailsTagWithId(tagId);
    tag.removeClass();
    tag.addClass("task-details-tag");
    tag.addClass("color-option-" + colorIndex);
}

/** Remove a tag's html from the task details view
 * 
 * @param {number} tagId The ID of the tag being removed
 */
function removeTagHtmlFromTaskDetails(tagId) {
    let tag = findTaskDetailsTagWithId(tagId);
    tag.remove();
}

/** Toggle the tag selection container of a task's details view between
 * open and closed */
function toggleDetailsTagSelectionContainer() {
    let button = $("#taskDetailsAddTagButton");
    let xOffset = button.offset().left;
    let yOffset = button.offset().top + button.outerHeight();
    toggleTagSelectionContainer(xOffset, yOffset);

    let taskId = $("#taskDetailsContainer").data("taskId");
    $("#tagSelectionContainer").data("taskId", taskId);
    setUpTagSearchResultsClickEvent(taskId);
    setUpTagColorClickEvent(taskId);
}

/** Check if the viewed task has the tag with the matching ID
 * 
 * @param {number} tagId The ID of the tag being checked for
 * @returns {boolean} True if task the has the tag, false otherwise
 */
function checkIfTaskHasTag(tagId) {
    let hasTag = false
    $(".task-details-tag").each(function () {
        if (tagId == $(this).data("tagId")) {
            hasTag = true;
        }
    });
    return hasTag;
}

/** Find the tag with the matching ID in the task details view
 * 
 * @param {number} tagId The ID of the tag you want to find
 * @returns {object} The tag you want to find
 */
function findTaskDetailsTagWithId(tagId) {
    let tag = null;
    $(".task-details-tag").each(function () {
        if ($(this).data("tagId") == tagId) {
            tag = $(this);
        }
    });
    return tag;
}