/** Toggles the due date selection container between open and closed
 *
 * @param {number} xOffset The x offset of the container
 * @param {number} yOffset The y offset of the container
 */
function toggleDueDateSelectionContainer(xOffset, yOffset) {
    let container = $("#dueDateSelectionContainer");
    goToCurrentMonthInCalendar();
    if (container.hasClass("hidden")) {
        container.removeClass("hidden");
        container.offset({ top: yOffset, left: xOffset });
    } else {
        container.addClass("hidden");
    }
}

/** Set up the click events that occur when you click any of the buttons or
 * dates in the calendar
 * 
 * @param {object} handler A function that should be executed when a calendar date is clicked
 */
function setUpCalendarClickEvents(handler) {
    $("#dueDateSelectionPreviousMonthButton").off("click");
    $("#dueDateSelectionPreviousMonthButton").click(function () {
        goToPreviousMonthInCalendar(handler);
    });

    $("#dueDateSelectionNextMonthButton").off("click");
    $("#dueDateSelectionNextMonthButton").click(function () {
        goToNextMonthInCalendar(handler);
    });

    setUpCalendarDateClickEvents(handler);
}

function setUpCalendarDateClickEvents(handler) {
    $(".due-date-selection-calendar-date").each(function () {
        let calendarDate = $(this);
        calendarDate.off("click");
        calendarDate.click(function () {
            handler(calendarDate);
            toggleDueDateSelectionContainer(0, 0);
        });
    });
}

/** Updates the due date selection calendar to display the current month */
function goToCurrentMonthInCalendar() {
    let currentMonth = new Date().getMonth();
    let currentYear = new Date().getFullYear();

    updateCalendarHtml(currentMonth, currentYear);

    $("#dueDateSelectionContainer").data("month", currentMonth);
    $("#dueDateSelectionContainer").data("year", currentYear);
}

/** Updates the due date selection calendar to display the previous month */
function goToPreviousMonthInCalendar(handler) {
    let currentMonth = $("#dueDateSelectionContainer").data("month");
    let yearOfCurrentMonth = $("#dueDateSelectionContainer").data("year");

    let previousMonth = currentMonth - 1;
    let yearOfPreviousMonth = yearOfCurrentMonth;
    if (currentMonth == 0) {
        previousMonth = 11;
        yearOfPreviousMonth = yearOfCurrentMonth - 1;
    }

    updateCalendarHtml(previousMonth, yearOfPreviousMonth);

    $("#dueDateSelectionContainer").data("month", previousMonth);
    $("#dueDateSelectionContainer").data("year", yearOfPreviousMonth);

    setUpCalendarDateClickEvents(handler);
}

/** Updates the due date selection calendar to display the next month */
function goToNextMonthInCalendar(handler) {
    let currentMonth = $("#dueDateSelectionContainer").data("month");
    let yearOfCurrentMonth = $("#dueDateSelectionContainer").data("year");

    let nextMonth = currentMonth + 1;
    let yearOfNextMonth = yearOfCurrentMonth;
    if (currentMonth == 11) {
        nextMonth = 0;
        yearOfNextMonth = yearOfCurrentMonth + 1;
    }

    updateCalendarHtml(nextMonth, yearOfNextMonth);

    $("#dueDateSelectionContainer").data("month", nextMonth);
    $("#dueDateSelectionContainer").data("year", yearOfNextMonth);

    setUpCalendarDateClickEvents(handler);
}

/** Returns the number of days in a month in a particular year
 * 
 * @param {number} month The month 
 * @param {number} year The year
 * @returns {number} The number of days in the month
 */
function getDaysInMonth(month, year) {
    let nextMonth = month + 1;
    let yearOfNextMonth = year;
    if (month == 11) {
        nextMonth = 0;
        yearOfNextMonth = year + 1;
    }
    return new Date(yearOfNextMonth, nextMonth, 0).getDate();
}

/** Gets how many weeks a month stretches across in a particular year
 * 
 * @param {number} month The month
 * @param {number} year The year
 * @returns {number} The number of weeks in the month
 */
function getWeeksInMonth(month, year) {
    let sundayOfFirstWeek = new Date(year, month);
    let numberOfDaysInWeekBeforeFirst = 0;
    while (sundayOfFirstWeek.getDay() != 0) {
        sundayOfFirstWeek.setDate(sundayOfFirstWeek.getDate() - 1);
        numberOfDaysInWeekBeforeFirst += 1;
    }
    let daysInMonth = getDaysInMonth(month, year);
    return Math.ceil((daysInMonth + numberOfDaysInWeekBeforeFirst) / 7.0);
}

/** Gets the date of sunday of the week that a month starts in a particular year
 *  
 * @param {number} month The month
 * @param {number} year The year
 * @returns {object} The date of the first sunday
 */
function getSundayOfFirstWeek(month, year) {
    let sundayOfFirstWeek = new Date(year, month);
    while (sundayOfFirstWeek.getDay() != 0) {
        sundayOfFirstWeek.setDate(sundayOfFirstWeek.getDate() - 1);
    }
    return sundayOfFirstWeek;
}

/** Updates the date selection calendar with data from the given month and year
 * 
 * @param {number} month The month
 * @param {number} year The year
 */
function updateCalendarHtml(month, year) {
    let sundayOfFirstWeek = getSundayOfFirstWeek(month, year);
    let weeksInMonth = getWeeksInMonth(month, year);

    var calendarDate = sundayOfFirstWeek;
    let calendarHtml = "";
    for (let week = 0; week < weeksInMonth; week++) {
        calendarHtml += "<div class=\"due-date-selection-calendar-row\">";
        for (let day = 0; day < 7; day++) {
            let calendarDateClasses = "due-date-selection-calendar-date ";
            if (calendarDate.getMonth() == month) {
                calendarDateClasses += "due-date-selection-calendar-date-current-month ";
            } else {
                calendarDateClasses += "due-date-selection-calendar-date-different-month ";
            }

            if (calendarDate.getTime() == new Date().setHours(0, 0, 0, 0)) {
                calendarDateClasses += "due-date-selection-calendar-date-today ";
            }

            if (calendarDate.getTime() >= new Date().setHours(0, 0, 0, 0)) {
                calendarDateClasses += "due-date-selection-calendar-date-valid ";
            } else {
                calendarDateClasses += "due-date-selection-calendar-date-invalid ";
            }
            calendarDateClasses = 'class="' + calendarDateClasses + '"';
            let calendarDateDataDay = 'data-day="' + calendarDate.getDate() + '"';
            let calendarDateDataMonth = 'data-month="' + calendarDate.getMonth() + '"';
            let calendarDateDataYear = 'data-year="' + calendarDate.getFullYear() + '"';
            let calendarDateData = calendarDateDataDay + " " + calendarDateDataMonth + " " + calendarDateDataYear;
            calendarHtml += "<div " + calendarDateClasses + " " + calendarDateData + ">" + calendarDate.getDate() + "</div>";

            calendarDate.setDate(calendarDate.getDate() + 1);

            let monthString = new Date(year, month).toDateString().slice(4, 7);
            $("#dueDateSelectionCalendarMonth").html(monthString + " " + year);
        }
        calendarHtml += "</div>";
    }
    $("#dueDateSelectionCalendar").html(calendarHtml);
}
