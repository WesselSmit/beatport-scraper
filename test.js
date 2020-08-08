const scraper = require('./scraper')



// Ophelia 
const ophelia = 'https://www.beatport.com/label/ophelia/68956/releases'


// Dimmak 
const dimmak = 'https://www.beatport.com/label/dim-mak-records/11919/releases'


// Pegboard Nerds 
const pegboardNerds = 'https://www.beatport.com/artist/pegboard-nerds/241813/releases'




test()
async function test() {
    const data = await scraper(ophelia)
    console.log(data)
}