/** Toggles the color selection container between open and closed
 * 
 * @param {number} xOffset The x offset of the container
 * @param {number} yOffset The y offset of the container
 */
function toggleColorSelectionContainer(xOffset, yOffset) {
    let container = $("#colorSelectionContainer");
    if (container.hasClass("hidden")) {
        container.removeClass("hidden");
        container.offset({ top: yOffset, left: xOffset });
    } else {
        container.addClass("hidden");
    }
}