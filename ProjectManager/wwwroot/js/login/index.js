onLoginViewLoad();

/** Set up the remainder of the login page's html and event listeners once the
 * document has finished loading
 */
function onLoginViewLoad() {
    $(document).ready(function () {
        centerLoginTitle();
        centerLoginContainer();
        setUpLoginButtonClickEvent();
    });
}

/** Position the login page title in the top middle of the screen
 */
function centerLoginTitle() {
    let container = $("#loginViewSoftwareTitle");
    let containerTop = (window.innerHeight / 8) - (container.outerHeight() / 2);
    let containerLeft = (window.innerWidth / 2) - (container.outerWidth() / 2);
    container.offset({ top: containerTop, left: containerLeft });
}

/** Position the login page container in the middle of the screen
 */
function centerLoginContainer() {
    let container = $("#userLoginContainer");
    let containerTop = (window.innerHeight / 2) - (container.outerHeight() / 2);
    let containerLeft = (window.innerWidth / 2) - (container.outerWidth() / 2);
    container.offset({ top: containerTop, left: containerLeft });
}

/** Set up what happens when the login button is clicked
 */
function setUpLoginButtonClickEvent() {
    $("#loginViewLoginButton").click(function () {
        let email = $("#userLoginEmail").val();
        let password = $("#userLoginPassword").val();

        logInUser(email, password);
    });
}