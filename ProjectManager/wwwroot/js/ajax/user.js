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
            }
        }
    });
}

/** Log out the user and redirect to the login view
 */
function logOutUser() {
    console.log("called");
    $.ajax({
        type: "POST",
        url: "/User/LogOut",
        success: function () {
            window.location.href = "/Home/Login";
        }
    });
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
