/**
 * Log progress of scraper
 * @module logger
 */

module.exports = { log, checkPermission }




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




//todo Add JSdoc

function checkPermission(config, lvl) {
    if (config.logLevel && config.logLevel >= lvl) {
        return true
    } else {
        return false
    }
}