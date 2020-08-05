const log = require('./modules/logger')
const select = require('./modules/selectors')

let config

module.exports = configObj => {
    config = configObj

    console.log(config)

    log(`started for URL: ${config.url}`)
}