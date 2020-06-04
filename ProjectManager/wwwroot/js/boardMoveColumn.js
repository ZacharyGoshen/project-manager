/** Allows the user to drag and move a board category to another location when
 * mouse button is held down over a board category
 * 
 * @param {object} category The category being dragged
 */
function startBoardCategoryDragOnMouseDown(category) {
    let categoryId = category.data("categoryId");
    category.find(".board-category-header").mousedown(function (mouseDownEvent) {
        mouseDownEvent.preventDefault();

        let mouseClickX = mouseDownEvent.pageX;
        let mouseClickY = mouseDownEvent.pageY;
        let xOffsetDifference = mouseDownEvent.pageX - category.offset().left;
        let yOffsetDifference = mouseDownEvent.pageY - category.offset().top;

        $(document).on("mousemove.moveCategory", function (mouseMoveEvent) {
            if (categoryBeingDragged || Math.abs(mouseClickX - mouseMoveEvent.pageX) > 5 || Math.abs(mouseClickY - mouseMoveEvent.pageY) > 5) {
                let scrollLeft = $("#boardCategoryContainer").scrollLeft();
                if (!categoryBeingDragged) {
                    categoryBeingDragged = true;
                    copyDraggedCategory(category);
                    hideBoardViewPopUps();
                    removeCategoryHtmlFromBoard(categoryId);
                    setSizeAndPositionOfCategoryDropAreas();
                }

                $("#draggedCategoryCopy").offset({
                    top: (mouseMoveEvent.pageY - yOffsetDifference),
                    left: (mouseMoveEvent.pageX - xOffsetDifference)
                });

                setUpCategoryContainerScroll(mouseMoveEvent);
                onBoardCategoryDraggedOverDropArea(mouseMoveEvent, scrollLeft);
            }
        });
    });
}

/** Sets up what happens when a category is dragged over a drop area
 * 
 * @param {object} event The mouse move event that triggered this function
 * @param {number} scrollLeft How far the category container was scrolled right before the event
 */
function onBoardCategoryDraggedOverDropArea(event, scrollLeft) {
    let dropAreaHovered = getElementHovered(event, $(".board-category-drop-area"));
    if (dropAreaHovered) {
        let hoveredCategoryIndex = dropAreaHovered.data("categoryIndex");

        resetCategoryMargins();
        makeRoomForBoardCategory(hoveredCategoryIndex);
        $("#boardCategoryContainer").scrollLeft(scrollLeft);

        repositionBoardCategoryDropAreas(dropAreaHovered);
        repositionCategoryDropAreaIndicator(dropAreaHovered);
    }
}

/** Sets the locations and dimensions of the category drop areas */
function setSizeAndPositionOfCategoryDropAreas() {
    $(".board-category-drop-area").each(function (index) {
        let category = $(".board-category").eq(index);
        let categoryWidth = category.outerWidth();
        let topBoundary = category.offset().top;
        let leftBoundary = category.offset().left;
        $(this).offset({ top: topBoundary, left: leftBoundary });
        $(this).width(categoryWidth);
    });
}

/** Copies the clicked category and displays the contents underneath the mouse
 * 
 * @param {object} draggedCategory The category that was clicked
 */
function copyDraggedCategory(draggedCategory) {
    $("#draggedCategoryCopy").removeClass("hidden");
    $("#draggedCategoryCopy").data("categoryId", draggedCategory.data("categoryId"));
    $("#draggedCategoryCopy").data("categoryIndex", draggedCategory.data("categoryIndex"));
    $("#draggedCategoryCopy").html($(draggedCategory).html());
    $("#draggedCategoryCopy").offset(draggedCategory.offset());
    $("#draggedCategoryCopy").width(draggedCategory.width());

    $("#draggedCategoryCopy .board-category-header").css("background-color", "transparent");
}

/** Resets left and right margins of each category to their default values */
function resetCategoryMargins() {
    let draggedCategoryMargin = parseInt($("#draggedCategoryCopy").css("margin-right").slice(0, -2));
    $(".board-category").eq(0).css("margin-left", 0 + "px")
    $(".board-category").eq(1).css("margin-left", 0 + "px")
    $(".board-category").each(function () {
        $(this).css("margin-right", draggedCategoryMargin + "px");
    });
}

/** Increases the margin of one of the categoriess neighboring the hovered drop area
 * to make room for the dragged category
 * 
 * @param {number} hoveredCategoryIndex Index of the category being hovered
 */
function makeRoomForBoardCategory(hoveredCategoryIndex) {
    let draggedCategoryWidth = $("#draggedCategoryCopy").outerWidth();
    let draggedCategoryMargin = parseInt($("#draggedCategoryCopy").css("margin-right").slice(0, -2));

    if (hoveredCategoryIndex == 0) {
        $(".board-category").eq(0).css("margin-left", draggedCategoryWidth + draggedCategoryMargin + "px");
    }
    else {
        $(".board-category").eq(hoveredCategoryIndex - 1).css("margin-right", draggedCategoryWidth + (2 * draggedCategoryMargin));
    }
}

/** Sets the position of every drop area
 *
 * @param {object} dropAreaHovered The category drop area that is being hovered
 */
function repositionBoardCategoryDropAreas(dropAreaHovered) {
    let hoveredDropAreaIndex = dropAreaHovered.data("categoryIndex");

    $(".board-category-drop-area").each(function (dropAreaIndex) {
        let dropArea = $(this);
        let dropAreaLeftOffset = 0;
        if (dropAreaIndex < hoveredDropAreaIndex) {
            dropAreaLeftOffset = $(".board-category").eq(dropAreaIndex).offset().left;
        } else if (dropAreaIndex == hoveredDropAreaIndex) {
            if (dropAreaIndex == 0) {
                let containerLeftPadding = parseInt($("#boardCategoryContainer").css("padding-left").slice(0, -2));
                dropAreaLeftOffset = containerLeftPadding - $("#boardCategoryContainer").scrollLeft();
            }
            else {
                let categoryToLeft = $(".board-category").eq(dropAreaIndex - 1)
                dropAreaLeftOffset = categoryToLeft.offset().left + categoryToLeft.outerWidth();
            }
        }
        else {
            let categoryToLeft = $(".board-category").eq(dropAreaIndex - 1)
            dropAreaLeftOffset = categoryToLeft.offset().left;
        }
        dropArea.offset({ left: dropAreaLeftOffset });
    });
}

/** Sets the drop area indicator's position equal to the hovered drop area's
 * position and its height and width equal to the dragged category's height and width
 *
 * @param {object} dropAreaHovered A jquery object that contains the hovered drop area
 */
function repositionCategoryDropAreaIndicator(dropAreaHovered) {
    $("#boardCategoryDropAreaIndicator").removeClass("hidden");

    $("#boardCategoryDropAreaIndicator").height($("#draggedCategoryCopy").height());
    $("#boardCategoryDropAreaIndicator").width($("#draggedCategoryCopy").width());

    let topBoundary = dropAreaHovered.offset().top;
    let leftBoundary = dropAreaHovered.offset().left;
    $("#boardCategoryDropAreaIndicator").offset({ top: topBoundary, left: leftBoundary });

    $("#boardCategoryDropAreaIndicator").data("categoryIndex", dropAreaHovered.data("categoryIndex"));
}

/** Sets up the ability for the category container to scroll horizontally when a
 * task is dragged near the left or right of the container
 *
 * @param {object} event The mouse move event that triggered this function
 */
function setUpCategoryContainerScroll(event) {
    let scrollContainer = getElementHovered(event, $("#boardCategoryContainer"));
    if (scrollContainer) {
        if (isCursorInScrollLeftArea(event, scrollContainer)) {
            startScrollLeftInterval(scrollContainer);
        }
        else if (isCursorInScrollRightArea(event, scrollContainer)) {
            startScrollRightInterval(scrollContainer);
        }
        else {
            clearInterval(horizontalScrollIntervalId);
            horizontalScrollIntervalId = 0;
        }
    }
}

/** Checks if the cursor is inside the area that will cause the container to
 * scroll left
 *
 * @param {object} event The mouse move event that triggered this function
 * @param {object} scrollContainer A jquery object of the scroll box that holds all of the categories
 */
function isCursorInScrollLeftArea(event, scrollContainer) {
    let mouseX = event.clientX;
    let mouseY = event.clientY;

    let scrollLeftAreaWidth = 100;
    let scrollContainerTopOffset = scrollContainer.offset().top;
    let scrollContainerBottomOffset = scrollContainer.offset().top + scrollContainer.outerHeight();
    let scrollContainerLeftOffset = scrollContainer.offset().left;

    let scrollLeftAreaTopBound = scrollContainerTopOffset;
    let scrollLeftAreaBottomBound = scrollContainerBottomOffset;
    let scrollLeftAreaRightBound = scrollContainerLeftOffset + scrollLeftAreaWidth;

    if (
        (mouseX < scrollLeftAreaRightBound) &&
        (mouseY > scrollLeftAreaTopBound) &&
        (mouseY < scrollLeftAreaBottomBound)
    ) {
        return true;
    } else {
        return false;
    }
}

/** Checks if the cursor is inside the area that will cause the container to
 * scroll right
 *
 * @param {object} event The mouse move event that triggered this function
 * @param {object} scrollContainer A jquery object of the scroll box that holds all of the categories
 */
function isCursorInScrollRightArea(event, scrollContainer) {
    let mouseX = event.clientX;
    let mouseY = event.clientY;

    let scrollRightAreaWidth = 100;
    let scrollContainerTopOffset = scrollContainer.offset().top;
    let scrollContainerBottomOffset = scrollContainer.offset().top + scrollContainer.outerHeight();
    let scrollContainerRightOffset = scrollContainer.offset().left + scrollContainer.outerWidth();

    let scrollRightAreaTopBound = scrollContainerTopOffset;
    let scrollRightAreaBottomBound = scrollContainerBottomOffset;
    let scrollRightAreaLeftBound = scrollContainerRightOffset - scrollRightAreaWidth;

    if (
        (mouseX > scrollRightAreaLeftBound) &&
        (mouseY > scrollRightAreaTopBound) &&
        (mouseY < scrollRightAreaBottomBound)
    ) {
        return true;
    } else {
        return false;
    }
}

/** Starts a repeating interval that scrolls the categories left
 *
 * @param {object} scrollContainer A jquery object of the scroll box that contains all of the categories
 */
function startScrollLeftInterval(scrollContainer) {
    if (horizontalScrollIntervalId == 0) {
        let scrollRate = 20;
        horizontalScrollIntervalId = setInterval(function () {
            let scrollOffset = scrollContainer.scrollLeft();
            if (scrollOffset > 0) {
                scrollContainer.scrollLeft(scrollOffset - scrollRate);
                $(".board-category-drop-area").each(function () {
                    let categoryDropAreaLeftOffset = $(this).offset().left;
                    $(this).offset({ left: categoryDropAreaLeftOffset + scrollRate });
                });
                $(".board-task-drop-area").each(function () {
                    let taskDropAreaLeftOffset = $(this).offset().left;
                    $(this).offset({ left: taskDropAreaLeftOffset + scrollRate });
                });

                let categoryDropAreaIndicatorLeftOffset = $("#boardCategoryDropAreaIndicator").offset().left;
                $("#boardCategoryDropAreaIndicator").offset({ left: categoryDropAreaIndicatorLeftOffset + scrollRate });

                let taskDropAreaIndicatorLeftOffset = $("#boardTaskDropAreaIndicator").offset().left;
                $("#boardTaskDropAreaIndicator").offset({ left: taskDropAreaIndicatorLeftOffset + scrollRate });

                if (taskBeingDragged) {
                    let scrollTops = getScrollTopsOfCategories();
                    onBoardTaskDraggedOverDropArea(mouseMoveEvent, scrollTops);
                } else {
                    let scrollLeft = $("#boardCategoryContainer").scrollLeft();
                    onBoardCategoryDraggedOverDropArea(mouseMoveEvent, scrollLeft);
                }
            } else {
                clearInterval(horizontalScrollIntervalId);
            }
        }, 20);
    }
}

/** Starts a repeating interval that scrolls the categories right
 *
 * @param {object} scrollContainer A jquery object of the scroll box that contains all of the categories
 */
function startScrollRightInterval(scrollContainer) {
    if (horizontalScrollIntervalId == 0) {
        let scrollRate = 20;
        horizontalScrollIntervalId = setInterval(function () {
            let scrollContentsWidth = scrollContainer.get(0).scrollWidth;
            let scrollOffset = scrollContainer.scrollLeft();
            let scrollContainerWidth = scrollContainer.outerWidth();
            if (scrollContentsWidth - scrollOffset > scrollContainerWidth) {
                scrollContainer.scrollLeft(scrollOffset + scrollRate);
                $(".board-category-drop-area").each(function () {
                    let categoryDropAreaLeftOffset = $(this).offset().left;
                    $(this).offset({ left: categoryDropAreaLeftOffset - scrollRate });
                });
                $(".board-task-drop-area").each(function () {
                    let taskDropAreaLeftOffset = $(this).offset().left;
                    $(this).offset({ left: taskDropAreaLeftOffset - scrollRate });
                });

                let categoryDropAreaIndicatorLeftOffset = $("#boardCategoryDropAreaIndicator").offset().left;
                $("#boardCategoryDropAreaIndicator").offset({ left: categoryDropAreaIndicatorLeftOffset - scrollRate });

                let taskDropAreaIndicatorLeftOffset = $("#boardTaskDropAreaIndicator").offset().left;
                $("#boardTaskDropAreaIndicator").offset({ left: taskDropAreaIndicatorLeftOffset - scrollRate });

                if (taskBeingDragged) {
                    let scrollTops = getScrollTopsOfCategories();
                    onBoardTaskDraggedOverDropArea(mouseMoveEvent, scrollTops);
                } else {
                    let scrollLeft = $("#boardCategoryContainer").scrollLeft();
                    onBoardCategoryDraggedOverDropArea(mouseMoveEvent, scrollLeft);
                }
            } else {
                clearInterval(horizontalScrollIntervalId);
            }
        }, 20);
    }
}