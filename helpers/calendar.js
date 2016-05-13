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

        let message = '\n**Upcoming:**\n';
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
            for (let item of content.items) {

                let start = moment.tz(item.start.dateTime, item.start.timeZone);
                if (item.start.hasOwnProperty('date')) {
                    // If it is an all day event.
                    start = moment(item.start.date);
                }

                if (typeof item.location === 'undefined' || item.location === null) {
                    message += format('%s\t*in %s*\n',
                                    item.summary, start.toNow(true));
                } else {
                    message += format('%s\t*on %s in %s*\n',
                                    item.summary, item.location, start.toNow(true));
                }
            }

            resolve(message);
        });
    });
}

module.exports = get;
