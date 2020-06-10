/** Find the board category with the matching ID
 * 
 * @param {number} categoryId The ID of the category you want to find
 * @returns {object} The category you want to find
 */
function findBoardCategoryWithId(categoryId) {
    let category = null;
    $(".board-category").each(function () {
        if ($(this).data("categoryId") == categoryId) {
            category = $(this);
        }
    });
    return category;
}

/** Find the board task with the matching ID
 * 
 * @param {number} taskId The ID of the task you want to find
 * @returns {object} The task you want to find
 */
function findBoardTaskWithId(taskId) {
    let task = null;
    $(".board-task").each(function () {
        if ($(this).data("taskId") == taskId) {
            task = $(this);
        }
    });
    return task;
}

/** Find the tag with the matching ID in the board view
 *
 * @param {object} taskId The ID of the task the tag belongs to
 * @param {number} tagId The ID of the tag you want to find
 * @returns {object} The tag you want to find
 */
function findBoardTaskTagWithId(taskId, tagId) {
    let task = findBoardTaskWithId(taskId);
    if (task == null) {
        return null;
    }

    let tag = null;
    task.find(".board-task-tag").each(function () {
        if ($(this).data("tagId") == tagId) {
            tag = $(this);
        }
    });
    return tag;
}