const { getTitle } = require('./getTitle');
const getUrls = require('get-urls');
const config = require('./config');
const irc = require('irc');
const parseDublinCore = require('html-metadata').parseGeneral;
exports.parseDublinCore = parseDublinCore;


const c = new irc.Client(config.server, config.nickname, {
  channels: config.channels,
  encoding: 'utf8',
  autoRejoin: config.autoRejoin,
  autoConnect: config.autoConnect,
  username: config.username,
  realName: config.realName,
  showErrors: true,
  debug: true

});
exports.c = c;

c.addListener('error', function (message) {
  console.log(message);
});

c.addListener(`message${config.channels[0]}`, function (from, message) {
  let urls = getUrls(message);
  [ ...urls ].map(url => {
    getTitle(url).then(title => {
      c.say(config.channels[0], title);
    }
    );

  });
});
