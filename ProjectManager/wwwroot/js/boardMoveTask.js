/** Allows the user to drag and move a board task to another location when mouse
 * button is held down over a board task
 * 
 * @param {object} task The task being dragged
 */
function startBoardTaskDragOnMouseDown(task) {
    let taskId = task.data("taskId");
    task.mousedown(function (mouseDownEvent) {
        mouseDownEvent.preventDefault();

        let mouseClickX = mouseDownEvent.pageX;
        let mouseClickY = mouseDownEvent.pageY;
        let xOffsetDifference = mouseDownEvent.pageX - task.offset().left;
        let yOffsetDifference = mouseDownEvent.pageY - task.offset().top;

        $(document).on("mousemove.moveTask", function (mouseMoveEvent) {
            if (taskBeingDragged || Math.abs(mouseClickX - mouseMoveEvent.pageX) > 5 || Math.abs(mouseClickY - mouseMoveEvent.pageY) > 5) {
                let scrollTops = getScrollTopsOfCategories();
                if (!taskBeingDragged) {
                    taskBeingDragged = true;
                    copyDraggedTask(task);
                    hideBoardViewPopUps();
                    removeBoardTaskHtmlFromCategory(taskId);
                    setSizeAndPositionOfTaskDropAreas();
                }

                $("#draggedTaskCopy").offset({
                    top: (mouseMoveEvent.pageY - yOffsetDifference),
                    left: (mouseMoveEvent.pageX - xOffsetDifference)
                });

                setUpTaskContainerScroll(mouseMoveEvent);
                setUpCategoryContainerScroll(mouseMoveEvent);
                onBoardTaskDraggedOverDropArea(mouseMoveEvent, scrollTops);
            }
        });
    });
}

/** Sets up what happens when a task is dragged over a drop area
 * 
 * @param {object} event The mouse move event that triggered this function
 * @param {object} scrollTops How far each task container was scrolled down before the event
 */
function onBoardTaskDraggedOverDropArea(event, scrollTops) {
    let dropAreaHovered = getElementHovered(event, $(".board-task-drop-area"));
    if (dropAreaHovered) {
        let hoveredCategoryIndex = dropAreaHovered.parent().parent().data("categoryIndex");
        let hoveredTaskIndex = dropAreaHovered.data("taskIndex");

        resetTaskMargins();
        makeRoomForBoardTask(hoveredCategoryIndex, hoveredTaskIndex);
        setScrollTopsOfCategories(scrollTops);

        repositionBoardTaskDropAreas(dropAreaHovered);
        repositionTaskDropAreaIndicator(dropAreaHovered);
    }
}

/** Copies the dragged task and displays the contents underneath the mouse
 * 
 * @param {object} taskId The ID of the task being dragged
 */
function copyDraggedTask(draggedTask) {
    $("#draggedTaskCopy").removeClass("hidden");
    $("#draggedTaskCopy").data("categoryId", draggedTask.parent().parent().data("categoryId"));
    $("#draggedTaskCopy").data("categoryIndex", draggedTask.parent().parent().data("categoryIndex"));
    $("#draggedTaskCopy").data("taskId", draggedTask.data("taskId"));
    $("#draggedTaskCopy").data("taskIndex", draggedTask.data("taskIndex"));
    $("#draggedTaskCopy").html(draggedTask.html());
    $("#draggedTaskCopy").offset(draggedTask.offset());
    $("#draggedTaskCopy").width(draggedTask.width());
}

/** Increases the height of an invisible element at the bottom of each scroll
 * container to simulate padding at the bottom of the container
 */
function increaseHeightsOfBoardTaskContainers() {
    let draggedTaskHeight = $("#draggedTaskCopy").outerHeight();
    let draggedTaskBottomMargin = parseInt($("#draggedTaskCopy").css("margin-bottom").slice(0, -2));
    let extraHeight = draggedTaskHeight + draggedTaskBottomMargin;

    $(".board-task-container-extra-height").each(function () {
        $(this).outerHeight(extraHeight);
    });
}

/** Removes the height of the invisible element at the bottom of each scroll
 * container
 */
function resetHeightsOfBoardTaskContainers() {
    $(".board-task-container-extra-height").outerHeight(0);
}

/** Sets how far each category is scrolled
 * 
 * @param {object} scrollTops The depths at which each category is scrolled
 */
function setScrollTopsOfCategories(scrollTops) {
    $(".board-task-container").each(function (index) {
        $(this).scrollTop(scrollTops[index]);
        scrollTops.push($(this).scrollTop());
    });
}

/** Gets how far each category is scrolled
 *
 * @returns {object} The depths at which each category is scrolled
 */
function getScrollTopsOfCategories() {
    let scrollTops = [];
    $(".board-task-container").each(function () {
        scrollTops.push($(this).scrollTop());
    });
    return scrollTops
}

/** Sets the initial size and position of each task drop area
*/
function setSizeAndPositionOfTaskDropAreas() {
    let numberOfCategories = $(".board-category").length;
    $(".board-category").each(function (categoryIndex) {
        if (categoryIndex != numberOfCategories - 1) {
            let category = $(this);
            let taskContainer = category.find(".board-task-container");
            let categoryWidth = category.outerWidth();
            let categoryLeftPadding = parseInt(taskContainer.css("padding-left").slice(0, -2));
            let numberOfTasksInCategory = category.find(".board-task-drop-area").length;

            $(this).find(".board-task-drop-area").each(function (taskIndex) {
                let leftBoundary = category.offset().left + categoryLeftPadding;

                let taskHeight = 0;
                let topBoundary = 0;
                if (numberOfTasksInCategory == 1) {
                    topBoundary = taskContainer.offset().top;
                    taskHeight = $("#draggedTaskCopy").outerHeight()
                } else if (taskIndex == numberOfTasksInCategory - 1) {
                    let taskAbove = category.find(".board-task").eq(taskIndex - 1);
                    topBoundary = taskAbove.offset().top + taskAbove.outerHeight(true);
                    taskHeight = $("#draggedTaskCopy").outerHeight()
                } else {
                    let task = category.find(".board-task").eq(taskIndex);
                    taskHeight = task.outerHeight();
                    topBoundary = task.offset().top;
                }

                $(this).offset({ top: topBoundary, left: leftBoundary });
                $(this).height(taskHeight);
                $(this).width(categoryWidth);
            });
        }
    });

}

/** Resets top and bottom margins of each task to their default values
*/
function resetTaskMargins() {
    let draggedTaskBottomMargin = parseInt($("#draggedTaskCopy").css("margin-bottom").slice(0, -2));
    $(".board-task").each(function () {
        $(this).css("margin-top", 0 + "px");
        $(this).css("margin-bottom", draggedTaskBottomMargin + "px");
    });
    resetHeightsOfBoardTaskContainers();
}

/** Increases the margin of one of the tasks neighboring the hovered drop area
 * to make room for the dragged task
 * 
 * @param {number} hoveredCategoryIndex The index of the category that is being hovered
 * @param {number} hoveredDropAreaIndex The index of the drop area being hovered
 */
function makeRoomForBoardTask(hoveredCategoryIndex, hoveredDropAreaIndex) {
    let hoveredCategory = $(".board-category").eq(hoveredCategoryIndex);
    let draggedTaskHeight = $("#draggedTaskCopy").outerHeight();
    let draggedTaskBottomMargin = parseInt($("#draggedTaskCopy").css("margin-bottom").slice(0, -2));

    let numberOfDropAreasInCategory = hoveredCategory.find(".board-task-drop-area").length;

    let task = null;
    if (hoveredDropAreaIndex == 0) {
        task = hoveredCategory.find(".board-task").eq(0);
        task.css("margin-top", draggedTaskHeight + draggedTaskBottomMargin);
    }
    else if (hoveredDropAreaIndex != (numberOfDropAreasInCategory - 1)) {
        task = hoveredCategory.find(".board-task").eq(hoveredDropAreaIndex - 1);
        task.css("margin-bottom", draggedTaskHeight + (2 * draggedTaskBottomMargin));
    } else {
        increaseHeightsOfBoardTaskContainers();
    }
}

/** Sets the position and height of every drop area in the category being
 * hovererd by the dragged task
 *
 * @param {object} dropAreaHovered The task drop area that is being hovered
 */
function repositionBoardTaskDropAreas(dropAreaHovered) {
    let hoveredCategory = dropAreaHovered.parent().parent();
    let hoveredCategoryIndex = hoveredCategory.data("categoryIndex");
    let hoveredDropAreaIndex = dropAreaHovered.data("taskIndex");

    let dropAreasInCategory = hoveredCategory.find(".board-task-drop-area");
    dropAreasInCategory.each(function (dropAreaIndex) {
        let dropArea = $(this);
        if (dropAreaIndex < hoveredDropAreaIndex) {
            repositionBoardTaskDropArea(dropArea, hoveredCategoryIndex, dropAreaIndex, false, false, false);
        } else if (dropAreaIndex == hoveredDropAreaIndex) {
            if (dropAreaIndex == 0) {
                repositionBoardTaskDropArea(dropArea, hoveredCategoryIndex, -1, true, true, false);
            }
            else {
                repositionBoardTaskDropArea(dropArea, hoveredCategoryIndex, dropAreaIndex - 1, true, true, false);
            }
        }
        else {
            repositionBoardTaskDropArea(dropArea, hoveredCategoryIndex, dropAreaIndex - 1, false, false, false);
        }
    });
}

/** Sets a drop area's position and height equal to a task's
 * 
 * @param {object} dropArea A jQuery object that contains the drop area to reposition and resize
 * @param {number} categoryIndex The index of the category where the drop area will be moved to
 * @param {number} taskIndex The index of the task where the drop area will be moved to. If the index is -1, the task area is moved to the top of the scroll container
 * @param {boolean} isBelowTask Whether or not the drop area should be positioned below the task
 * @param {boolean} isDraggedTaskHeight Whether or not the drop area's height should be set equal to the task being dragged
 * @param {boolean} isZeroHeight Whether or not the drop area's height should be set equal to zero
 */
function repositionBoardTaskDropArea(dropArea, categoryIndex, taskIndex, isBelowTask, isDraggedTaskHeight, isZeroHeight) {
    let category = $(".board-category").eq(categoryIndex);
    let task = category.find(".board-task").eq(taskIndex);

    let topBoundary = 0;
    if (isBelowTask) {
        if (taskIndex == -1) {
            let scrollContainer = category.find(".board-task-container");
            topBoundary = scrollContainer.offset().top - scrollContainer.scrollTop();
        } else {
            let draggedTaskBottomMargin = parseInt($("#draggedTaskCopy").css("margin-bottom").slice(0, -2))
            topBoundary = task.offset().top + task.outerHeight() + draggedTaskBottomMargin;
        }
    } else {
        topBoundary = task.offset().top;
    }

    let dropAreaHeight = 0;
    if (isDraggedTaskHeight) {
        dropAreaHeight = $("#draggedTaskCopy").outerHeight();
    } else if (isZeroHeight) {
        dropAreaHeight = 0;
    } else {
        dropAreaHeight = task.outerHeight();
    }

    dropArea.offset({ top: topBoundary });
    dropArea.height(dropAreaHeight);
}

/** Sets the drop area indicator's position equal to the hovered drop area's
 * position and its height and width equal to the dragged task's height and width.
 * Also stores the category and task indices in the indicator
 * 
 * @param {object} dropAreaHovered A jquery object that contains the hovered drop area
 */
function repositionTaskDropAreaIndicator(dropAreaHovered) {
    $("#boardTaskDropAreaIndicator").removeClass("hidden");

    let dropAreaHeight = $("#draggedTaskCopy").outerHeight();
    let dropAreaWidth = $("#draggedTaskCopy").outerWidth();
    $("#boardTaskDropAreaIndicator").outerHeight(dropAreaHeight);
    $("#boardTaskDropAreaIndicator").outerWidth(dropAreaWidth);

    let dropAreaTopBoundary = dropAreaHovered.offset().top;
    let dropAreaLeftBoundary = dropAreaHovered.offset().left;
    $("#boardTaskDropAreaIndicator").offset({ top: dropAreaTopBoundary, left: dropAreaLeftBoundary });

    $("#boardTaskDropAreaIndicator").data("categoryId", dropAreaHovered.parent().parent().data("categoryId"));
    $("#boardTaskDropAreaIndicator").data("taskIndex", dropAreaHovered.data("taskIndex"));
}

/** Sets up the ability for categories to scroll when a task is dragged near the
 * top or bottom of the category
 * 
 * @param {object} event The mouse move event that triggered this function
 */
function setUpTaskContainerScroll(event) {
    let scrollContainer = getElementHovered(event, $(".board-task-container"));
    if (scrollContainer) {
        if (isCursorInScrollUpArea(event, scrollContainer)) {
            startScrollUpInterval(scrollContainer)
        }
        else if (isCursorInScrollDownArea(event, scrollContainer)) {
            startScrollDownInterval(scrollContainer)
        }
        else {
            clearInterval(verticalScrollIntervalId);
            verticalScrollIntervalId = 0;
        }
    }
}

/** Checks if the cursor is inside the area that will cause the category to scroll up
 *
 * @param {object} event The mouse move event that triggered this function
 * @param {object} scrollContainer A jquery object of the scroll box that contains all of the tasks in a category
 */
function isCursorInScrollUpArea(event, scrollContainer) {
    let mouseX = event.clientX;
    let mouseY = event.clientY;

    let scrollUpAreaHeight = 100;
    let scrollContainerTopOffset = scrollContainer.offset().top;
    let scrollContainerLeftOffset = scrollContainer.offset().left;
    let scrollContainerRightOffset = scrollContainerLeftOffset + scrollContainer.outerWidth();

    let scrollUpAreaBottomBound = scrollContainerTopOffset + scrollUpAreaHeight;
    let scrollUpAreaLeftBound = scrollContainerLeftOffset;
    let scrollUpAreaRightBound = scrollContainerRightOffset;

    if (
        (mouseX > scrollUpAreaLeftBound) &&
        (mouseX < scrollUpAreaRightBound) &&
        (mouseY < scrollUpAreaBottomBound)
    ) {
        return true;
    } else {
        return false;
    }
}

/** Checks if the cursor is inside the area that will cause the category to scroll down
 * 
 * @param {object} event The mouse move event that triggered this function
 * @param {object} scrollContainer A jquery object of the scroll box that contains all of the tasks in a category
 */
function isCursorInScrollDownArea(event, scrollContainer) {
    let mouseX = event.clientX;
    let mouseY = event.clientY;

    let scrollDownAreaHeight = 100;
    let scrollContainerBottomOffset = scrollContainer.offset().top + scrollContainer.outerHeight();
    let scrollContainerLeftOffset = scrollContainer.offset().left;
    let scrollContainerRightOffset = scrollContainerLeftOffset + scrollContainer.outerWidth();

    let scrollDownAreaTopBound = scrollContainerBottomOffset - scrollDownAreaHeight;
    let scrollDownAreaLeftBound = scrollContainerLeftOffset;
    let scrollDownAreaRightBound = scrollContainerRightOffset;

    if (
        (mouseX > scrollDownAreaLeftBound) &&
        (mouseX < scrollDownAreaRightBound) &&
        (mouseY > scrollDownAreaTopBound)
    ) {
        return true;
    } else {
        return false;
    }
}

/** Starts a repeating interval that scrolls the category up
 *
 * @param {object} scrollContainer A jquery object of the scroll box that contains all of the tasks in a category
 */
function startScrollUpInterval(scrollContainer) {
    if (verticalScrollIntervalId == 0) {
        let scrollRate = 10;
        verticalScrollIntervalId = setInterval(function () {
            let scrollOffset = scrollContainer.scrollTop();
            if (scrollOffset > 0) {
                scrollContainer.scrollTop(scrollOffset - scrollRate);
                scrollContainer.find(".board-task-drop-area").each(function () {
                    let dropAreaTopOffset = $(this).offset().top;
                    $(this).offset({ top: dropAreaTopOffset + scrollRate });
                });
                let dropAreaIndicatorTopOffset = $("#boardTaskDropAreaIndicator").offset().top;
                $("#boardTaskDropAreaIndicator").offset({ top: dropAreaIndicatorTopOffset + scrollRate });

                let scrollTops = getScrollTopsOfCategories();
                onBoardTaskDraggedOverDropArea(mouseMoveEvent, scrollTops);
            } else {
                clearInterval(verticalScrollIntervalId);
            }
        }, 20);
    }
}

/** Starts a repeating interval that scrolls the category down
 * 
 * @param {object} scrollContainer A jquery object of the scroll box that contains all of the tasks in a category
 */
function startScrollDownInterval(scrollContainer) {
    if (verticalScrollIntervalId == 0) {
        let scrollRate = 10;
        verticalScrollIntervalId = setInterval(function () {
            let scrollContentsHeight = scrollContainer.get(0).scrollHeight;
            let scrollOffset = scrollContainer.scrollTop();
            let scrollContainerHeight = scrollContainer.outerHeight();
            if (scrollContentsHeight - scrollOffset > scrollContainerHeight) {
                scrollContainer.scrollTop(scrollOffset + scrollRate);
                scrollContainer.find(".board-task-drop-area").each(function () {
                    let dropAreaTopOffset = $(this).offset().top;
                    $(this).offset({ top: dropAreaTopOffset - scrollRate });
                });
                let dropAreaIndicatorTopOffset = $("#boardTaskDropAreaIndicator").offset().top;
                $("#boardTaskDropAreaIndicator").offset({ top: dropAreaIndicatorTopOffset - scrollRate });

                let scrollTops = getScrollTopsOfCategories();
                onBoardTaskDraggedOverDropArea(mouseMoveEvent, scrollTops);
            } else {
                clearInterval(verticalScrollIntervalId);
            }
        }, 20);
    }
}