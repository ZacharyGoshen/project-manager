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

    container.outerWidth(0.5 * window.innerWidth);

    let containerTopOffset = (window.innerHeight / 2) - (container.outerHeight() / 2);
    let containerLeftOffset = (window.innerWidth / 2) - (container.outerWidth() / 2);
    container.offset({
        top: containerTopOffset,
        left: containerLeftOffset
    });


}

/** Close the new project view
 */
function closeNewProjectView() {
    $("#newProjectBackgroundBlur").addClass("hidden");
    $("#newProjectContainer").addClass("hidden");
    resetUserSelectionContainer();
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

/** Update the new project view's due date html
 * 
 * @param {object} dueDate The new project's due date
 */
function updateNewProjectViewDueDateHtml(dueDate) {
    if (dueDate.getTime() == new Date("0001-01-01T00:00:00Z").getTime()) {
        $("#newProjectDueDate").html(`
            <input class="unassigned-due-date-icon" type="image" src="../images/clock.png" />
            <div>None</div>
        `);
    } else {
        $("#newProjectDueDate").html(`
            <input class="unassigned-due-date-icon" type="image" src="../images/clock.png" />
            <div>` + dueDate.toLocaleDateString(undefined, { month: "short", day: "numeric" }) + `</div>
            <div class="new-project-remove-button" onclick="removeNewProjectViewDueDate()">
                <div>x</div>
            </div>
        `);
    }
}

/** Update the new project view's owner html
 * 
 * @param {string} firstName The first name of the owner
 * @param {string} lastName The last name of the owner
 */
function updateNewProjectViewOwnerHtml(firstName, lastName) {
    $("#newProjectOwner").html(`
        <div class="default-profile-pic">
            <div>` + firstName[0] + lastName[0] + `</div>
        </div>
        <div>` + firstName + ` ` + lastName + `</div>
    `);
}

/** Update the new project view's team members html
 * 
 * @param {string} firstName The first name of the owner
 * @param {string} lastName The last name of the owner
 */
function updateNewProjectViewTeamMembersHtml(userId, firstName, lastName) {
    $("#newProjectAddTeamMemberButton").before(`
        <div class="new-project-team-member" data-user-id=` + userId + `>
            <div class="default-profile-pic">
                <div>` + firstName[0] + lastName[0] + `</div>
            </div>
            <div>` + firstName + ` ` + lastName + `</div>
            <div class="new-project-remove-button" onclick="removeNewProjectViewTeamMember(` + userId + `)">
                <div>x</div>
            </div>
        </div>
    `);
}

/** Remove the due date from the new project view
 */
function removeNewProjectViewDueDate() {
    $("#newProjectDueDate").data("day", -1);
    $("#newProjectDueDate").data("month", -1);
    $("#newProjectDueDate").data("year", -1);

    updateNewProjectViewDueDateHtml(new Date("0001-01-01T00:00:00Z"));
}

/** Remove the team member from the new project view
 * 
 * @param {object} userId The ID of the team member you want to remove
 */
function removeNewProjectViewTeamMember(userId) {
    let teamMember = findNewProjectTeamMemberWithId(userId);
    teamMember.remove();
}

/** Toggle the due date selection container of the new project view between
 * open and closed
 */
function toggleNewProjectDueDateSelectionContainer() {
    let button = $("#newProjectDueDate");
    let xOffset = button.offset().left;
    let yOffset = button.offset().top + button.outerHeight();
    toggleDueDateSelectionContainer(xOffset, yOffset);

    setUpCalendarClickEvents(newProjectCalendarDateOnClick);
}

/** Updates the new project view's due date html when a calendar date is
 * clicked
 * 
 * @param {object} calendarDate The calendar date
 */
function newProjectCalendarDateOnClick(calendarDate) {
    let day = calendarDate.data("day");
    let month = calendarDate.data("month");
    let year = calendarDate.data("year");

    $("#newProjectDueDate").data("day", day);
    $("#newProjectDueDate").data("month", month);
    $("#newProjectDueDate").data("year", year);

    let dueDate = new Date(year, month, day);
    updateNewProjectViewDueDateHtml(dueDate);
};

/** Toggle the owner selection container of the new project view between open and
 * closed
 */
function toggleNewProjectOwnerSelectionContainer() {
    let button = $("#newProjectOwner");
    let xOffset = button.offset().left;
    let yOffset = button.offset().top + button.outerHeight();
    toggleUserSelectionContainer(xOffset, yOffset);

    reloadUserSearchResultsOnInput(newProjectOwnerSearchResultOnClick, false);
}

/** Updates the new project view's owner html when a user search result is
 * clicked
 * 
 * @param {object} searchResult The user search result
 */
function newProjectOwnerSearchResultOnClick(searchResult) {
    let userId = searchResult.data("userId");
    $("#newProjectOwner").data("userId", userId);

    if (checkIfNewProjectHasTeamMember(userId)) {
        removeNewProjectViewTeamMember(userId);
    }

    let userName = searchResult.find(".user-search-result-name").html();
    let firstName = userName.split(" ")[0];
    let lastName = userName.split(" ")[1];
    updateNewProjectViewOwnerHtml(firstName, lastName);
};

/** Toggle the team member selection container of a new project view between
 * open and closed
 */
function toggleNewProjectTeamMemberSelectionContainer() {
    let button = $("#newProjectAddTeamMemberButton");
    let xOffset = button.offset().left;
    let yOffset = button.offset().top + button.outerHeight();
    toggleUserSelectionContainer(xOffset, yOffset);

    reloadUserSearchResultsOnInput(newProjectTeamMemberSearchResultOnClick, false);
}

/** Updates the new project view's owner html when a user search result is
 * clicked
 * 
 * @param {object} searchResult The user search result
 */
function newProjectTeamMemberSearchResultOnClick(searchResult) {
    let userId = searchResult.data("userId");

    if ($("#newProjectOwner").data("userId") != userId &&
        checkIfNewProjectHasTeamMember(userId) == false) {
        let userName = searchResult.find(".user-search-result-name").html();
        let firstName = userName.split(" ")[0];
        let lastName = userName.split(" ")[1];
        updateNewProjectViewTeamMembersHtml(userId, firstName, lastName);
    }
};

/** Check if the new project has a team member with the matching ID
 * 
 * @param {number} userId The ID of the team member being checked for
 * @returns {boolean} True if the new project has the team member, false otherwise
 */
function checkIfNewProjectHasTeamMember(userId) {
    let hasTeamMember = false
    $(".new-project-team-member").each(function () {
        if (userId == $(this).data("userId")) {
            hasTeamMember = true;
        }
    });
    return hasTeamMember;
}

/** Find the team member with the matching ID in the new project view
 * 
 * @param {number} userId The ID of the team member being checked for
 * @returns {object} The team member you want to find
 */
function findNewProjectTeamMemberWithId(userId) {
    let teamMember = null;
    $(".new-project-team-member").each(function () {
        if ($(this).data("userId") == userId) {
            teamMember = $(this);
        }
    });
    return teamMember;
}

/** Retrieve the data from the new project form and create a new project in the
 * database
 */
function createNewProject() {
    let name = $("#newProjectName").val();

    let description = $("#newProjectDescription").val();
    if (description == "Add a description to this project") {
        description = "";
    }

    let day = $("#newProjectDueDate").data("day");

    let month = $("#newProjectDueDate").data("month");
    if (month != -1) {
        month += 1;
    }

    let year = $("#newProjectDueDate").data("year");
    let ownerId = $("#newProjectOwner").data("userId");

    let teamMemberIds = [];
    $(".new-project-team-member").each(function () {
        teamMemberIds.push($(this).data("userId"));
    });

    addProjectToDatabase(name, description, day, month, year, ownerId, teamMemberIds);
}
