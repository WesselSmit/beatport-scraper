const $ = require('cheerio')
const fetch = require('node-fetch')
const fs = require('fs')

init()
async function init() {
    const url = 'https://www.beatport.com/label/ophelia/68956/tracks'
    const res = await fetch(url)
    const html = await res.text()

    const jsonSel = '#data-objects'
    const dataScriptEl = $(jsonSel, html)
    const dataJS = dataScriptEl.first().html()

    const a = dataJS.split('=')[2]
    const b = a.split(';')[0]

    fs.writeFileSync('./data/ophelia-releases.json', b)
    analyse()
}




function analyse() {
    const json = JSON.parse(fs.readFileSync('./data/ophelia-releases.json'))
    const tracks = json.tracks

    tracks.forEach((track, i) => {
        console.log(track)
    })
}