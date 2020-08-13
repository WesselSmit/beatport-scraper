const scraper = require('./scraper')
const fs = require('fs')



const config = {
    accountURL: 'https://www.beatport.com/label/ophelia/68956/',
    contentType: 'tracks',
    logLevel: 0,
    rawOutput: true
}


test()
async function test() {
    const data = await scraper(config)

    fs.writeFileSync(`data/data.json`, JSON.stringify(data))

    // const dataJSON = JSON.parse(fs.readFileSync('./data/data.json'))
    // const aJSON = JSON.parse(fs.readFileSync('./data/a.json'))

    // console.log(dataJSON == aJSON)
}