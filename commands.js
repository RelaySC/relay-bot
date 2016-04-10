var funding = require('./funding');
var moment = require('moment-timezone');
var format = require('format');

var commands = {
  invite: {
    fn: inviteCommand,
    help: 'Learn how to get this bot on your server!',
    hidden: false
  },
  help: {
    fn: helpCommand,
    help: 'Learn how to get this bot on your server!',
    hidden: false
  },
  about: {
    fn: aboutCommand,
    help: 'Find out more about this bot.',
    hidden: false
  },
  stats: {
    fn: statsCommand,
    help: 'Check Star Citizen\'s funding levels, citizen and ship count.',
    hidden: false
  },
  innfb: {
    fn: innFacebookCommand,
    help: 'Like INN on Facebook!',
    hidden: false
  },
  inntwitter: {
    fn: innTwitterCommand,
    help: 'Follow INN on Twitter!',
    hidden: false
  },
  innyt: {
    fn: innYouTubeCommand,
    help: 'Subcribe to INN on YouTube!',
    hidden: false
  },
  inntwitch: {
    fn: innTwitchCommand,
    help: 'Follow INN on Twitch!',
    hidden: false
  },
  rsifb: {
    fn: rsiFacebookCommand,
    help: 'Like Star Citizen on Facebook!',
    hidden: false
  },
  rsitwitter: {
    fn: rsiTwitterCommand,
    help: 'Follow Star Citizen on Twitter!',
    hidden: false
  },
  rsiyt: {
    fn: rsiYouTubeCommand,
    help: 'Subcribe to Star Citizen on YouTube!',
    hidden: false
  },
  rsitwitch: {
    fn: rsiTwitchCommand,
    help: 'Follow Star Citizen on Twitch!',
    hidden: false
  },
  rsicommunitytwitch: {
    fn: rsiCommunityTwitchCommand,
    help: 'Follow CIG Community on Twitch!',
    hidden: false
  },
  issue: {
    fn: issueCouncilCommand,
    help: 'Report a bug/issue to the Issue Council!',
    hidden: false
  },
  bug: {
    fn: issueCouncilCommand,
    help: 'Report a bug/issue to the Issue Council!',
    hidden: true
  },
  time: {
    fn: timeCommand,
    help: 'Check the current time at CIG studios.',
    hidden: false
  }
};

function statsCommand(bot, callback) {
  funding(function(message) {
    var extraMessage = ' It has been %s since the Star Citizen kickstarter.';
    var extraMessageFormatted = format(extraMessage,
                                       moment('2012-10-18').fromNow(true));
    callback(message + extraMessageFormatted);
  });
}

function inviteCommand(bot, callback) {
  var message = 'You can add me to your server by instructing someone with' +
                ' the \"Manage Server\" permission to visit this page:\n' +
                'https://discordpp.com/oauth2/authorize?client_id=' +
                bot.id + '&scope=bot';
  callback(message);
}

function issueCouncilCommand(bot, callback) {
  var message = 'You can report a in-game bug or issue to the Issue Council: ' +
                'https://robertsspaceindustries.com/community/issue-council';
  callback(message);
}

function innYouTubeCommand(bot, callback) {
  var message = 'You can find and subscribe to INN on YouTube here: ' +
                'https://www.youtube.com/channel/UCCNuWjBJHxtwMCQosW-zicQ';
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

function innTwitchCommand(bot, callback) {
  var message = 'You can find and follow INN on Twitch here: ' +
                'https://twitch.tv/innlive';
  callback(message);
}

function rsiYouTubeCommand(bot, callback) {
  var message = 'You can find and subscribe to Star Citizen on YouTube here: ' +
                'https://www.youtube.com/user/RobertsSpaceInd';
  callback(message);
}

function rsiTwitterCommand(bot, callback) {
  var message = 'You can find and follow Star Citizen on Twitter here: ' +
                'https://twitter.com/RobertsSpaceInd';
  callback(message);
}

function rsiFacebookCommand(bot, callback) {
  var message = 'You can find and like Star Citizen on Facebook here: ' +
                'https://www.facebook.com/RobertsSpaceIndustries/';
  callback(message);
}

function rsiTwitchCommand(bot, callback) {
  var message = 'You can find and follow Star Citizen on Twitch here: ' +
                'https://twitch.tv/starcitizen';
  callback(message);
}

function rsiCommunityTwitchCommand(bot, callback) {
  var message = 'You can find and follow CIG Community on Twitch here: ' +
                'https://twitch.tv/cigcommunity';
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

    if (!otherInfo.hidden) {
      message += format('!%s - %s\n', commandName, otherInfo.help);
    }
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
