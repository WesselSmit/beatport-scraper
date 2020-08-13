const { log, checkPermission } = require('./modules/logger')
const { padEndSlash, interpolate } = require('./modules/utils')
const { html, exists, elems, attr } = require('./modules/document')
const select = require('./modules/selectors')

let config




//todo Add JSdoc

module.exports = scraper




//todo Add JSdoc

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




//todo Add JSdoc

async function getPages() {
    const pageBaseURL = getPageURL()
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




//todo Add JSdoc

function getPageURL() {
    const baseURL = padEndSlash(config.accountURL)
    const pageQuery = '?page='
    const pageURL = baseURL + config.contentType + pageQuery

    return pageURL
}




//todo Add JSdoc

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




//todo Add JSdoc

async function getData(HTMLPages) {
    const dataArr = await Promise.allSettled(
        HTMLPages.map(async pageObj => {
            const HTML = pageObj.value
            const scriptEl = elems(select.dataInlineScript, HTML)
            const scriptElContent = scriptEl.first().html()

            const json = scriptElContent.split('=')[2].split(';')[0]
            return json
        }))

    return dataArr
}




//todo Add JSdoc

function sanitizeData(dataArr) {
    const data = []

    const a = dataArr.map(json => {
        const obj = JSON.parse(json.value)
        data.push(obj)
        return obj
    })

    return a
}