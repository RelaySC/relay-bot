var funding = require('./funding');
var moment = require('moment-timezone');
var format = require('format');

var commands = {
  invite: {
    fn: inviteCommand,
    help: 'Learn how to get this bot on your server!'
  },
  help: {
    fn: helpCommand,
    help: 'Learn how to get this bot on your server!'
  },
  about: {
    fn: aboutCommand,
    help: 'Find out more about this bot.'
  },
  stats: {
    fn: statsCommand,
    help: 'Check Star Citizen\'s funding levels, citizen and ship count.'
  },
  innfb: {
    fn: innFacebookCommand,
    help: 'Like INN on Facebook!'
  },
  inntwitter: {
    fn: innTwitterCommand,
    help: 'Follow INN on Twitter!'
  },
  time: {
    fn: timeCommand,
    help: 'Check the current time at CIG studios.'
  }
};

function statsCommand(bot, callback) {
  funding(function(message) {
    callback(message);
  });
}

function inviteCommand(bot, callback) {
  var message = 'You can add me to your server by instructing someone with' +
                ' the \"Manage Server\" permission to visit this page:\n' +
                'https://discordpp.com/oauth2/authorize?client_id=' +
                bot.id + '&scope=bot';
  callback(message);
}

function innTwitterCommand(bot, callback) {
  var message = 'You can find and follow INN on Twitter here: ' +
                'https://twitter.com/inn_starcitizen';
  callback(message);
}

function innFacebookCommand(bot, callback) {
  var message = 'You can find and like INN on Facebook here: ' +
                'https://www.facebook.com/ImperialNewsNetworkSC';
  callback(message);
}

function aboutCommand(bot, callback) {
  var message = 'I\'m INNBot, a Rogerian psychotherapist hired by the' +
                ' Imperial News Network. You can chat for a therapy session' +
                ' or tell me some commands. I\'m an open source' +
                ' psychotherapist too, check my source out here:' +
                ' https://github.com/ImperialNewsNetwork/inn-bot.' +
                ' You can find out about the Imperial News Network here:' +
                ' http://imperialnews.network.\n\n' +
                'To find the commands I can run, type !help.';
  callback(message);
}

function helpCommand(bot, callback) {
  var message = 'Here\'s all of my commands:\n\n';
  Object.keys(commands).forEach(function(commandName) {
    var otherInfo = commands[commandName];

    message += format('!%s - %s\n', commandName, otherInfo.help);
  });
  callback(message);
}

function timeCommand(bot, callback) {
  var message = 'It it is currently %s UTC. And it is,\n\n' +
                '%s at CIG LA in Los Angeles, California (%s),\n' +
                '%s at CIG Austin in Austin, Texas (%s),\n' +
                '%s at F42 UK in Manchester, England (%s),\n' +
                '%s at F42 DE in Frankfurt, Germany (%s),\n' +
                '%s at Turbulent in Montreal, Canada (%s).';

  var utc = moment().tz('UTC').format('hh:mma');

  var cigLA = moment().tz('America/Los_Angeles').format('hh:mma');
  var cigLAZoneName = moment().tz('America/Los_Angeles').format('z');

  var cigAustin = moment().tz('America/Chicago').format('hh:mma');
  var cigAustinZoneName = moment().tz('America/Chicago').format('z');

  var f42UK = moment().tz('Europe/London').format('hh:mma');
  var f42UKZoneName = moment().tz('Europe/London').format('z');

  var f42DE = moment().tz('Europe/Berlin').format('hh:mma');
  var f42DEZoneName = moment().tz('Europe/Berlin').format('z');

  var turbulent = moment().tz('America/Montreal').format('hh:mma');
  var turbulentZoneName = moment().tz('America/Montreal').format('z');

  var formattedMessage = format(message, utc,
                                cigLA, cigLAZoneName,
                                cigAustin, cigAustinZoneName,
                                f42UK, f42UKZoneName,
                                f42DE, f42DEZoneName,
                                turbulent, turbulentZoneName);
  callback(formattedMessage);
}

function run(messageContent, bot, callback) {
  if (messageContent.startsWith('!')) {
    var parts = messageContent.split(' ');
    var commandName = parts[0].substring(1);

    if (commands.hasOwnProperty(commandName)) {
      commands[commandName].fn(bot, function(message) {
        callback(message);
      });
    } else {
      callback('Command does not exist. Refer to !help for list of commands.');
    }
  }
}

module.exports = run;
