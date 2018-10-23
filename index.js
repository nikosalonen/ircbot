const irc = require('irc');
const urlRegex = require('url-regex');

const cheerio = require('cheerio');
const preq = require('preq'); // Promisified request library
const parseDublinCore = require('html-metadata').parseGeneral;


const encoding = require('encoding');

const color = require('ansi-color').set;


const c = new irc.Client('open.ircnet.net', 'varavibe', {
    channels: ['#rölö'],
    encoding: 'utf8',
    autoRejoin: true,
    autoConnect: true,
    username: 'varavibe',
    realName: ';ASD;A;SD;A'

});


c.addListener('error', function (message) { console.log(color('error: ', 'red'), message) });

c.addListener('message#rölö', function (from, message) {
    let url = message.match(urlRegex());
    if (url) {
        url.forEach(function (e) {
            getTitle(e)
        })

    }
    url = '';
});

async function getTitle(url) {

    if (!url.match("http")) {
        url = 'http://' + url;
    }
    preq.get({
        uri: url,
        headers: {
            'ACCEPT_LANGUAGE': 'fi-FI,fi;q=0.9,en-US;q=0.8,en;q=0.7',
            'USER_AGENT': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/62.0.3202.94 Safari/537.36'
        }
    }).then(function (response) {
        var regex = /charset=([\s\S]*)/g
        var ct = response.headers['content-type'];

        var contentType = regex.exec(ct)[1]
        var doEncode = contentType === 'UTF-8' ? false : true;

        $ = cheerio.load(response.body, { decodeEntities: true });

        return parseDublinCore($).then(function (metadata) {

            var message = metadata.title.trim().replace(/[\n\t\r]/g, " ").replace(/\s{2,}/g, " ")



            if (doEncode) {
                message = encoding.convert(message, 'utf8', contentType)
                contentType = '';
                doEncode = false;
            }
            c.say(
                '#rölö',
                message
            );
        });
    });


}

