'use strict';

const request = require('request');
const format = require('format');
const moment = require('moment-timezone');
const FeedParser = require('feedparser');

const errorMessage = 'I wasn\'t able to get that for you. Try again later.';

function get(url, callback) {
  let req = request(url);
  let feedparser = new FeedParser();
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
    let itemsForDisplay = items.slice(0, 9);

    let message = '**Check out some recent content:**\n';

    for (let item of itemsForDisplay) {
      let pubDate = moment(item.pubDate).fromNow();
      message += format('%s\t*written %s by %s.*\n',
                        item.title, pubDate, item.author);
    }

    callback(message);
  });
}

module.exports = get;
