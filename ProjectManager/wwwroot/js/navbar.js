/** Create a new project and refresh the page when the enter key is pressed in
 * the new project text box
 */
function createNewProjectOnEnter() {
    let searchBox = $("#newProjectTextBox");
    $(searchBox).keydown(function (event) {
        if (event.keyCode === 13) {
            let userId = $("#loggedInUser").data("userId");
            let projectName = searchBox.val();
            let ajaxRequest = addProjectToDatabase(userId, projectName);

            $.when(ajaxRequest).done(function () {
                window.location.href = "/Home/Board";
            });
        }
    });
}