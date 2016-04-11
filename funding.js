'use strict';

const format = require('format');
const formatNumber = require('format-number');
const moment = require('moment');
const request = require('request');

const errorMessage = 'I wasn\'t able to get that for you. Try again later.';
const rsiSuccessError = 'There\'s an issue with the RSI site. Try again later.';

function get(callback) {
  const url = 'https://robertsspaceindustries.com/api/stats/getCrowdfundStats';
  let buffer = '';
  request.post(url).form({
    chart: "day",
    fans: true,
    funds: true,
    alpha_slots: true,
    fleet: true
  }).on('error', function(error) {
    callback(errorMessage);
  }).on('response', function(response) {
    if (response.statusCode !== 200) {
      callback(errorMessage);
    }
  }).on('data', function(body) {
    buffer += body;
  }).on('end', function() {
    let content = JSON.parse(buffer);

    if (content['success'] !== 1) {
      callback(rsiSuccessError);
      return;
    }

    let data = content['data'];

    let fundingFormat = formatNumber({prefix: '$'});
    let otherFormat = formatNumber({});

    let funds = data['funds'] / 100;
    let citizens = data['fans'];
    let fleet = parseInt(data['fleet']);

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

    callback(formattedResponse);
  });
}

let history = {
  funds: { value: 0, when: '1900-01-01T00:00:00-00:00' },
  citizens: { value: 0, when: '1900-01-01T00:00:00-00:00' },
  fleet: { value: 0, when: '1900-01-01T00:00:00-00:00' }
};
get(function(message) {});

module.exports = get;
