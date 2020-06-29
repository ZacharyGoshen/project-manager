/** Toggles the user selection container between open and closed
 * 
 * @param {number} xOffset The x offset of the container
 * @param {number} yOffset The y offset of the container
 */
function toggleUserSelectionContainer(xOffset, yOffset) {
    let container = $("#userSelectionContainer");
    if (container.hasClass("hidden")) {
        container.removeClass("hidden");
        container.offset({ top: yOffset, left: xOffset });
    } else {
        resetUserSelectionContainer();
        container.addClass("hidden");
    }
}

/** Set up the click event that occurs when a user search result is clicked
 *
 * @param {object} handler The handler that is called when the result is clicked
 */
function setUpUserSearchResultClickEvents(handler) {
    $(".user-search-result").each(function () {
        let searchResult = $(this);
        searchResult.off("click");;
        searchResult.click(function () {
            toggleUserSelectionContainer(0, 0);
            handler(searchResult);
        });
    });
}

/** Finds all users whose name matches the input of the user search box and
 * displays them
 *
 * @param {object} handler The handler that is called when the result is clicked
 * @param {boolean} onlyFindUsersInProject If true, only find the users that are team members of the current project. Otherwise, find all users
 */
function reloadUserSearchResultsOnInput(handler, onlyFindUsersInProject) {
    let searchBox = $("#userSearchBox");
    searchBox.off("keydown");
    $(searchBox).keydown(function (event) {
        let lastKeyPressed = String.fromCharCode(event.which);
        let validCharacterRegex = /^[A-Za-z ]$/
        let input = $("#userSelectionContainer input").val();
        let backSpaceKeyCode = 8;
        if (lastKeyPressed.match(validCharacterRegex)) {
            input += lastKeyPressed;
        } else if (event.keyCode === backSpaceKeyCode) { 
            input = input.substring(0, input.length - 1);
        }
        input = input.toLowerCase();

        if (input != "") {
            let projectId = 0;
            if (onlyFindUsersInProject) {
                projectId = $("#currentProject").data("projectId");
            }

            let matchingUsers = null;
            let request = $.ajax({
                type: "POST",
                url: "/User/FindFirstTenThatContainName",
                data: { name: input, projectId: projectId },
                success: function (users) {
                    matchingUsers = users;
                }
            });

            $.when(request).then(function () {
                resetUserSearchResults();
                updateUserSearchResultsHtml(matchingUsers);
                setUpUserSearchResultClickEvents(handler);
            });
        } else {
            resetUserSearchResults();
        }
    });
}

/** Update the html of the user selection results container to display the users
 * found
 * 
 * @param {object} users The users to display
 */
function updateUserSearchResultsHtml(users) {
    for (user of users) {
        $("#userSearchResultsContainer").append(`
            <div class="user-search-result" data-user-id="` + user.userId + `">
                <div class="default-profile-pic color-option-` + user.colorIndex + `">
                    <div>` + user.firstName[0] + user.lastName[0] + `</div>
                </div>
                <div class="user-search-result-name">` + user.firstName + " " + user.lastName + `</div>
            </div>
        `);
    }
}

/** Removes all of the previous user search results
 */
function resetUserSearchResults() {
    $("#userSearchResultsContainer").html("");
}

/** Removes all of the previous user search results and clears the input
 */
function resetUserSelectionContainer() {
    resetUserSearchResults();
    $("#userSearchBox").val("");
    $("#userSearchBox").blur();
}