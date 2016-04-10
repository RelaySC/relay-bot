var elizabot = require('./elizabot');
var Discordie = require('discordie');
var client = new Discordie();

if (process.argv.length != 3) {
  console.log('ERROR: You must supply a Discord API Token.');
  process.exit(1);
}

var eliza = new elizabot.ElizaBot();

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
                        '!funds - Find out Star Citizen\'s funding level.\n' +
                        '!citizen - Find out Star Citizen\'s citizen count.\n' +
                        '!uee - Find out Star Citizen\'s ship count.\n' +
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
