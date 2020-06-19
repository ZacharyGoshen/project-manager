/** Check if an email is valid
 * - Length is no greater than 254 characters
 * - Prefix only uses alphanumeric characters, underscores, periods, and dashes
 * - Prefix is atleast 1 character long
 * - Underscore, period, or dash can not be last character in prefix
 * - Prefix followed by @
 * - @ followed by domain
 * - First part of domain only uses alphanumeric characters and dashes
 * - First part of domain is atleast 1 character long
 * - First part of domain is followed by a period
 * - Period is followed by second part of domain
 * - Second part of domain only includes letters
 * - Second part of domain is atleast 2 characters long
 * 
 * @param {string} email The email address being validated
 * @returns True if email is valid, false otherwise
 */
function checkIfEmailIsValid(email) {
    if (email.length > 254) {
        return false;
    } else {
        let regex = /^[A-Za-z0-9_\.\-]*[A-Za-z0-9]+@[A-Za-z0-9\-]+\.[A-Za-z]{2,}$/;
        if (email.match(regex)) {
            return true;
        } else {
            return false;
        }
    }
}

/** Check if a password is valid
 * - Length is between 8 and 128 characters
 * - Password only uses alphanumeric characters and special characters #?!@$%^&*-
 * 
 * @param {string} password The password being validated
 * @returns True if password is valid, false otherwise
 */
function checkIfPasswordIsValid(password) {
    let regex = /^[A-Za-z0-9#?!@$%^&*-]{8,128}$/;
    if (password.match(regex)) {
        return true;
    } else {
        return false;
    }
}

/** Check if a first name is valid
 * - Length is between 2 and 30 characters
 * - First name only uses letters
 *
 * @param {string} firstName The first name being validated
 * @returns True if first name is valid, false otherwise
 */
function checkIfFirstNameIsValid(firstName) {
    let regex = /^[A-Za-z]{2,30}$/
    if (firstName.match(regex)) {
        return true;
    } else {
        return false;
    }
}

/** Check if a last name is valid
 * - Length is between 2 and 30 characters
 * - Last name only uses letters
 *
 * @param {string} lastName The last name being validated
 * @returns True if last name is valid, false otherwise
 */
function checkIfLastNameIsValid(lastName) {
    let regex = /^[A-Za-z]{2,30}$/
    if (lastName.match(regex)) {
        return true;
    } else {
        return false;
    }
}