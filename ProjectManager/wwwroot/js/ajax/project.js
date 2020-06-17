/** Add a new project to the database, set it as the current project, and reload
 * the page to display the new project
 * 
 * @param {string} name The name of the project
 * @param {string} description The description of the project
 * @param {number} day The due date day of the project
 * @param {number} month the due date month of the project
 * @param {number} year The due date year of the project
 * @param {number} ownerId The ID of the owner of the project
 * @param {object} teamMemberIds The ID of the team members of the project
 */
function addProjectToDatabase(name, description, day, month, year, ownerId, teamMemberIds) {
    let ajaxRequest = $.ajax({
        type: "POST",
        url: "/Project/New",
        data: { name: name, description: description, day: day, month: month, year: year, ownerId: ownerId, teamMemberIds: teamMemberIds },
        success: function (projectId) {
            $.ajax({
                type: "POST",
                url: "/Project/SetCurrentProject",
                data: { projectId: projectId },
                success: function () {
                    location.reload();
                }
            });
        }
    });
    return ajaxRequest;
}

/** Set the name of a project in the database
 * 
 * @param {number} projectId The ID of the project
 * @param {string} name The name of the project
 */
function setProjectNameInDatabase(projectId, name) {
    let ajaxRequest = $.ajax({
        type: "POST",
        url: "/Project/SetName",
        data: { projectId: projectId, name: name }
    });
    return ajaxRequest;
}

/** Set the description of a project in the database
 * 
 * @param {number} projectId The ID of the project
 * @param {string} description The description of the project
 */
function setProjectDescriptionInDatabase(projectId, description) {
    let ajaxRequest = $.ajax({
        type: "POST",
        url: "/Project/SetDescription",
        data: { projectId: projectId, description: description }
    });
    return ajaxRequest;
}

/** Set the due date of a project in the database
 *
 * @param {number} projectId The ID of the project
 * @param {number} day The day of the due date
 * @param {number} month The month of the due date
 * @param {number} year The year of the due date
 */
function setProjectDueDateInDatabase(projectId, day, month, year) {
    let ajaxRequest = $.ajax({
        type: "POST",
        url: "/Project/SetDueDate",
        data: { projectId: projectId, day: day, month: month, year: year }
    });
    return ajaxRequest;
}

/** Set the owner of a project in the database
 * 
 * @param {number} projectId The ID of the project
 * @param {number} userId The ID of the owner of the project
 */
function setProjectOwnerInDatabase(projectId, userId) {
    let ajaxRequest = $.ajax({
        type: "POST",
        url: "/Project/SetOwner",
        data: { projectId: projectId, userId: userId }
    });
    return ajaxRequest;
}

/** Add a team member to a project in the database
 * 
 * @param {number} projectId The ID of the project
 * @param {number} userId The ID of the team member
 */
function addProjectTeamMemberInDatabase(projectId, userId) {
    let ajaxRequest = $.ajax({
        type: "POST",
        url: "/Project/AddTeamMember",
        data: { projectId: projectId, userId: userId }
    });
    return ajaxRequest;
}

/** Remove a team member from a project in the database
 * 
 * @param {number} projectId The ID of the project
 * @param {number} userId The ID of the team member
 */
function removeProjectTeamMemberInDatabase(projectId, userId) {
    let ajaxRequest = $.ajax({
        type: "POST",
        url: "/Project/RemoveTeamMember",
        data: { projectId: projectId, userId: userId }
    });
    return ajaxRequest;
}

