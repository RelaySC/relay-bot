'use strict';

const config = require('config');
const request = require('request');
const format = require('format');
const moment = require('moment-timezone');

const url = 'https://www.googleapis.com/calendar/v3/calendars/%s/events' +
            '?maxResults=%d&timeMin=%s&singleEvents=%s&orderBy=%s&key=%s';

function get(calendarId) {
    return new Promise(function(resolve, reject) {
        let formattedUrl = format(url, encodeURIComponent(calendarId), 9,
                                  encodeURIComponent(moment().format()), 'true',
                                  'startTime', config.get('settings.googleCalendarApiKey'));

        let req = request(formattedUrl);

        req.on('error', (error) => {
            reject(error);
        });

        req.on('response', (response) => {
            if (response.statusCode !== 200) {
                req.emit('error', new Error('Response Code was not 200.'));
            }
        });

        let data = '';
        req.on('data', (body) => {
            data += body;
        });

        req.on('end', () => {
            let content = JSON.parse(data);
            resolve(content.items);
        });
    });
}

module.exports = get;
