//todo Add JSdoc

module.exports = { padSlash, interpolate }




//todo Add JSdoc

function padSlash(str) {
    const slashChar = "/"
    const lastStrChar = str[str.length - 1]

    if (lastStrChar !== slashChar) {
        str += slashChar
    }
    return str
}




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