﻿let currentView = "";

/** Removes focus from and element when clicking outside of a given set of
 * elements
 *
 * @param {object} element The element that will lose its focus
 * @param {object} selectors The array of jquery selectors
 */
function removeFocusOnClickOutside(element, selectors) {
    $(document).click(function (event) {
        for (let i = 0; i < selectors.length; i++) {
            if (getElementHovered(event, selectors[i])) {
                return;
            }
        }
        element.blur();
    });
}

/** Shows an element after focusing a given element
 *
 * @param {object} hiddenElement The element that will become visibile
 * @param {object} focusedElement The element that is focused
 */
function showElementOnFocus(hiddenElement, focusedElement) {
    $(focusedElement).focusin(function () {
        $(hiddenElement).removeClass("hidden");
    });
}

/** Shows an element when clicking outside of a set of elements defined by the
 * given jquery selector strings
 *
 * @param {object} element The element that will become visible
 * @param {object} selectorStrings The array of jquery selector strings
 */
function showElementOnClickOutside(element, selectorStrings) {
    $(document).click(function (event) {
        for (let i = 0; i < selectorStrings.length; i++) {
            if (getElementHovered(event, $(selectorStrings[i]))) {
                return;
            }
        }
        element.removeClass("hidden");
    });
}

/** Hides an element when clicking outside of a set of elements defined by the
 * given jquery selector strings
 *
 * @param {object} element The element that will become hidden
 * @param {object} selectorStrings The array of jquery selector strings
 */
function hideElementOnClickOutside(element, selectorStrings) {
    $(document).click(function (event) {
        for (let i = 0; i < selectorStrings.length; i++) {
            if (getElementHovered(event, $(selectorStrings[i]))) {
                return;
            }
        }
        element.addClass("hidden");
    });
}

/** Checks if the mouse is hovering an element that matches the given jquery
 * selector and returns the first element found
 * 
 * @param {any} event
 * @param {any} selector
 * @returns {object}
 */
function getElementHovered(event, selector) {
    let mouseX = event.clientX;
    let mouseY = event.clientY;

    let elementHovered = null;
    selector.each(function () {
        let element = $(this);
        let elementTopOffset = element.offset().top;
        let elementBottomOffset = elementTopOffset + element.outerHeight();
        let elementLeftOffset = element.offset().left;
        let elementRightOffset = elementLeftOffset + element.outerWidth();

        if (
            (mouseX > elementLeftOffset) &&
            (mouseX < elementRightOffset) &&
            (mouseY > elementTopOffset) &&
            (mouseY < elementBottomOffset)
        ) {
            elementHovered = element;
            return;
        }
    });

    return elementHovered;
}

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

/** Update the name of a task in the database
 *
 * @param {number} taskId The ID of the task who's name is being changed
 * @param {string} taskName The task's new name
 */
function changeNameOfTaskInDatabase(taskId, taskName) {
    $.ajax({
        type: "POST",
        url: "/Home/ChangeTaskName",
        data: { taskId: taskId, taskName: taskName }
    });
}

/** Updates the category and index of a task in the database
 * 
 * @param {number} taskId The ID of the task being updated
 * @param {number} newCategoryId The ID of the category the task is being moved to
 * @param {number} newTaskIndex The index in the category the task is being moved to
 */
function moveTaskInDatabase(taskId, newCategoryId, newTaskIndex) {
    $.ajax({
        type: "POST",
        url: "/Home/MoveTask",
        data: { taskId: taskId, newCategoryId: newCategoryId, newTaskIndex: newTaskIndex }
    });
}

/** Updates the due date of a task in the database
 * 
 * @param {number} taskId The ID of the task being updated
 * @param {number} day The due date day
 * @param {number} month The due date month
 * @param {number} year The due date year
 */
function setDueDateInDatabase(taskId, day, month, year) {
    $.ajax({
        type: "POST",
        url: "/Home/SetDueDate",
        data: { taskId: taskId, day: day, month: month + 1, year: year }
    });
}

/** Updates the assigned user of a task in the database
 * 
 * @param {number} taskId The ID of the task being updated
 * @param {number} userId The ID of the user being assigned to the task
 */
function assignUserToTaskInDatabase(taskId, userId) {
    $.ajax({
        type: "POST",
        url: "/Home/AssignUserToTask",
        data: { taskId: taskId, userId: userId }
    });
}

/** Deletes task from the database
 * 
 * @param {number} taskId The ID of the task being deleted
 */
function deleteTaskInDatabase(taskId) {
    $.ajax({
        type: "POST",
        url: "/Home/DeleteTask",
        data: { taskId: taskId }
    });
}



