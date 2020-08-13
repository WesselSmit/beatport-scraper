/**
 * Utility functions
 * @module utils
 */

module.exports = { padEndSlash, interpolate }




/**
 * Pad string if last character isn't a "/"
 * @param {string} str - String to pad
 * @returns {string} - Padded string
 */

function padEndSlash(str) {
    const slashChar = "/"
    const lastStrChar = str[str.length - 1]

    if (lastStrChar !== slashChar) {
        str += slashChar
    }

    return str
}




/**
 * Get all numbers between min and max values
 * @param {number} start - Minimum value
 * @param {number} end - Maximum value
 * @returns {number[]} - Interpolated numbers
 */

function interpolate(start, end) {
    const range = []

    for (i = start; i <= end; i++) {
        range.push(i)
    }

    return range
}