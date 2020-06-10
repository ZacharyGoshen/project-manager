/** Adds a new tag to the database
 * 
 * @param {string} tagName The name of the tag
 * @param {number} projectId The ID of project the tag belongs to
 * @param {number} taskId The ID of the task that is getting the tag
 */
function addTagToDatabase(tagName, taskId, projectId) {
    $.ajax({
        type: "POST",
        url: "/Tag/New",
        data: { tagName: tagName, taskId: taskId, projectId: projectId }
    });
}

/** Sets the color index of a tag in the database
 * 
 * @param {number} tagId The ID of the tag
 * @param {number} colorIndex The index of the tag's color
 */
function setTagColorIndexInDatabase(tagId, colorIndex) {
    $.ajax({
        type: "POST",
        url: "/Tag/SetColorIndex",
        data: { tagId: tagId, colorIndex: colorIndex }
    });
}