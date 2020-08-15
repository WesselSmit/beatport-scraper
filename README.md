# Beatport Scraper

A scraper for music data, using [Beatport](https://www.beatport.com/) as source

## Installation

```sh
$ npm i beatport-scraper 
```

## Usage

This scraper gets data from a **artist** or **label** Beatport account, it requires `config` options to work.

* `accountURL` string: URL of Beatport account to scrape. **(required)**
* `contentType` string: Type of content to scrape, acceptable values are: `featured`, `tracks`, `releases` and `charts`. **(required)**
* `logging` boolean: Log progress in console. **(optional)**

**Note**

Beatport **label** accounts don't have a `charts` tab, so scraping them will result in a JS object with empty values.

### Example

The code scrapes all data from the `tracks` pages of Seven Lions's Beatport account.

```js
const scraper = require('beatport-scraper')

const config = {
    accountURL: 'https://www.beatport.com/artist/seven-lions/241780',
    contentType: 'tracks',
    logging: true
}

const data = await scraper(config)
console.log(data)
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

