/* This package is used to scrape content from Beatport.
   To scrape a website you have to rely on the DOM structure,
   the DOM structure of a website is bound to change at some point,
   which will break the scraper code and result in errors. 
   
   MAINTENANCE: if the script is broken, the recommended first step is to;
   check if the selectors in './modules/selectors.js' are still valid. */


const { log, checkPermission } = require('./modules/logger')
const { padEndSlash, interpolate } = require('./modules/utils')
const { html, exists, elems, attr } = require('./modules/document')
const select = require('./modules/selectors')

let config




/**
 * Get content of Beatport account
 * @module scraper
 */

module.exports = scraper




/**
 * Facilitate scraping process and log progress
 * @param {object} conf - Config options
 * @returns {object} - Scraped data
 */

async function scraper(conf) {
    config = conf

    if (checkPermission(config, 1)) {
        log(`starting scraping`)
    }

    const HTMLPages = await getPages()

    if (checkPermission(config, 2)) {
        log(`found ${HTMLPages.length} ${HTMLPages.length > 1 ? "pages" : "page"}`)
    }

    const dataArr = await getData(HTMLPages)
    const data = sanitizeData(dataArr)

    if (checkPermission(config, 1)) {
        log(`finished scraping`)
    }

    return data
}




/**
 * Get HTML pages that need to be scraped 
 * @returns {object[]} - Response objects containing stringified HTML pages
 */

async function getPages() {
    const pageBaseURL = getBaseURL()
    const firstPageURL = pageBaseURL + 1
    const firstPageHTML = await html(firstPageURL)
    const hasPagination = exists(select.paginationContainer, firstPageHTML)

    let HTMLPages
    if (hasPagination) {
        const pageNums = getPageNums(firstPageHTML)
        HTMLPages = await Promise.allSettled(
            pageNums.map(async num => {
                const pageURL = pageBaseURL + num
                const pageHTML = await html(pageURL)
                return pageHTML
            })
        )
    } else {
        HTMLPages = [firstPageHTML]
    }

    return HTMLPages
}




/**
 * Get base URL of web page to scrape for content
 * @returns {string} - Beatport account content base URL
 */

function getBaseURL() {
    const baseURL = padEndSlash(config.accountURL)
    const pageQuery = '?page='
    const pageURL = baseURL + config.contentType + pageQuery

    return pageURL
}




/**
 * Get first and last page number of Beatport account 'contentType' page by scraping pagination link elements
 * @param {string} HTML - Stringified HTML
 * @returns {number[]} - Page numbers
 */

function getPageNums(HTML) {
    const pageLinkEls = elems(select.paginationLink, HTML)
    const lastPageLinkEl = pageLinkEls[pageLinkEls.length - 1]
    const lastPageLinkRelURL = attr('href', lastPageLinkEl)
    const pageQuery = '?page='

    const lastPageNumStr = lastPageLinkRelURL.split(pageQuery)[1]
    const lastPageNumInt = parseInt(lastPageNumStr, 10)
    const pageNums = interpolate(1, lastPageNumInt)

    return pageNums
}




/**
 * Scrape JSON data from inline script tag and remove all JS
 * @param {object[]} HTMLPages - Stringified HTML pages
 * @returns {object[]} - Response objects including stringified JSON data
 */

async function getData(HTMLPages) {
    const dataArr = await Promise.allSettled(
        HTMLPages.map(async pageObj => {
            const HTML = pageObj.value
            const scriptEl = elems(select.dataInlineScript, HTML)
            const js = scriptEl.first().html()

            const json = js.split('=')[2].split(';')[0] //! Subject to change
            return json
        }))

    return dataArr
}




/**
 * Get rid of fetch status and transform JSON to JS object
 * @param {object[]} dataArr - Response objects including stringified JSON data
 * @returns {object[]} - Sanitized JSON data
 */

function sanitizeData(dataArr) {
    const mergedData = dataArr.map(json => {
        const obj = JSON.parse(json.value)
        return obj
    })

    return mergedData
}