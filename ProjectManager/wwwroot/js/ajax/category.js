/** Updates the index of a category in the database
 * 
 * @param {number} categoryId The ID of the task being updated
 * @param {number} newIndex The index the category is being moved to
 */
function moveCategoryInDatabase(categoryId, newIndex) {
    $.ajax({
        type: "POST",
        url: "/Home/MoveCategory",
        data: { categoryId: categoryId, newIndex: newIndex }
    });
}

/** Deletes category from the database
 *
 * @param {number} taskId The ID of the category being deleted
 */
function deleteCategoryInDatabase(categoryId) {
    $.ajax({
        type: "POST",
        url: "/Home/DeleteCategory",
        data: { categoryId: categoryId }
    });
}