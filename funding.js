var format = require('format');
var formatNumber = require('format-number');
var moment = require('moment');
var request = require('request');

function get(callback) {
  var url = 'https://robertsspaceindustries.com/api/stats/getCrowdfundStats';
  var errorMessage = 'I wasn\'t able to get that for you. Try again later.';
  var rsiNoSuccess = 'There\'s an issue with the RSI site. Try again later.';
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
    var content = JSON.parse(body);

    if (content['success'] !== 1) {
      callback(rsiNoSuccess);
      return;
    }

    var data = content['data'];

    var fundingFormat = formatNumber({prefix: '$'});
    var otherFormat = formatNumber({});

    var funds = data['funds'];
    var citizens = data['fans'];
    var fleet = parseInt(data['fleet']);

    var fundsDiff = funds - history.funds.value;
    var citizensDiff = citizens - history.citizens.value;
    var fleetDiff = fleet - history.fleet.value;

    var fundsSince = moment(history.funds.when).fromNow();
    var citizensSince = moment(history.citizens.when).fromNow();
    var fleetSince = moment(history.fleet.when).fromNow();

    var response = 'Star Citizen is currently %s funded (+%s since %s).' +
                   ' There are %s citizens (+%s since %s) and the UEE fleet' +
                   ' is %s strong (+%s since %s).';
    var formattedResponse = format(response,
                                   fundingFormat(funds),
                                   fundingFormat(fundsDiff), fundsSince,
                                   otherFormat(citizens),
                                   otherFormat(citizensDiff), citizensSince,
                                   otherFormat(fleet),
                                   otherFormat(fleetDiff), fleetSince);

    var now = moment().format();
    history = {
      funds: { value: funds, when: now },
      citizens: { value: citizens, when: now },
      fleet: { value: fleet, when: now }
    };

    callback(formattedResponse);
  });
}

var history = {
  funds: { value: 0, when: '1900-01-01T00:00:00-00:00' },
  citizens: { value: 0, when: '1900-01-01T00:00:00-00:00' },
  fleet: { value: 0, when: '1900-01-01T00:00:00-00:00' }
};
get(function(message) {});

module.exports = get;
