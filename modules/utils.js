/**
 * Common utils methods
 * @module utils
 */

module.exports = { interpolate }




/**
 * Get all numbers between min and max values
 * @param {number} start - Minimum range value
 * @param {number} end - Maximum range value
 * @returns {number[]} - Interpolated numbers
 */

function interpolate(start, end) {
    const range = []
    for (i = start; i <= end; i++) {
        range.push(i)
    }

    return range
}