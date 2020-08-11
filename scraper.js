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

    //todo Use this to find all different types And then make a function that strips all artist names from the type 
    // content.forEach(item => console.log(item.type))




    //todo Ideas:
    // choose between minimal and extensive logging (param in config)
    // smart url checking: check if url is of account or release page --> give smart feedback when url is wrong
    //      --> also with smart url: if url is an artist; go to 'tracks' instead of 'releases' (releases also includes all label comp/albums they're part of) [watch out; the selectors are different so this will require some code refactoring]
    // raw VS smart --> only scraped content or use functions to guess the content: eg. 'type' property; 'au5 Remix' or 'remix' (param in config)
    // data-helper functions that get specific data information (eg. get all artists)

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
        releaseURLs.map(async (URL, i) => {
            const HTML = await html(URL)
            log(`scraping ${URL}`)

            const releaseContent = {
                catalog: text(select.catalog, HTML),
                url: URL,
                title: text(select.title,
                    HTML
                ), //todo still has some weirdly formatted titles with duplicate artists names, artist names need to be revmoed
                coverArt: attr('src', elems(select.coverArt, HTML)[0]),
                releaseDate: text(select.releaseDate, HTML),
                type: text(select.type, HTML), //todo artist names need to be removed
                label: text(select.label, HTML),
                genre: text(select.genre, HTML),
                bpm: text(select.bpm, HTML),
                price: text(select.price, HTML)
                //todo Add individual beatport release ID, it's a data attrbitute on the release <li> 
            }

            //todo The releaseContent metadata might be easier to retrieve by scraping the data-attributes of the release li
            /* Example:
			<li class="bucket-item ec-item track" data-ec-position="1" data-ec-type="product" 
			data-ec-name="Calling You Home (feat. RUNN) feat. RUNN" data-ec-creative="Release Track Listing" 
			data-ec-brand="Ophelia" data-ec-category="Tracks" data-ec-list="Release Track Listing" 
			data-ec-price="1.29" data-ec-variant="track" data-ec-id="10361039"
			data-ec-d1="Seven Lions, RUNN" data-ec-d2="Oliver Smith" data-ec-d3="Trance"> */

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