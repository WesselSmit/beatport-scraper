/* This package is used to scrape content from beatport.

   To scrape a website you have to rely on the DOM structure,
   the DOM structure of a website is bound to change at some point,
   which will break the scraper code and result in errors. 
   
   MAINTENANCE: if the script is broken;
   check if the selectors in './modules/selectors.js' are still valid */


const log = require('./modules/logger')
const { exists, html, elems, attr, text } = require('./modules/document')
const select = require('./modules/selectors')
const { interpolate } = require('./modules/utils')


//todo Check if @returns {object} is still correct when the scraper is done bacuase it might change in development
/**
 * Scrape content from a Beatports account
 * @param {string} bpAccURL - Beatport account URL
 * @returns {object[]} - Scraped Beatport data
 */

module.exports = async bpAccURL => {
    log(`starting for ${bpAccURL}`)

    const releaseListURLs = await getReleaseListURLs(bpAccURL)
    const releaseURLs = await getReleaseURLs(releaseListURLs)

    log(`scraping ${releaseURLs.length} releases`)

    const content = await getContent(releaseURLs)
    return content
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
        const pageLinkEls = elems(select.paginationLink, firstReleaseListHTML)
        const lastPageLinkEl = pageLinkEls[pageLinkEls.length - 1]
        const lastPageLinkURL = attr('href', lastPageLinkEl)

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




/**
 * Get all individual release page URLs of a beatport account
 * @param {string[]} releaseListURLs - Release overview URLs
 * @returns {string[]} - URLs of individual release pages
 */

async function getReleaseURLs(releaseListURLs) {
    const releaseListObjs = await Promise.allSettled(
        releaseListURLs.map(async URL => {
            const releaseListHTML = await html(URL)
            const releaseLinkEls = elems(select.releaseLink, releaseListHTML)

            const releaseURLs = releaseLinkEls.map((id, el) => attr('href', el))
            return releaseURLs
        }))

    const bpURL = 'https://www.beatport.com'
    const URLs = []

    releaseListObjs.forEach(obj => {
        const releaseListReleaseURLs = obj.value

        releaseListReleaseURLs.map((id, URL) => {
            const releaseAbsURL = bpURL + URL
            URLs.push(releaseAbsURL)
        })
    })

    return URLs
}




/**
 * Get content of individual release pages 
 * @param {string[]} releaseURLs - Individual release URLs
 * @returns {object[]} - Scraped release content
 */

async function getContent(releaseURLs) {
    const contentObjs = await Promise.allSettled(
        releaseURLs.map(async URL => {
            const HTML = await html(URL)

            const releaseContent = {
                url: URL,
                catalog: text(select.catalog, HTML),
                releaseDate: text(select.releaseDate, HTML),
                label: text(select.label, HTML),
                genre: text(select.genre, HTML),
                bpm: text(select.bpm, HTML),
                price: text(select.price, HTML)
            }

            const releasesOnPage = elems(select.releaseItem, HTML)
            const isSingleRelease = releasesOnPage.length === 1 ? true : false

            if (!isSingleRelease) {
                //todo Make a releaseContent obj for each sub release
                //todo Push all sub release releaseContent objs to a array
                //todo Add the array as a property to the main releaseContent which gets returned in the function
            }

            return await releaseContent
        }))

    const content = contentObjs.map(obj => obj.value)
    return content
}