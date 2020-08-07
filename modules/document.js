const $ = require('cheerio')
const fetch = require('node-fetch')


/**
 * HTML extraction functions
 * @module document
 */

module.exports = { exists, html, elements, attributes, text }




/**
 * Test if HTML contains atleast one element matching the selector
 * @param {string} selector - Selector to test for
 * @param {string} HTML - HTML to test selector against
 * @returns {boolean} - Bool indicating if HTML contains element matching selector
 */

function exists(selector, HTML) {
    const elementsArr = $(selector, HTML)
    const exists = elementsArr.length > 0 ? true : false
    return exists
}




/**
 * Get the HTML of a web page
 * @param {string} URL - URL of page 
 * @returns {string} - Stringified HTML 
 */

async function html(URL) {
    const res = await fetch(URL)
    const HTML = await res.text()
    return HTML
}




/**
 * Get elements matching selector from HTML
 * @param {string} selector - Element selector
 * @param {string} HTML - HTML of webpage
 * @returns {object} - Elements data object
 */

function elements(selector, HTML) {
    const elements = $(selector, HTML)
    return elements
}




/**
 * Get attributes of element
 * @param {object} element - Element to get attributes of
 * @returns {object} - Attribute key/value pairs
 */

function attributes(element) {
    const attributes = element.attribs
    return attributes
}




/**
 * Get textContent of first element matching selector
 * @param {string} selector - Element selector
 * @param {string} HTML - HTML of webpage
 * @returns {string} - Text content of element
 */

function text(selector, HTML) {
    const text = $(selector, HTML).first().text()
    return text
}