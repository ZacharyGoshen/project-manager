/** Open the project details view
 */
function openProjectDetailsView() {
    toggleProjectDropDownMenu();

    let container = $("#projectDetailsContainer");
    let backgroundBlur = $("#projectDetailsBackgroundBlur");

    backgroundBlur.removeClass("hidden");
    container.removeClass("hidden");

    backgroundBlur.innerHeight(window.innerHeight);
    backgroundBlur.innerWidth(window.innerWidth);
    backgroundBlur.offset({ top: 0, left: 0 });

    let projectId = $("#currentProject").data("projectId");
    $.ajax({
        type: "POST",
        url: "/Project/Get",
        data: { projectId: projectId },
        success: function (project) {
            loadProjectDetailsViewEditable(project);
            setUpProjectDetailsViewEditableEventListeners();
            setProjectDetailsViewSizeAndPosition();
        }
    });
}

/** Set the size and position of the project details view
 */
function setProjectDetailsViewSizeAndPosition() {
    let container = $("#projectDetailsContainer");
    container.outerHeight(0.9 * window.innerHeight);
    container.outerWidth(0.7 * window.innerWidth);

    let containerTopOffset = (window.innerHeight / 2) - (container.outerHeight() / 2);
    let containerLeftOffset = (window.innerWidth / 2) - (container.outerWidth() / 2);
    container.offset({
        top: containerTopOffset,
        left: containerLeftOffset
    });
}

/** Close the project details view
 */
function closeProjectDetailsView() {
    $("#projectDetailsBackgroundBlur").addClass("hidden");
    $("#projectDetailsContainer").addClass("hidden");
    resetUserSelectionContainer();

    $("#projectDetailsSecondSection").html("");
    $("#projectDetailsDueDate").html("");
}

/** Load the version of the project details view that allows the user to edit
 * its data
 * 
 * @param {object} project The project being viewed
 */
function loadProjectDetailsViewEditable(project) {
    $("#projectDetailsSecondSection").html(`
        <input id="projectDetailsName" type="text" spellcheck="false" value="` + project.name + `">
    `);

    $("#projectDetailsSecondSection").append(`
        <textarea id="projectDetailsDescription"></textarea>
    `);
    if (project.description == null) {
        $("#projectDetailsDescription").css("color", "#9e9e9e");
        $("#projectDetailsDescription").val("Add a description to this project");
    } else {
        $("#projectDetailsDescription").css("color", "black");
        $("#projectDetailsDescription").val(project.description);
    }

    let dueDate = new Date(project.dueDate + "Z");
    updateProjectDetailsViewDueDateHtml(dueDate);

    updateProjectDetailsViewOwnerHtml(project.owner.userId, project.owner.firstName, project.owner.lastName)

    $("#projectDetailsTeamMembers").html(`
        <div id="projectDetailsAddTeamMemberButton">
            + Add team member
        </div>
    `);
    for (userProject of project.teamMembers) {
        let teamMember = userProject.user;
        $("#projectDetailsAddTeamMemberButton").before(`
            <div class="project-details-team-member" data-user-id=` + teamMember.userId + `>
                <div class="default-profile-pic">
                    <div>` + teamMember.firstName[0] + teamMember.lastName[0] + `</div>
                </div>
                <div>` + teamMember.firstName + ` ` + teamMember.lastName + `</div>
                <div class="project-details-remove-button">
                    <div>x</div>
                </div>
            </div>
        `);
    }

    $("#projectDetailsTags").html(`
        <div id="projectDetailsAddTagButton">
            + Add tag
        </div>
    `);
    for (tag of project.tags) {
        $("#projectDetailsAddTagButton").before(`
            <div class="project-details-tag color-option-` + tag.colorIndex + `" data-tag-id="` + tag.tagId + `">
                <div class="project-details-tag-name">` + tag.name + `</div>
                <div class="project-details-tag-remove-button">
                    <div>x</div>
                </div>
            </div>
        `);
    }
}

/** Update the project details view's due date html
 * 
 * @param {object} dueDate A Date object containing project's due date
 */
function updateProjectDetailsViewDueDateHtml(dueDate) {
    if (dueDate.getTime() == new Date("0001-01-01T00:00:00Z").getTime()) {
        $("#projectDetailsDueDate").html(`
            <input class="unassigned-due-date-icon" type="image" src="../images/clock.png" />
            <div>None</div>
        `);
    } else {
        $("#projectDetailsDueDate").html(`
            <input class="unassigned-due-date-icon" type="image" src="../images/clock.png" />
            <div>` + dueDate.toLocaleDateString(undefined, { month: "long", day: "numeric" }) + `</div>
            <div class="project-details-remove-button">
                <div>x</div>
            </div>
        `);
    }
}

/** Update the project details view's owner html
 * 
 * @param {any} userId The ID of the owner
 * @param {any} firstName The first name of the owner
 * @param {any} lastName The last name of the owner
 */
function updateProjectDetailsViewOwnerHtml(userId, firstName, lastName) {
    $("#projectDetailsOwner").data("userId", userId);
    $("#projectDetailsOwner").html(`
        <div class="default-profile-pic">
            <div>` + firstName[0] + lastName[0] + `</div>
        </div>
        <div>` + firstName + " " + lastName + `</div>
    `);
}

/** Update the project details view's team members html
 * 
 * @param {string} firstName The first name of the owner
 * @param {string} lastName The last name of the owner
 */
function addTeamMemberHtmlToProjectDetailsView(userId, firstName, lastName) {
    $("#projectDetailsAddTeamMemberButton").before(`
        <div class="project-details-team-member" data-user-id=` + userId + `>
            <div class="default-profile-pic">
                <div>` + firstName[0] + lastName[0] + `</div>
            </div>
            <div>` + firstName + ` ` + lastName + `</div>
            <div class="project-details-remove-button">
                <div>x</div>
            </div>
        </div>
    `);
    removeProjectDetailsViewTeamMemberOnClick();
}

/** Update the project details view's tag html
 * 
 * @param {number} tagId The ID of the tag being added
 * @param {number} tagName The name of the tag being added
 * @param {number} colorIndex The index of the color of the tag
 */
function addTagHtmltoProjectDetailsView(tagId, tagName, colorIndex) {
    $("#projectDetailsAddTagButton").before(`
        <div class="project-details-tag color-option-` + colorIndex + `" data-tag-id="` + tagId + `">
            <div class="project-details-tag-name">` + tagName + `</div>
            <div class="project-details-tag-remove-button">
                <div>x</div>
            </div>
        </div>
    `);
    removeProjectDetailsViewTagOnClick();
}

/** Update the color of a project details view's tag html
 * 
 * @param {number} tagId The ID of the tag being updated
 * @param {number} colorIndex The index of the color of the tag
 */
function updateProjectDetailsViewTagColor(tagId, colorIndex) {
    let tag = findProjectDetailsTagWithId(tagId);
    tag.removeClass();
    tag.addClass("project-details-tag");
    tag.addClass("color-option-" + colorIndex);
}

/** Set up the event listeners of the editable version of the project details
 * view
 */
function setUpProjectDetailsViewEditableEventListeners() {
    updateProjectDetailsNameOnEnter();
    updateProjectDetailsNameOnFocusOut();
    updateProjectDetailsDescriptionOnEnter();
    updateProjectDetailsDescriptionOnFocus();
    toggleProjectDetailsDueDateSelectionContainerOnClick();
    removeProjectDueDateOnClick();
    toggleProjectDetailsOwnerSelectionContainerOnClick();
    toggleProjectDetailsTeamMemberSelectionContainerOnClick();
    removeProjectDetailsViewTeamMemberOnClick();
    toggleProjectDetailsTagSelectionContainerOnClick();
    projectDetailsCreateTagButtonOnClick();
    projectDetailsTagColorOnClick();
    removeProjectDetailsViewTagOnClick();
}

/** Update the name of the project in the database, project details view, and
 * current view when the enter key is pressed in the project name
 */
function updateProjectDetailsNameOnEnter() {
    $("#projectDetailsName").keypress(function (event) {
        if (event.keyCode === 13) {
            event.preventDefault();

            let projectId = $("#currentProject").data("projectId");
            let projectName = $(this).val();

            if (projectName != "") {
                setProjectNameInDatabase(projectId, projectName);
                $("#currentProjectName").html(projectName);
            }

            $(this).blur();
        }
    });
}

/** Update the description of the project in the database and details view
 * when the enter key is pressed in the project description input
 */
function updateProjectDetailsDescriptionOnEnter() {
    $("#projectDetailsDescription").keypress(function (event) {
        if (event.keyCode === 13) {
            event.preventDefault();

            let projectId = $("#currentProject").data("projectId");
            let projectDescription = $(this).val();
            setProjectDescriptionInDatabase(projectId, projectDescription);

            $(this).blur();
        }
    });
}

/** Update the project name in the database and current view when the project details
 * name text box loses focus. Don't allow a blank name
 */
function updateProjectDetailsNameOnFocusOut() {
    $("#projectDetailsName").focusout(function () {
        let projectId = $("#currentProject").data("projectId");
        let projectName = $(this).val();

        if (projectName != "") {
            setProjectNameInDatabase(projectId, projectName);
            $("#currentProjectName").html(projectName);
        }
    });
}

/** Update the project decription in the database and show the placeholder text
 * if none is supplied when the project details description text box loses focus
 */
function updateProjectDetailsDescriptionOnFocus() {
    $("#projectDetailsDescription").focus(function () {
        if ($(this).val() == "Add a description to this project") {
            $(this).val("");
            $(this).css("color", "black");
        }
    });
    $("#projectDetailsDescription").focusout(function () {
        let projectId = $("#currentProject").data("projectId");
        let projectDescription = null;

        if ($(this).val() == "") {
            $(this).val("Add a description to this project");
            $(this).css("color", "#9e9e9e");
        } else {
            projectDescription = $(this).val();
        }

        setProjectDescriptionInDatabase(projectId, projectDescription);
    });
}

/** Toggle the due date selection container of a project's details view between
 * open and closed when the project details due date is clicked
 */
function toggleProjectDetailsDueDateSelectionContainerOnClick() {
    let button = $("#projectDetailsDueDate");
    button.click(function () {
        console.log("click");
        let xOffset = button.offset().left;
        let yOffset = button.offset().top + button.outerHeight();
        toggleDueDateSelectionContainer(xOffset, yOffset);

        setUpCalendarClickEvents(projectDetailsCalendarDateOnClick);
    });
}

/** Update the database and project details view when a calendar date is clicked
 * in the project details view
 * 
 * @param {object} calendarDate The calendar date
 */
function projectDetailsCalendarDateOnClick(calendarDate) {
    let day = calendarDate.data("day");
    let month = calendarDate.data("month");
    let year = calendarDate.data("year");
    let projectId = $("#currentProject").data("projectId");

    setProjectDueDateInDatabase(projectId, day, month + 1, year);

    let dueDate = new Date(year, month, day);
    updateProjectDetailsViewDueDateHtml(dueDate);
};

/** Removes the due date from the project in the database and the details view
 * when the the remove due date button is clicked in the project details view
 */
function removeProjectDueDateOnClick() {
    let button = $("#projectDetailsDueDate .project-details-remove-button");
    button.click(function () {
        let projectId = $("#currentProject").data("projectId");
        setProjectDueDateInDatabase(projectId, -1, -1, -1);

        let minimumDateTime = new Date("0001-01-01T00:00:00Z");
        updateProjectDetailsViewDueDateHtml(minimumDateTime);
    });
}

/** Toggle the owner selection container of a project's details view between
 * open and closed when the project details owner is clicked
 */
function toggleProjectDetailsOwnerSelectionContainerOnClick() {
    let button = $("#projectDetailsOwner");
    button.click(function () {
        let xOffset = button.offset().left;
        let yOffset = button.offset().top + button.outerHeight();
        toggleUserSelectionContainer(xOffset, yOffset);

        reloadUserSearchResultsOnInput(projectDetailsOwnerSearchResultOnClick, true);
    });
}

/** Updates the database and project details view when an owner search result is
 * clicked in the project details view
 * 
 * @param {object} searchResult The owner search result
 */
function projectDetailsOwnerSearchResultOnClick(searchResult) {
    let userId = searchResult.data("userId");
    let projectId = $("#currentProject").data("projectId");

    setProjectOwnerInDatabase(projectId, userId);

    let userName = searchResult.find(".user-search-result-name").html();
    let firstName = userName.split(" ")[0];
    let lastName = userName.split(" ")[1];

    updateProjectDetailsViewOwnerHtml(userId, firstName, lastName);
};

/** Toggle the team member selection container of the project details view
 * between open and closed when the add team member button is clicked
 */
function toggleProjectDetailsTeamMemberSelectionContainerOnClick() {
    let button = $("#projectDetailsAddTeamMemberButton");
    button.click(function () {
        let xOffset = button.offset().left;
        let yOffset = button.offset().top + button.outerHeight();
        toggleUserSelectionContainer(xOffset, yOffset);

        reloadUserSearchResultsOnInput(projectDetailsTeamMemberSearchResultOnClick, false);
    });
}

/** Add the team member to the database and project details view when a team
 * member search result is clicked
 * 
 * @param {object} searchResult The user search result
 */
function projectDetailsTeamMemberSearchResultOnClick(searchResult) {
    let userId = searchResult.data("userId");
    let projectId = $("#currentProject").data("projectId");
    console.log(projectId);

    if ($("#projectDetailsOwner").data("userId") != userId &&
        checkIfProjectDetailsHasTeamMember(userId) == false) {

        addProjectTeamMemberInDatabase(projectId, userId);

        let userName = searchResult.find(".user-search-result-name").html();
        let firstName = userName.split(" ")[0];
        let lastName = userName.split(" ")[1];
        addTeamMemberHtmlToProjectDetailsView(userId, firstName, lastName);
    }
};

/** Remove the team member from the project details view when its remove button
 * is clicked
 */
function removeProjectDetailsViewTeamMemberOnClick() {
    let projectId = $("#currentProject").data("projectId");
    $(".project-details-team-member").each(function () {
        let teamMember = $(this);
        let userId = teamMember.data("userId");
        let button = teamMember.find(".project-details-remove-button");
        button.off("click");
        button.click(function () {
            removeProjectTeamMemberInDatabase(projectId, userId);
            teamMember.remove();
        })
    });
}

/** Check if the project has a team member with the matching ID
 * 
 * @param {number} userId The ID of the team member being checked for
 * @returns {boolean} True if the project details has the team member, false otherwise
 */
function checkIfProjectDetailsHasTeamMember(userId) {
    let hasTeamMember = false
    $(".project-details-team-member").each(function () {
        if (userId == $(this).data("userId")) {
            hasTeamMember = true;
        }
    });
    return hasTeamMember;
}

/** Toggle the tag selection container of the project details view between open
 * and closed when the add tag button is clicked
 */
function toggleProjectDetailsTagSelectionContainerOnClick() {
    let button = $("#projectDetailsAddTagButton");
    button.click(function () {
        let xOffset = button.offset().left;
        let yOffset = button.offset().top + button.outerHeight();
        toggleTagSelectionContainer(xOffset, yOffset);
    });
}

/** Add a new tag to the database and project details view when the create tag
 * button is pressed
 */
function projectDetailsCreateTagButtonOnClick() {
    let button = $("#createTagButton");
    button.click(function () {
        let projectId = $("#currentProject").data("projectId");
        let name = button.html();
        name = name.slice(name.indexOf("'") + 1, -1);

        let tagId = null;
        let ajaxRequest = $.ajax({
            type: "POST",
            url: "/Tag/New",
            data: { projectId: projectId, name: name },
            success: function (id) {
                tagId = id;
            }
        });

        $.when(ajaxRequest).done(function () {
            $("#createTagButton").html("+ Create tag named ''");
            $("#tagSearchBox").val("");
            addTagHtmltoProjectDetailsView(tagId, name, 0);

            let tag = findProjectDetailsTagWithId(tagId);
            let containerTopOffset = tag.offset().top + tag.outerHeight();
            let containerLeftOffset = tag.offset().left;
            toggleTagColorSelectionContainer(containerLeftOffset, containerTopOffset);
            $("#tagColorSelectionContainer").data("tagId", tagId);
        });
    });
}

/** Remove the tag from the project details view when its remove button is
 * clicked
 */
function removeProjectDetailsViewTagOnClick() {
    $(".project-details-tag").each(function () {
        let tag = $(this);
        let tagId = tag.data("tagId");
        let button = tag.find(".project-details-tag-remove-button");
        button.off("click");
        button.click(function () {
            removeTagFromDatabase(tagId);
            tag.remove();
        })
    });
}

/** Update the tag color in the database and project details view when a tag
 * color option is clicked
 */
function projectDetailsTagColorOnClick() {
    let colorContainer = $("#tagColorSelectionContainer");
    colorContainer.find(".color-option").each(function () {
        $(this).off("click");
        let colorIndex = $(this).data("colorIndex");
        $(this).click(function () {
            let tagId = colorContainer.data("tagId");
            toggleTagColorSelectionContainer(0, 0);
            setTagColorIndexInDatabase(tagId, colorIndex);

            updateProjectDetailsViewTagColor(tagId, colorIndex);
        });
    });
}

/** Find the tag with the matching ID in the project details view
 * 
 * @param {number} tagId The ID of the tag you want to find
 * @returns {object} The tag you want to find
 */
function findProjectDetailsTagWithId(tagId) {
    let tag = null;
    $(".project-details-tag").each(function () {
        if ($(this).data("tagId") == tagId) {
            tag = $(this);
        }
    });
    return tag;
}