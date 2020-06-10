/** Remove a category and its drop area from the board and decrement the
 * indices of all the categories and drop areas to the right of it
 *
 * @param {number} categoryId The ID of the category being removed
 */
function removeCategoryHtmlFromBoard(categoryId) {
    let categoryToRemove = findBoardCategoryWithId(categoryId);
    let categoryToRemoveIndex = categoryToRemove.data("categoryIndex");
    let dropAreaToRemove = categoryToRemove.parent().find(".board-category-drop-area").eq(categoryToRemoveIndex);

    categoryToRemove.parent().find(".board-category").each(function () {
        let category = $(this);
        let categoryIndex = category.data("categoryIndex");
        if (categoryIndex > categoryToRemoveIndex) {
            category.data("categoryIndex", categoryIndex - 1);
        }
    });

    categoryToRemove.parent().find(".board-category-drop-area").each(function () {
        let dropArea = $(this);
        let dropAreaIndex = dropArea.data("categoryIndex");
        if (dropAreaIndex > categoryToRemoveIndex) {
            dropArea.data("categoryIndex", dropAreaIndex - 1);
        }
    });

    categoryToRemove.remove();
    dropAreaToRemove.remove();
}

/** Remove the selected category if it has no tasks. Otherwise display an error
 *
 * @param {any} categoryId The ID of the category being removed
 */
function deleteBoardCategory(categoryId) {
    let category = findBoardCategoryWithId(categoryId);
    let numberOfTasksInCategory = category.find(".board-task").length;

    if (numberOfTasksInCategory == 0) {
        deleteCategoryInDatabase(categoryId);
        removeCategoryHtmlFromBoard(categoryId);
    } else {
        showRemoveNotEmptyCategoryWarning(category)
    }
}

/** Display a warning below the delete category button telling the user they
 * can not delete a category that still has tasks in it
 * 
 * @param {object} category The category that the user attempted to delete
 */
function showRemoveNotEmptyCategoryWarning(category) {
    let deleteButton = category.find(".board-category-delete-button");
    let buttonCoordinates = deleteButton.offset();
    let buttonHeight = deleteButton.height();
    let alert = $("#removeBoardCategoryAlert");
    alert.removeClass("hidden");
    alert.offset({ top: buttonCoordinates.top + buttonHeight, left: buttonCoordinates.left });
}