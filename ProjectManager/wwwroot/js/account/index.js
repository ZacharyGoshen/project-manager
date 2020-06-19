/** Open the account view
 */
function openAccountView() {
    toggleUserDropDownMenu();

    let backgroundBlur = $("#accountBackgroundBlur");
    let container = $("#accountContainer");

    backgroundBlur.removeClass("hidden");
    container.removeClass("hidden");

    backgroundBlur.innerHeight(window.innerHeight);
    backgroundBlur.innerWidth(window.innerWidth);
    backgroundBlur.offset({ top: 0, left: 0 });

    let containerTopOffset = (window.innerHeight / 2) - (container.outerHeight() / 2);
    let containerLeftOffset = (window.innerWidth / 2) - (container.outerWidth() / 2);
    container.offset({ top: containerTopOffset, left: containerLeftOffset });
}

/** Close the account view */
function closeAccountView() {
    $("#accountBackgroundBlur").addClass("hidden");
    $("#accountContainer").addClass("hidden");
}

/** Update the user's account info in the database and refresh the page
 */
function updateAccountInfo() {
    $("#accountInfoErrorMessage").addClass("hidden");
    let userId = $("#loggedInUser").data("userId");

    let firstName = $("#accountFirstName").val();
    let lastName = $("#accountLastName").val();
    let email = $("#accountEmail").val();
    if (checkIfFirstNameIsValid(firstName) == false) {
        $("#accountInfoErrorMessage").html("Invalid first name.")
        $("#accountInfoErrorMessage").removeClass("hidden");
        return;
    } else if (checkIfLastNameIsValid(lastName) == false) {
        $("#accountInfoErrorMessage").html("Invalid last name.")
        $("#accountInfoErrorMessage").removeClass("hidden");
        return;
    } else if (checkIfEmailIsValid(email) == false) {
        $("#accountInfoErrorMessage").html("Invalid email.")
        $("#accountInfoErrorMessage").removeClass("hidden");
        return;
    } else {
        let userWithEmail = null;
        let ajaxRequest = $.ajax({
            type: "POST",
            url: "/User/GetWithEmail",
            data: { email: email },
            success: function (user) {
                userWithEmail = user;
            }
        });

        $.when(ajaxRequest).done(function () {
            if (userWithEmail && userWithEmail.userId != userId) {
                $("#accountInfoErrorMessage").html("User already exists with that email.")
                $("#accountInfoErrorMessage").removeClass("hidden");
            } else {
                let ajaxRequest1 = setUserFirstNameInDatabase(userId, firstName);

                let ajaxRequest2 = null
                $.when(ajaxRequest1).done(function () {
                    ajaxRequest2 = setUserLastNameInDatabase(userId, lastName);
                });

                let ajaxRequest3 = null
                $.when(ajaxRequest2).done(function () {
                    ajaxRequest3 = setUserEmailInDatabase(userId, email);
                });

                $.when(ajaxRequest3).done(function () {
                    location.reload();
                });
            }
        });
    }
}

/** Change the user's password in the database and refresh the page
 */
function changePassword() {
    $("#accountPasswordErrorMessage").addClass("hidden");
    let userId = $("#loggedInUser").data("userId");

    let currentPassword = $("#accountCurrentPassword").val();
    let newPassword = $("#accountNewPassword").val();
    let confirmedPassword = $("#accountConfirmedPassword").val();
    if (checkIfPasswordIsValid(currentPassword) == false) {
        $("#accountPasswordErrorMessage").html(`
            Invalid current password. Password must have 8 - 128 alphanumeric
            characters and / or special characters #?!@$%^&* -.
        `);
        $("#accountPasswordErrorMessage").removeClass("hidden");
        return;
    } else if (checkIfPasswordIsValid(newPassword) == false) {
        $("#accountPasswordErrorMessage").html(`
            Invalid new password. Password must have 8 - 128 alphanumeric
            characters and / or special characters #?!@$%^&* -.
        `);
        $("#accountPasswordErrorMessage").removeClass("hidden");
        return;
    } else if (newPassword == currentPassword) {
        $("#accountPasswordErrorMessage").html("Password can not be the same as before.")
        $("#accountPasswordErrorMessage").removeClass("hidden");
        return;
    } else if (newPassword != confirmedPassword) {
        $("#accountPasswordErrorMessage").html("Passwords do not match.")
        $("#accountPasswordErrorMessage").removeClass("hidden");
        return;
    } else {
        let authenticationResult = null;
        let ajaxRequest = $.ajax({
            type: "POST",
            url: "/User/Authenticate",
            data: { userId: userId, password: currentPassword },
            success: function (result) {
                authenticationResult = result;
            }
        });

        $.when(ajaxRequest).done(function () {
            if (authenticationResult == true) {
                ajaxRequest = $.ajax({
                    type: "POST",
                    url: "/User/SetPassword",
                    data: { userId: userId, password: newPassword },
                    success: function () {
                        location.reload();
                    }
                });
            } else {
                $("#accountPasswordErrorMessage").html("Current password is incorrect.")
                $("#accountPasswordErrorMessage").removeClass("hidden");
            }
        });
    }
}