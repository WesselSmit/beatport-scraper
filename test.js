const scraper = require('./scraper')



// Ophelia (args)
const ophelia = {
    url: 'https://www.beatport.com/label/ophelia/68956/releases',
    targetPath: './',
    targetName: 'music-data.json'
}


// Dimmak (args)
const dimmak = {
    url: 'https://www.beatport.com/label/dim-mak-records/11919/releases',
    targetPath: './',
    targetName: 'music-data.json'
}


scraper(dimmak)