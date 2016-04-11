'use strict';

const eliza = require('./eliza/elizabot');
const commands = require('./commands');
const Discordie = require('discordie');
const client = new Discordie();

if (process.argv.length != 3) {
  console.log('ERROR: You must supply a Discord API Token.');
  process.exit(1);
}

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

  commands(e.message.content, client.User, message => {
    e.message.channel.sendMessage(message);
  })

  if (client.User.isMentioned(e.message) || e.message.isPrivate) {
    // If our bot was mentioned or the message was in a DM.

    let messageContent = e.message.content;

    if (!e.message.isPrivate) {
      // Non-private messages always have a <@bot_id> in order to mention the
      // bot. We want to remove this so it doesn't get included in the
      // responses.
      let mention = '<@' + client.User.id + '>';
      messageContent = messageContent.replace(mention, '').trim();
    }

    let response = eliza.transform(messageContent);
    e.message.channel.sendMessage(response);
  }
});
