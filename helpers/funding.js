'use strict';

const moment = require('moment');
const request = require('request');

const url = 'https://robertsspaceindustries.com/api/stats/getCrowdfundStats';

function get() {   
    return new Promise((resolve, reject) => {
        // We need to create a buffer to hold the data as it can
        // come back in multiple chunks.
        let buffer = '';
        let req = request.post(url).form({
            chart: "day",
            fans: true,
            funds: true,
            alpha_slots: true,
            fleet: true
        });

        req.on('error', error => {
            reject(error);
        });

        // We need to check if the response from RSI was a success.
        req.on('response', response => {
            if (response.statusCode !== 200) {
                req.emit('error', new Error('Response Code was not 200.'));
            }
        });

        req.on('data', body => {
            buffer += body;
        });

        req.on('end', () => {
            let content = JSON.parse(buffer);

            // RSI's response contains a 'success' parameter, if it is not 1 then we error.
            if (content.success !== 1) {
                req.emit('error', new Error('There was an error in the response from RSI.'));
                return;
            }

            let data = content.data;

            // We need to calculate the differences and time deltas.
            let funds = data.funds / 100;
            let citizens = data.fans;
            let fleet = parseInt(data.fleet);

            let now = moment().format();
            let current = {
                funds: { value: funds, when: now },
                citizens: { value: citizens, when: now },
                fleet: { value: fleet, when: now }
            };
            
            resolve(current);
        });
    });
}

module.exports = get;
