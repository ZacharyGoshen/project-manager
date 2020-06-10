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
