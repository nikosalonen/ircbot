
const scrape = require('html-metadata');
const request = require('request');

/**
 * Fetch metadata for url
 * @param {string} url - url from irc message
 * @returns {string} page metadata
 */
function getTitle(url) {

  let options = {
    url: url,
    jar: request.jar(),
    headers: {
      'Content-Type':'text/html; charset=utf-8',
      'Accept-Language': 'en-US',
      'User-Agent':'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/62.0.3202.94 Safari/537.36'
    }
  };
  let message = scrape(options);
  return message;
}
exports.getTitle = getTitle;
