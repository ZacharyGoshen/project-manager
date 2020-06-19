/** Toggles the tag selection container between open and closed
 *
 * @param {number} xOffset The x offset of the container
 * @param {number} yOffset The y offset of the container
 */
function toggleTagSelectionContainer(xOffset, yOffset) {
    let container = $("#tagSelectionContainer");
    if (container.hasClass("hidden")) {
        container.removeClass("hidden");
        container.offset({ top: yOffset, left: xOffset });
    } else {
        container.addClass("hidden");
    }
}

/** Toggles the tag color selection container between open and closed
 * 
 * @param {number} xOffset The x offset of the container
 * @param {number} yOffset The y offset of the container
 */
function toggleTagColorSelectionContainer(xOffset, yOffset) {
    let container = $("#tagColorSelectionContainer");
    if (container.hasClass("hidden")) {
        container.removeClass("hidden");
        container.offset({ top: yOffset, left: xOffset });
    } else {
        container.addClass("hidden");
    }
}