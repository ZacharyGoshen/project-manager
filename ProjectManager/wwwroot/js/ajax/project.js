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

