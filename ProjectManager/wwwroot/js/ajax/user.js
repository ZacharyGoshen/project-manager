/** Attempt to create a new user and redirect to the board view if successful
 * 
 * @param {string} firstName The user's first name
 * @param {string} lastName The user's last name
 * @param {string} email The user's email
 * @param {string} password The user's password
 */
function signUpUser(firstName, lastName, email, password) {
    $.ajax({
        type: "POST",
        url: "/User/New",
        data: { firstName: firstName, lastName: lastName, email: email, password: password },
        success: function (result) {
            if (result == "success") {
                window.location.href = "/Home/Board";
            } else {
                $("#signupErrorMessage").html("A user already exists with this email.");
                $("#signupErrorMessage").removeClass("hidden");
            }
        }
    });
}

/** Attempt to log in the user and redirect to the board view if successful
 * 
 * @param {string} email The user's email
 * @param {string} password The user's password
 */
function logInUser(email, password) {
    $.ajax({
        type: "POST",
        url: "/User/LogIn",
        data: { email: email, password: password },
        success: function (result) {
            if (result == "success") {
                window.location.href = "/Home/Board";
            } else {
                $("#loginErrorMessage").html("The username or password is not correct.");
                $("#loginErrorMessage").removeClass("hidden");
            }
        }
    });
}

/** Log out the user and redirect to the login view
 */
function logOutUser() {
    $.ajax({
        type: "POST",
        url: "/User/LogOut",
        success: function () {
            window.location.href = "/Home/Login";
        }
    });
}

/** Set the first name of a user in the database
 * 
 * @param {number} userId The ID of the user
 * @param {any} firstName The new first name of the user
 */
function setUserFirstNameInDatabase(userId, firstName) {
    let ajaxRequest = $.ajax({
        type: "POST",
        url: "/User/SetFirstName",
        data: { userId: userId, firstName: firstName }
    });
    return ajaxRequest;
}

/** Set the last name of a user in the database
 * 
 * @param {number} userId The ID of the user
 * @param {any} lastName The new last name of the user
 */
function setUserLastNameInDatabase(userId, lastName) {
    let ajaxRequest = $.ajax({
        type: "POST",
        url: "/User/SetLastName",
        data: { userId: userId, lastName: lastName }
    });
    return ajaxRequest;
}

/** Set the email of a user in the database
 * 
 * @param {number} userId The ID of the user
 * @param {any} email The new email of the user
 */
function setUserEmailInDatabase(userId, email) {
    let ajaxRequest = $.ajax({
        type: "POST",
        url: "/User/SetEmail",
        data: { userId: userId, email: email }
    });
    return ajaxRequest;
}

/** Remove an assigned task from a user in the database
 *  
 * @param {number} taskId The ID of the task
 * @param {number} userId The ID of the user
 */
function removeAssignedTaskFromUserInDatabase(taskId, userId) {
    $.ajax({
        type: "POST",
        url: "/User/RemoveAssignedTask",
        data: { taskId: taskId, userId: userId }
    });
}
