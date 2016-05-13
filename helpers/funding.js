'use strict';

const format = require('format');
const formatNumber = require('format-number');
const moment = require('moment');
const request = require('request');

const url = 'https://robertsspaceindustries.com/api/stats/getCrowdfundStats';

const fundingFormat = formatNumber({prefix: '$', round: 2});
const otherFormat = formatNumber({});

function get() {   
    return new Promise(function(resolve, reject) {
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

            let fundsDiff = funds - history.funds.value;
            let citizensDiff = citizens - history.citizens.value;
            let fleetDiff = fleet - history.fleet.value;

            let fundsSince = moment(history.funds.when).fromNow();
            let citizensSince = moment(history.citizens.when).fromNow();
            let fleetSince = moment(history.fleet.when).fromNow();

            let response = 'Star Citizen is currently %s funded (+%s since %s).' +
                        ' There are %s citizens (+%s since %s) and the UEE fleet' +
                        ' is %s strong (+%s since %s).';
            let formattedResponse = format(response,
                                            fundingFormat(funds),
                                            fundingFormat(fundsDiff), fundsSince,
                                            otherFormat(citizens),
                                            otherFormat(citizensDiff), citizensSince,
                                            otherFormat(fleet),
                                            otherFormat(fleetDiff), fleetSince);

            let now = moment().format();
            history = {
                funds: { value: funds, when: now },
                citizens: { value: citizens, when: now },
                fleet: { value: fleet, when: now }
            };

            resolve(formattedResponse);
        });
    });
}

// So that we have a initial value to compare against we calculate once when we load this.
let history = {
    funds: { value: 0, when: '1900-01-01T00:00:00-00:00' },
    citizens: { value: 0, when: '1900-01-01T00:00:00-00:00' },
    fleet: { value: 0, when: '1900-01-01T00:00:00-00:00' }
};
get();

module.exports = get;
