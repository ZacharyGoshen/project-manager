onLoginViewLoad();

/** Set up the remainder of the login page's html and event listeners once the
 * document has finished loading
 */
function onLoginViewLoad() {
    $(document).ready(function () {
        centerLoginContainer();
        centerLoginTitle();
        setUpLoginButtonClickEvent();
        setUpSignupButtonClickEvent();
    });
}

/** Position the login page container in the middle of the screen
 */
function centerLoginContainer() {
    let container = $("#userLoginContainer");
    let containerTop = (window.innerHeight / 2) - (container.outerHeight() / 2);
    let containerLeft = (window.innerWidth / 2) - (container.outerWidth() / 2);
    container.offset({ top: containerTop, left: containerLeft });
}

/** Position the login page title in the top middle of the screen
 */
function centerLoginTitle() {
    let title = $("#loginViewSoftwareTitle");
    let container = $("#userLoginContainer");
    let titleTop = container.offset().top - title.outerHeight() - 10;
    let titleLeft = (window.innerWidth / 2) - (title.outerWidth() / 2);
    title.offset({ top: titleTop, left: titleLeft });
}

/** Set up what happens when the login button is clicked
 */
function setUpLoginButtonClickEvent() {
    $("#loginButton").click(function () {
        let email = $("#userLoginEmail").val();
        let password = $("#userLoginPassword").val();

        $("#loginErrorMessage").html("");
        $("#loginErrorMessage").addClass("hidden");

        if (!checkIfEmailIsValid(email)) {
            $("#loginErrorMessage").html("Invalid email address.");
            $("#loginErrorMessage").removeClass("hidden");
        }
        else if (!checkIfPasswordIsValid(password)) {
            $("#loginErrorMessage").html(`
                Password must have 8-128 alphanumeric characters and/or special
                characters #?!@$%^&*-.
            `);
            $("#loginErrorMessage").removeClass("hidden");
        } else {
            logInUser(email, password);
        }
    });
}

/** Set up what happens when the signup button is clicked
 */
function setUpSignupButtonClickEvent() {
    $("#signupButton").click(function () {
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