const readline = require('readline')


/**
 * Log and log-utility functions
 * @module logger
 */

module.exports = { log, error, updateLog }




/**
 * Print formatted logs with newline for scraper specific logs
 * @param {string} str - String to print
 */

function log(str) {
    process.stdout.write(color(`[scraper] ${str}\n`))
}




/**
 * Print formatted logs as errors with newline for scraper specific logs
 * @param {string} str - String to print
 */

function error(str) {
    process.stdout.write(color(`[scraper] error: ${str}\n`, true))
}




/**
 * Replace previous print message with updated message
 * @param {string} str - String to print
 * @param {boolean} last - String is last string in loop
 */

function updateLog(str, last) {
    readline.clearLine(process.stdout)
    readline.cursorTo(process.stdout, 0)
    if (last) {
        log(str)
    } else {
        process.stdout.write(color(`[scraper] ${str}`))
    }
}




/**
 * Add color codes to messages to print in color
 * @param {string} str - Message to print
 * @returns {string} - Message containing color codes
 */

function color(str, err) {
    /* '\x1b[31m' and '\x1b[32m' are the print colors,
       '\x1b[0m' is the reset code and ensures the next logs don't inherit the print color. */
    let color
    if (err) {
        color = "\x1b[31m" // red color for errors
    } else {
        color = "\x1b[32m" // green color for progress
    }
    const resetColor = "\x1b[0m"
    const printStr = [color, str, resetColor].join('')

    return printStr
}