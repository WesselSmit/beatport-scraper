/**
 * Log and log-utility functions
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




/**
 * Check if scraper has permission to log according to config
 * @param {object} config - Config / scraper parameters
 * @param {int} lvl - Minimum logLevel required to log message
 */

function checkPermission(config, lvl) {
    if (config.logLevel && config.logLevel >= lvl) {
        return true
    } else {
        return false
    }
}