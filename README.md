# Beatport Scraper

A scraper for music data, using [Beatport](https://www.beatport.com/) as source

## Installation

The package is available on `npm`, `yarn` and `gpr` (github package registry). 

### NPM & Yarn

```sh
$ npm i beatport-scraper # npm

$ yarn add beatport-scraper # yarn
```

### Github Package Registry

Create a `.npmrc` with the line below:

```
@wesselsmit:registry=https://npm.pkg.github.com
```

Install the package in the CLI

```sh
$ npm i @wesselsmit/beatport-scraper
```

## Usage

This scraper gets data from an **artist** or **label** Beatport account.

* `url` string: URL of Beatport account to scrape. **(required)**
* `log` boolean: Log progress in console. **(optional, defaults to false)**
* `raw` boolean: Return data unformatted. **(optional, defaults to false)**

### Example

The example scrapes all data from Seven Lions's Beatport account.

```js
const scrape = require('@wesselsmit/beatport-scraper')

const config = {
    url: 'https://www.beatport.com/artist/seven-lions/241780',
    log: true, // optional
    raw: false // optional
}

scrape(config)
    .then(data => console.log(data))
```

## Disclaimer

The nature of web scraping is that when the HTML/website changes, the web scraper will inevitably fail. 
Beatport has every right to change/improve their UI as they see fit. 
This scraper relies on the [DOM structure and selectors](#maintaince) to navigate the website and identify data. 
Changes to Beatport's website can cause the scraper to break!

## Maintaince

>Status: working (last checked: August 15th, 2020)

As explained in [disclaimer](#disclaimer), this scraper might break in the future if Beatport has changed their website. 

To make troubleshooting and maintaince easier the scraper relies on as little as possible DOM selectors and DOM specific code. 
All code specific to the Beatport website is either in the 
[scraper.js](https://github.com/WesselSmit/beatport-scraper/blob/master/scraper.js) script or in the 
[selectors.js](https://github.com/WesselSmit/beatport-scraper/blob/master/modules/selectors.js) module.

Recommended first steps for troubleshooting/maintaince:
* check if the DOM selectors in the [selectors.js](https://github.com/WesselSmit/beatport-scraper/blob/master/modules/selectors.js) module are still up to date with the website.
* check if the lines marked with `//! Subject to change` comments in [scraper.js](https://github.com/WesselSmit/beatport-scraper/blob/master/scraper.js) are still up to date with the website.

