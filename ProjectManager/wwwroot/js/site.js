let currentView = "";

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

/** Scrolls to the bottom of the given container
 * 
 * @param {object} container The container that will be scrolled
 */
function scrollToBottomOfContainer(container) {
    let scrollHeight = container.get(0).scrollHeight;
    let containerHeight = container.outerHeight();
    container.scrollTop(scrollHeight - containerHeight);
}

/** Converts a UTC string to a UTC Date object
 * 
 * @param {string} utcString A UTC date in string format
 */
function convertUTCStringToUTCDate(utcString) {
    let date = new Date();
    date.setUTCFullYear(utcString.slice(0, 4));
    date.setUTCMonth(utcString.slice(5, 7));
    date.setUTCDate(utcString.slice(8, 10));
    date.setUTCHours(utcString.slice(11, 13));
    date.setUTCMinutes(utcString.slice(14, 16));
    date.setUTCSeconds(utcString.slice(17, 19));

    return date;
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

/** Set the description of a task in the database
 *
 * @param {number} taskId The ID of the task who's description is being set
 * @param {string} taskDescription The task's new description
 */
function setTaskDescriptionInDatabase(taskId, taskDescription) {
    $.ajax({
        type: "POST",
        url: "/Home/SetTaskDescription",
        data: { taskId: taskId, taskDescription: taskDescription }
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
        data: { taskId: taskId, day: day, month: month, year: year }
    });
}

/** Update the assigned user of a task in the database
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



