/** Add the new category when the enter key is pressed within the new category form
 */
function addNewBoardCategoryOnEnter() {
    $("#newCategoryNameTextBox").keypress(function (event) {
        if (event.keyCode === 13) {
            let projectId = $("#currentProjectName").data("projectId");
            let categoryName = $(this).val();
            let categoryIndex = $(this).parent().data("categoryIndex");
            event.preventDefault();
            $.ajax({
                type: "POST",
                url: "/Home/NewCategory",
                data: { projectId: projectId, categoryName: categoryName },
                success: function (categoryId) {
                    let newCategoryHtml = generateNewBoardCategoryHtml(categoryId, categoryName, categoryIndex);
                    insertCategoryInBoard(newCategoryHtml, categoryIndex);
                    setUpBoardCategoryEventListeners(findBoardCategoryWithId(categoryId));
                    toggleNewBoardCategoryForm();
                }
            });
        }
    });
}

/** Toggle the new category form between open and closed and move the cursor
 * to the form if opened
 */
function toggleNewBoardCategoryForm() {
    let newCategoryForm = $("#newCategoryNameTextBox");
    let newCategoryButton = $("#addBoardCategoryButton");

    if (newCategoryForm.hasClass("hidden")) {
        newCategoryButton.addClass("hidden");
        newCategoryForm.removeClass("hidden");
        newCategoryForm.focus();
        newCategoryForm.select();
    } else {
        newCategoryButton.removeClass("hidden");
        newCategoryForm.addClass("hidden");
        newCategoryForm.blur();
        newCategoryForm.val("");
    }
}

/** Generate the html of a new board category
 * 
 * @param {number} categoryId The ID of the new category
 * @param {string} categoryName The name of the new category
 * @param {number} categoryIndex The index of the new category
 */
function generateNewBoardCategoryHtml(categoryId, categoryName, categoryIndex) {
    return `
        <div class="board-category" data-category-id="` + categoryId + `" data-category-index="` + categoryIndex + `">
            <div class="board-category-header">
                <div class="board-category-name">` + categoryName + `</div>
                <button class="board-category-delete-button" type="button" onclick="deleteBoardCategory(` + categoryId + `)">x</button>
            </div>
            <div class="board-new-task-button-container">
                <button class="add-task-to-board-button" onclick="toggleNewTaskForm(` + categoryIndex + `)">+</button>
            </div>
            <div class="new-board-task-container hidden">
                <textarea class="new-board-task-text-box"></textarea>
            </div>

            <div class="board-task-container">
                <div class="board-task-drop-area" data-task-index="0"></div>
                <div class="board-task-container-extra-height"></div>
            </div>
        </div>
        `;
}

/** Insert a category and its drop area's html into the board and increment
 * the indices of all the categories and drop areas to the right of it
 * 
 * @param {string} categoryToInsert The HTML of the task that is being inserted
 */
function insertCategoryInBoard(categoryToInsert, destinationIndex) {
    $(".board-category").each(function () {
        let category = $(this);
        let categoryIndex = category.data("categoryIndex");
        if (categoryIndex >= destinationIndex) {
            category.data("categoryIndex", categoryIndex + 1);
        }
    });

    $(".board-category-drop-area").each(function () {
        let dropArea = $(this);
        let dropAreaIndex = dropArea.data("categoryIndex");
        if (dropAreaIndex >= destinationIndex) {
            dropArea.data("categoryIndex", dropAreaIndex + 1);
        }
    });

    let dropAreaToInsert = `<div class="board-category-drop-area" data-category-index="` + destinationIndex + `"></div>`;

    if (destinationIndex == 0) {
        let categoryContainer = $("#boardCategoryContainer");
        categoryContainer.prepend(categoryToInsert);
        categoryContainer.prepend(dropAreaToInsert);
    } else {
        let categoryToLeft = $(".board-category").eq(destinationIndex - 1);
        categoryToLeft.after(categoryToInsert);
        categoryToLeft.after(dropAreaToInsert);
    }
}