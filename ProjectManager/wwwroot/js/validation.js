/** Checks if an email is valid
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
 * @param {string} email The email address being validated
 * @returns True is email is valid, false otherwise
 */
function checkIfEmailIsValid(email) {
    if (email.length > 254) {
        return false;
    } else {
        let regex = /[A-Za-z0-9_\.\-]*[A-Za-z0-9]+@[A-Za-z0-9\-]+\.[A-Za-z]{2,}/;
        return email.match(regex);
    }
}