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

/** Toggle the user drop down menu between open and closed
 */
function toggleUserDropDownMenu() {
    let menu = $("#userDropDownMenu");
    if (menu.hasClass("hidden")) {
        menu.removeClass("hidden");
        let button = $("#loggedInUser");
        let menuTopOffset = button.offset().top + button.outerHeight() + 5;
        let menuLeftOffset = button.offset().left + button.outerWidth() - menu.outerWidth();
        menu.offset({ top: menuTopOffset, left: menuLeftOffset });
    } else {
        menu.addClass("hidden");
    }
}