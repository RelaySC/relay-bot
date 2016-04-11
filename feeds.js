'use strict';

const request = require('request');
const format = require('format');
const moment = require('moment-timezone');
const FeedParser = require('feedparser');

let feedparser = new FeedParser();

const errorMessage = 'I wasn\'t able to get that for you. Try again later.';

function get(url, callback) {
  let req = request(url);
  req.on('error', error => {
    callback(errorMessage);
  });

  req.on('response', res => {
    if (res.statusCode != 200) {
      req.emit('error', new Error(errorMessage));
    }
  });

  req.pipe(feedparser);

  feedparser.on('error', error => {
    console.log(error);
    callback(errorMessage);
  });

  let items = [];
  feedparser.on('readable', () => {
    let item;

    while (item = feedparser.read()) {
      items.push(item);
    }
  });

  feedparser.on('end', () => {
    let item = items[0];

    let pubDate = moment(item.pubDate).fromNow();

    let message = '**Latest Post:**\n' +
                  '%s - written by %s %s.\n\n' +
                  '*Read the article by clicking here:* %s';
    let messageFormatted = format(message, item.title, item.author,
                                  pubDate, item.link);

    callback(messageFormatted);
  });
}

module.exports = get;
