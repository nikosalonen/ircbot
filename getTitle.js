
const scrape = require('html-metadata');
const request = require('request');

/**
 * Fetch metadata for url
 * @param {string} url - url from irc message
 * @returns {string} page metadata
 */
async function getTitle(url) {

  let options = {
    url: url,
    jar: request.jar(),
    headers: {
      'Content-Type': 'text/html; charset=utf-8',
      'Accept-Language': 'fi;q=1, en;q=0.2',
      'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/62.0.3202.94 Safari/537.36'
    }
  };
  let message = await scrape(options);

  return message.general.title.replace(/^\s+|\t|\n|\t|\s+$/g, '');
}
exports.getTitle = getTitle;
