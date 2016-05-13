'use strict';

const request = require('request');
const format = require('format');
const moment = require('moment-timezone');
const FeedParser = require('feedparser');

function get(url) {
    return new Promise(function(resolve, reject) {
        // FeedParser works with the request module. We create the request
        // and pipe the results into FeedParser.
        let req = request(url);
        let feedparser = new FeedParser();
        
        req.on('error', error => {
            reject(error);
        });

        req.on('response', res => {
            if (res.statusCode != 200) {
                req.emit('error', new Error('Response Code was not 200.'));
            }
        });

        req.pipe(feedparser);

        feedparser.on('error', error => {
            reject(error);
        });

        // We construct a list of all the items returned as the data is received
        // and processed.
        let items = [];
        feedparser.on('readable', () => {
            let item;

            while ((item = feedparser.read())) {
                items.push(item);
            }
        });

        feedparser.on('end', () => {
            resolve(items);
        });
    });
}

module.exports = get;
