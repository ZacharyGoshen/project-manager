/** Adds a new tag to the database
 * 
 * @param {number} projectId The ID of project the tag belongs to
 * @param {string} name The name of the tag
 */
function addTagToDatabase(projectId, name) {
    $.ajax({
        type: "POST",
        url: "/Tag/New",
        data: { projectId: projectId, name: name }
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

/** Adds a new tag to the database
 * 
 * @param {number} tagId The ID of the tag
 */
function removeTagFromDatabase(tagId) {
    $.ajax({
        type: "POST",
        url: "/Tag/Remove",
        data: { tagId: tagId }
    });
}