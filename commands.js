'use strict';

const funding = require('./funding');
const starmap = require('./starmap');
const feed = require('./feeds');
const moment = require('moment-timezone');
const format = require('format');

const commands = {
  invite: {
    fn: inviteCommand,
    help: 'Learn how to get this bot on your server!',
    hidden: false
  },
  help: {
    fn: helpCommand,
    help: 'What can this bot do?',
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
  funds: {
    fn: statsCommand,
    help: 'Check Star Citizen\'s funding levels, citizen and ship count.',
    hidden: true
  },
  citizens: {
    fn: statsCommand,
    help: 'Check Star Citizen\'s funding levels, citizen and ship count.',
    hidden: true
  },
  uee: {
    fn: statsCommand,
    help: 'Check Star Citizen\'s funding levels, citizen and ship count.',
    hidden: true
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
  },
  status: {
    fn: statusCommand,
    help: 'Check the bot is still running.',
    hidden: true
  },
  org: {
    fn: orgCommand,
    help: 'Get a link to the INN organization.',
    hidden: false
  },
  starmap: {
    fn: starmapCommand,
    help: 'Check out the ARK Starmap!',
    hidden: false
  },
  inn: {
    fn: innCommand,
    help: 'Get the latest INN posts.',
    hidden: false
  },
  rsi: {
    fn: rsiCommand,
    help: 'Get the latest RSI posts.',
    hidden: false
  },
  loveme: {
    fn: loveMeCommand,
    help: 'Get insulted.',
    hidden: true
  }
};

function statsCommand(sender, bot, args, callback) {
  funding(message => {
    let extraMessage = ' It has been %s since the Star Citizen kickstarter.';
    let extraMessageFormatted = format(extraMessage,
                                       moment('2012-10-18').fromNow(true));
    callback(message + extraMessageFormatted);
  });
}

function innCommand(sender, bot, args, callback) {
  feed('http://imperialnews.network/feed/', message => {
    let extraMessage = '\n**Check out the rest of INN\'s content at:** ' +
                       'http://imperialnews.network/';
    callback(message + extraMessage);
  });
}

function rsiCommand(sender, bot, args, callback) {
  feed('https://robertsspaceindustries.com/comm-link/rss', message => {
    let extraMessage = '\n**Check out the rest of the Comm-Link content at:** ' +
                       'https://robertsspaceindustries.com/comm-link/';
    callback(message + extraMessage);
  });
}

function starmapCommand(sender, bot, args, callback) {
  if (args.length === 0) {
    callback('You can check out the ARK Starmap at: ' +
             'https://robertsspaceindustries.com/starmap');
  } else if (args.length === 1) {
    starmap(args[0], undefined, message => {
      callback(message);
    });
  } else {
    let celestialObjectName = args.slice(1).join(' ');
    starmap(args[0], celestialObjectName, message => {
      callback(message);
    });
  }
}

function inviteCommand(sender, bot, args, callback) {
  let message = 'You can add me to your server by instructing someone with' +
                ' the \"Manage Server\" permission to visit this page:\n' +
                'https://discordpp.com/oauth2/authorize?client_id=' +
                bot.id + '&scope=bot';
  callback(message);
}

function orgCommand(sender, bot, args, callback) {
  let message = 'You can check out the INN Organization on RSI here: ' +
                'https://robertsspaceindustries.com/orgs/INN';
  callback(message);
}

function issueCouncilCommand(sender, bot, args, callback) {
  let message = 'You can report a in-game bug or issue to the Issue Council: ' +
                'https://robertsspaceindustries.com/community/issue-council';
  callback(message);
}

function innYouTubeCommand(sender, bot, args, callback) {
  let message = 'You can find and subscribe to INN on YouTube here: ' +
                'https://www.youtube.com/channel/UCCNuWjBJHxtwMCQosW-zicQ';
  callback(message);
}

function innTwitterCommand(sender, bot, args, callback) {
  let message = 'You can find and follow INN on Twitter here: ' +
                'https://twitter.com/inn_starcitizen';
  callback(message);
}

function innFacebookCommand(sender, bot, args, callback) {
  let message = 'You can find and like INN on Facebook here: ' +
                'https://www.facebook.com/ImperialNewsNetworkSC';
  callback(message);
}

function innTwitchCommand(sender, bot, args, callback) {
  let message = 'You can find and follow INN on Twitch here: ' +
                'https://twitch.tv/innlive';
  callback(message);
}

function rsiYouTubeCommand(sender, bot, args, callback) {
  let message = 'You can find and subscribe to Star Citizen on YouTube here: ' +
                'https://www.youtube.com/user/RobertsSpaceInd';
  callback(message);
}

function rsiTwitterCommand(sender, bot, args, callback) {
  let message = 'You can find and follow Star Citizen on Twitter here: ' +
                'https://twitter.com/RobertsSpaceInd';
  callback(message);
}

function rsiFacebookCommand(sender, bot, args, callback) {
  let message = 'You can find and like Star Citizen on Facebook here: ' +
                'https://www.facebook.com/RobertsSpaceIndustries/';
  callback(message);
}

function rsiTwitchCommand(sender, bot, args, callback) {
  let message = 'You can find and follow Star Citizen on Twitch here: ' +
                'https://twitch.tv/starcitizen';
  callback(message);
}

function rsiCommunityTwitchCommand(sender, bot, args, callback) {
  let message = 'You can find and follow CIG Community on Twitch here: ' +
                'https://twitch.tv/cigcommunity';
  callback(message);
}

function aboutCommand(sender, bot, args, callback) {
  let message = 'I\'m INNBot, a Rogerian psychotherapist hired by the' +
                ' Imperial News Network. You can chat for a therapy session' +
                ' or tell me some commands. I\'m an open source' +
                ' psychotherapist too, check my source out here:' +
                ' https://github.com/ImperialNewsNetwork/inn-bot.' +
                ' You can find out about the Imperial News Network here:' +
                ' http://imperialnews.network.\n\n' +
                'To find the commands I can run, type !help.';
  callback(message);
}

function helpCommand(sender, bot, args, callback) {
  let message = 'Here\'s all of my commands:\n\n';
  Object.keys(commands).forEach(commandName => {
    let otherInfo = commands[commandName];

    if (!otherInfo.hidden) {
      message += format('!%s - %s\n', commandName, otherInfo.help);
    }
  });
  callback(message);
}

function statusCommand(sender, bot, args, callback) {
  let message = 'I\'m doing great! I\'ve been running for %s without a hitch.' +
                ' For more information about me, type !about.';
  let formattedMessage = format(message,
                                moment.duration(process.uptime()).humanize());
  callback(formattedMessage);
}

function loveMeCommand(sender, bot, args, callback) {
  let message = 'I will never love you %s. You are a dick.';
  if (sender.id === '104895277856501760') {
    message = 'I will always love you, creator.';
  }
  callback(format(message, sender.username));
}

function timeCommand(sender, bot, args, callback) {
  let message = 'It it is currently %s UTC. And it is,\n\n' +
                '%s at CIG LA in Los Angeles, California (%s),\n' +
                '%s at CIG Austin in Austin, Texas (%s),\n' +
                '%s at F42 UK in Manchester, England (%s),\n' +
                '%s at F42 DE in Frankfurt, Germany (%s),\n' +
                '%s at Turbulent in Montreal, Canada (%s).';

  let utc = moment().tz('UTC').format('hh:mma');

  let cigLA = moment().tz('America/Los_Angeles').format('hh:mma');
  let cigLAZoneName = moment().tz('America/Los_Angeles').format('z');

  let cigAustin = moment().tz('America/Chicago').format('hh:mma');
  let cigAustinZoneName = moment().tz('America/Chicago').format('z');

  let f42UK = moment().tz('Europe/London').format('hh:mma');
  let f42UKZoneName = moment().tz('Europe/London').format('z');

  let f42DE = moment().tz('Europe/Berlin').format('hh:mma');
  let f42DEZoneName = moment().tz('Europe/Berlin').format('z');

  let turbulent = moment().tz('America/Montreal').format('hh:mma');
  let turbulentZoneName = moment().tz('America/Montreal').format('z');

  let formattedMessage = format(message, utc,
                                cigLA, cigLAZoneName,
                                cigAustin, cigAustinZoneName,
                                f42UK, f42UKZoneName,
                                f42DE, f42DEZoneName,
                                turbulent, turbulentZoneName);
  callback(formattedMessage);
}

function run(message, bot, callback) {
  let messageContent = message.content;
  if (messageContent.startsWith('!')) {
    let parts = messageContent.split(' ');
    let commandName = parts[0].substring(1);

    if (commands.hasOwnProperty(commandName)) {
      commands[commandName].fn(message.author, bot,
                               parts.slice(1), message => {
        callback(message);
      });
    } else {
      callback('Command does not exist. Refer to !help for list of commands.');
    }
  }
}

module.exports = run;
