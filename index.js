const { getTitle } = require('./getTitle');

const config = require('./config');
const irc = require('irc');
const urlRegex = require('url-regex');
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

c.addListener('error', function(message) {
  console.log(message);
});

c.addListener(`message#${config.channels[0]}`, function(from, message) {
  let url = message.match(urlRegex());
  if (url) {
    url.forEach(function(e) {
      getTitle(e);
    });
  }
  url = '';
});


