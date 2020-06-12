/** Toggles the user selection container between open and closed
 * 
 * @param {number} xOffset The x offset of the container
 * @param {number} yOffset The y offset of the container
 */
function toggleUserSelectionContainer(xOffset, yOffset) {
    let container = $("#userSelectionContainer");
    if (container.hasClass("hidden")) {
        container.removeClass("hidden");
        container.offset({ top: yOffset, left: xOffset });
    } else {
        resetUserSearchResults()
        $("#userSearchBox").val("");
        $("#userSearchBox").blur();
        container.addClass("hidden");
    }
}

/** Set up the click events that occurs when a user search result is clicked
 *
 * @param {object} handler The handler that is called when the result is clicked
 */
function setUpUserSearchResultClickEvents(handler) {
    $(".user-search-result").each(function () {
        let searchResult = $(this);
        searchResult.off("click");;
        searchResult.click(function () {
            toggleUserSelectionContainer(0, 0);
            handler(searchResult);
        });
    });
}

/** Finds all users whose name matches the input of the user search box and
 * displays them
 */
function reloadUserSearchResultsOnInput() {
    let searchBox = $("#userSearchBox");
    $(searchBox).keydown(function (event) {
        resetUserSearchResults()

        let lastKeyPressed = String.fromCharCode(event.which)
        let input = $("#userSelectionContainer input").val() + lastKeyPressed;
        if (event.keyCode === 8) {
            input = input.substring(0, input.length - 2);
        }
        input = input.toLowerCase().trim();

        $(".user-search-result-name").each(function () {
            let name = $(this).text().toLowerCase();
            if (input.length != 0 && name.includes(input)) {
                $(this).parent().removeClass("hidden");
            }
        });
    });
}

/** Hides all of the previous user search results
 */
function resetUserSearchResults() {
    $(".user-search-result").each(function () {
        $(this).addClass("hidden");
    });
}