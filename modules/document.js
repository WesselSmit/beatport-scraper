const $ = require('cheerio')
const fetch = require('node-fetch')


/**
 * HTML / DOM manipulative functions
 * @module document
 */

module.exports = { html, exists, elems, attr }




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
 * Check if element exists in DOM
 * @param {string} selector - Element selector
 * @param {string} HTML - Stringified HTML
 * @returns {boolean} - Existance of element in DOM
 */

function exists(selector, HTML) {
    const elementsArr = $(selector, HTML)
    const exists = elementsArr.length > 0 ? true : false

    return exists
}




/**
 * Get elements from DOM
 * @param {string} selector - Element selector
 * @param {string} HTML - Stringified HTML
 * @returns {object} - Element metadata objects
 */

function elems(selector, HTML) {
    const elements = $(selector, HTML)

    return elements
}




/**
 * Get specific attribute of element
 * @param {string} attr - Attribute 
 * @param {object} element - Element metadata object
 * @returns {string} - Attribute value
 */

function attr(attr, element) {
    const attributes = element.attribs
    const attribute = attributes[attr]

    return attribute
}