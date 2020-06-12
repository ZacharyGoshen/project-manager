let currentView = "";

onViewLoad();

/** Set up configurations that are necessary regardless of the current view */
function onViewLoad() {
    $(document).ready(function () {
        $("input").attr("autocomplete", "off");
    });

    hideElementOnClickOutside($("#projectDropDownMenu"), [$("#projectDropDownMenu"), $("#projectDropDownButton")]);
    hideElementOnClickOutside($("#userDropDownMenu"), [$("#userDropDownMenu"), $("#loggedInUser")]);
}

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



