/** Adds a new comment to the database
 * 
 * @param {string} text The text of the comment
 * @param {number} taskId The ID of the task the comment belongs to
 * @param {number} userId The ID of user who made the comment
 */
function addCommentToDatabase(text, taskId, userId) {
    $.ajax({
        type: "POST",
        url: "/Comment/New",
        data: { text: text, taskId: taskId, userId: userId }
    });
}