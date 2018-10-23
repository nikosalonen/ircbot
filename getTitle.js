const config = require('./config');
const cheerio = require('cheerio');
const preq = require('preq');
const encoding = require('encoding');
const { parseDublinCore, c } = require('./index');

/**
 * Fetch title for url
 * @param {string} url - url from irc message
 * @returns {string} title of the page
 */
function getTitle(url) {
  if (!url.match('http')) {
    url = `http://${url}`;
  }
  preq.
    get({
      uri: url,
      headers: {
        ACCEPT_LANGUAGE: 'fi-FI,fi;q=0.9,en-US;q=0.8,en;q=0.7',
        USER_AGENT: 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/62.0.3202.94 Safari/537.36'
      }
    }).
    then(function (response) {
      let regex = /charset=([\s\S]*)/g;
      let ct = response.headers['content-type'];
      let contentType = regex.exec(ct)[1];
      let doEncode = contentType !== 'UTF-8';
      let $ = cheerio.load(response.body, { decodeEntities: true });
      return parseDublinCore($).then(function (metadata) {
        let message = metadata.title.
          trim().
          replace(/[\n\t\r]/g, ' ').
          replace(/\s{2,}/g, ' ');
        if (doEncode) {
          message = encoding.convert(message, 'utf8', contentType);
          contentType = '';
          doEncode = false;
        }
        c.say(config.channels[0], message);
      });
    });
}
exports.getTitle = getTitle;
