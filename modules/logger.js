/**
 * Log progress of scraper
 * @module logger
 */

module.exports = log




/**
 * Special print scraper specific logs 
 * @param {string} str - String to print
 */

function log(str) {
    /* '\x1b[32m' is the print color,
       '%s\x1b[0m' is the reset code and ensures the next logs don't inherit the print color. */
    const color = '\x1b[32m%s\x1b[0m'
    console.log(color, `[scraper] ${str}`)
}