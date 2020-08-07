const scraper = require('./scraper')



// Ophelia (args)
const ophelia = 'https://www.beatport.com/label/ophelia/68956/releases'


// Dimmak (args)
const dimmak = 'https://www.beatport.com/label/dim-mak-records/11919/releases'




test()
async function test() {
    const data = await scraper(dimmak)
    console.log(data)
}