/** Add a new project to the database
 * 
 * @param {number} userId The ID of the creating user 
 * @param {number} name The name of the project
 */
function addProjectToDatabase(userId, name) {
    let ajaxRequest = $.ajax({
        type: "POST",
        url: "/Project/New",
        data: { userId: userId, name: name }
    });
    return ajaxRequest;
}