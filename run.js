var elizabot = require('./elizabot');
var format = require('format');
var formatNumber = require('format-number');
var moment = require('moment');
var request = require('request');
var Discordie = require('discordie');
var client = new Discordie();

if (process.argv.length != 3) {
  console.log('ERROR: You must supply a Discord API Token.');
  process.exit(1);
}

var eliza = new elizabot.ElizaBot();

function getStats(history, callback) {
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
    var updatedHistory = {
      funds: { value: funds, when: now },
      citizens: { value: citizens, when: now },
      fleet: { value: fleet, when: now }
    };

    callback(formattedResponse, updatedHistory);
  });
}

var now = moment().format();
var fundingHistory = {
  funds: { value: 0, when: now },
  citizens: { value: 0, when: now },
  fleet: { value: 0, when: now }
};
getStats(fundingHistory, function(message, updatedHistory) {
  fundingHistory = updatedHistory;
});

client.connect({
  token: process.argv[2]  // This should be the supplied API token.
});

client.Dispatcher.on('GATEWAY_READY', e => {
  console.log('Connected as: ' + client.User.username);
});

client.Dispatcher.on('MESSAGE_CREATE', e => {
  if (e.message.author.id === client.User.id || e.message.author.bot) {
    // Don't reply to yourself or other bots.
    return;
  }

  switch (e.message.content) {
    case '!stats':
      getStats(fundingHistory, function(message, updatedHistory) {
        e.message.channel.sendMessage(message);
        fundingHistory = updatedHistory;
      });
      break;
    case '!invite':
      var inviteMessage = 'You can add me to your server by instructing' +
                          ' someone with the \"Manage Server\" permission to' +
                          ' visit this page:\n' +
                          'https://discordpp.com/oauth2/authorize?client_id=' +
                          client.User.id + '&scope=bot';
      e.message.channel.sendMessage(inviteMessage);
      return;
    case '!about':
      var aboutMessage = 'I\'m INNBot, a Rogerian psychotherapist hired by' +
                         ' the Imperial News Network. You can chat for' +
                         ' a therapy session or tell me some commands. I\'m' +
                         ' an open source psychotherapist too, check my' +
                         ' source out here: ' +
                         'https://github.com/ImperialNewsNetwork/inn-bot.' +
                         ' You can find out about the Imperial News Network' +
                         ' here: http://imperialnews.network.' +
                         '\n\nTo find the commands I can run, type !help.';
      e.message.channel.sendMessage(aboutMessage);
      return;
    case '!help':
      var helpMessage = 'Here\'s all of my commands:\n\n' +
                        '!help - Display this page.\n' +
                        '!about - Find out about me.\n' +
                        '!stats - Find out Star Citizen\'s stats.\n' +
                        '!invite - Learn how to get me on your server.\n';
      e.message.channel.sendMessage(helpMessage);
  }

  if (client.User.isMentioned(e.message) || e.message.isPrivate) {
    // If our bot was mentioned or the message was in a DM.

    var messageContent = e.message.content;

    if (!e.message.isPrivate) {
      // Non-private messages always have a <@bot_id> in order to mention the
      // bot. We want to remove this so it doesn't get included in the
      // responses.
      var mention = '<@' + client.User.id + '>';
      messageContent = messageContent.replace(mention, '').trim();
    }

    var response = eliza.transform(messageContent);
    e.message.channel.sendMessage(response);
  }
});
