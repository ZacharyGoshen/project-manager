onSignupViewLoad();

/** Set up the remainder of the signup page's html and event listeners once the
 * document has finished loading
 */
function onSignupViewLoad() {
    $(document).ready(function () {
        centerSignupTitle();
        centerSignupContainer();
        setUpSignupButtonClickEvent();
    });
}

/** Position the signup page title in the top middle of the screen
 */
function centerSignupTitle() {
    let container = $("#signupViewSoftwareTitle");
    let containerTop = (window.innerHeight / 8) - (container.outerHeight() / 2);
    let containerLeft = (window.innerWidth / 2) - (container.outerWidth() / 2);
    container.offset({ top: containerTop, left: containerLeft });
}

/** Position the signup page container in the middle of the screen
 */
function centerSignupContainer() {
    let container = $("#userSignupContainer");
    let containerTop = (window.innerHeight / 2) - (container.outerHeight() / 2);
    let containerLeft = (window.innerWidth / 2) - (container.outerWidth() / 2);
    container.offset({ top: containerTop, left: containerLeft });
}

/** Set up what happens when the signup button is clicked
 */
function setUpSignupButtonClickEvent() {
    $("#signupViewSignupButton").click(function () {
        let firstName = $("#userSignupFirstName").val();
        let lastName = $("#userSignupLastName").val();
        let email = $("#userSignupEmail").val();
        let password = $("#userSignupPassword").val();
        let confirmPassword = $("#userSignupConfirmPassword").val();

        if (password != confirmPassword) {
            return;
        } else {
            signUpUser(firstName, lastName, email, password);
        }
    });
}