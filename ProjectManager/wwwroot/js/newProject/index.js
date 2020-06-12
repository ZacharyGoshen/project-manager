/** Set up the event listeners of the task details view
 */
function setUpNewProjectViewEventListeners() {
    setUpNewProjectNameOnFocus();
    setUpNewProjectDescriptionOnFocus();
}

/** Open the new project view
 */
function openNewProjectView() {
    toggleProjectDropDownMenu();

    let backgroundBlur = $("#newProjectBackgroundBlur");
    let container = $("#newProjectContainer");

    backgroundBlur.removeClass("hidden");
    container.removeClass("hidden");

    backgroundBlur.innerHeight(window.innerHeight);
    backgroundBlur.innerWidth(window.innerWidth);
    backgroundBlur.offset({ top: 0, left: 0 });

    //container.outerHeight(0.9 * window.innerHeight);
    container.outerWidth(0.7 * window.innerWidth);

    let containerTopOffset = (window.innerHeight / 2) - (container.outerHeight() / 2);
    let containerLeftOffset = (window.innerWidth / 2) - (container.outerWidth() / 2);
    container.offset({
        top: containerTopOffset,
        left: containerLeftOffset
    });
}

/** Close the new project view */
function closeNewProjectView() {
    $("#newProjectBackgroundBlur").addClass("hidden");
    $("#newProjectContainer").addClass("hidden");
}

/** Show the placeholder text if none is supplied when the new project name
 * text box loses focus
 */
function setUpNewProjectNameOnFocus() {
    $("#newProjectName").focus(function () {
        if ($(this).val() == "Choose a name for this project") {
            $(this).val("");
            $(this).css("color", "black");
        }
    });
    $("#newProjectName").focusout(function () {
        if ($(this).val() == "") {
            $(this).val("Choose a name for this project");
            $(this).css("color", "#9e9e9e");
        }
    });
}

/** Show the placeholder text if none is supplied when the new project
 * description text box loses focus
 */
function setUpNewProjectDescriptionOnFocus() {
    $("#newProjectDescription").focus(function () {
        if ($(this).val() == "Add a description to this project") {
            $(this).val("");
            $(this).css("color", "black");
        }
    });
    $("#newProjectDescription").focusout(function () {
        if ($(this).val() == "") {
            $(this).val("Add a description to this project");
            $(this).css("color", "#9e9e9e");
        }
    });
}

/** Update the new project view's owner html
 * 
 * @param {string} firstName The first name of the owner
 * @param {string} lastName The last name of the owner
 */
function updateNewProjectViewOwnerHtml(firstName, lastName) {
    if (firstName == null && lastName == null) {
        $("#newProjectOwner").html(`
            <input class="unassigned-user-icon" type="image" src="../images/user.png" />
            <div>None</div>
        `);
    } else {
        $("#newProjectOwner").html(`
            <div class="default-profile-pic">
                <div>` + firstName[0] + lastName[0] + `</div>
            </div>
            <div>` + firstName + ` ` + lastName + `</div>
            <div class="new-project-remove-button" onclick="">
                <div>x</div>
            </div>
        `);
    }
}

/** Toggle the assignee selection container of a task's details view between
 * open and closed */
function toggleNewProjectOwnerSelectionContainer() {
    let button = $("#newProjectOwner");
    let xOffset = button.offset().left;
    let yOffset = button.offset().top + button.outerHeight();
    toggleUserSelectionContainer(xOffset, yOffset);

    setUpUserSearchResultClickEvents(newProjectOwnerSearchResultOnClick);
}

/** Updates the new project view's owner html when a user search result is
 * clicked
 * 
 * @param {object} searchResult The user search result
 */
function newProjectOwnerSearchResultOnClick(searchResult) {
    let userId = searchResult.data("userId");
    $("#newProjectOwner").data("userId", userId);

    let userName = searchResult.find(".user-search-result-name").html();
    let firstName = userName.split(" ")[0];
    let lastName = userName.split(" ")[1];
    updateNewProjectOwnerHtml(taskId, firstName, lastName);
};
