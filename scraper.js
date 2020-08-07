/* This package is used to scrape content from beatport.

   To scrape a website you have to rely on the DOM structure,
   the DOM structure of a website is bound to change at some point,
   which will break the scraper code and result in errors. 
   
   MAINTENANCE: if the script is broken;
   check if the selectors in './modules/selectors.js' are still valid */


const log = require('./modules/logger')
const { html, exists, elements, attributes } = require('./modules/document')
const select = require('./modules/selectors')
const { interpolate } = require('./modules/utils')


/**
 * Scrape content from a Beatports account
 * @param {object} bpAccURL - Beatport account URL
 * @returns {object} - Scraped Beatport data
 */

module.exports = async bpAccURL => {
    log(`starting for url: ${bpAccURL}`)

    const releaseListURLs = await getReleaseListURLs(bpAccURL)

    return releaseListURLs
}




/**
 * Get all release overview page URLs of a beatport account
 * @param {string} URL - Beatport account URL
 * @returns {string[]} - URLs of release overview pages
 */

async function getReleaseListURLs(URL) {
    const firstReleaseListHTML = await html(URL)
    const hasPagination = exists(select.paginationContainer, firstReleaseListHTML)

    const pageQuery = 'page='
    let URLs

    if (hasPagination) {
        const pageLinkEls = elements(select.paginationLinks, firstReleaseListHTML)
        const lastPageLinkEl = pageLinkEls[pageLinkEls.length - 1]
        const lastPageLinkURL = attributes(lastPageLinkEl).href

        const lastPageNumStr = lastPageLinkURL.split(pageQuery)[1]
        const lastPageNumInt = parseInt(lastPageNumStr, 10)
        const pageNums = interpolate(1, lastPageNumInt)

        const bpURL = 'https://www.beatport.com'
        const releaseListRelURL = lastPageLinkURL.split(pageQuery)[0]
        const releaseListAbsURL = bpURL + releaseListRelURL + pageQuery

        URLs = pageNums.map(num => releaseListAbsURL + num)
    } else {
        const firstPageURL = `${URL}?${pageQuery}1`
        URLs = [firstPageURL]
    }

    return URLs
}