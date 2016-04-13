'use strict';

const eliza = require('./eliza/elizabot');
const commands = require('./commands');
const Discordie = require('discordie');
const format = require('format');
const moment = require('moment');
const fs = require('fs');
const client = new Discordie();

client.connect({
  token: process.env.INNBOT_DISCORD_BOTUSER_TOKEN
});

let appID = process.env.INNBOT_DISCORD_CLIENTID;

client.Dispatcher.on('GATEWAY_READY', e => {
  console.log('Connected as: ' + client.User.username);
  console.log('Add to Server URL: ' +
              'https://discordapp.com/oauth2/authorize?client_id=' +
              appID + '&scope=bot');
  client.User.setGame({name: 'imperialnews.network'});
  client.User.edit(null, null, fs.readFileSync('bot-avatar.jpg'));
});

client.Dispatcher.on('MESSAGE_CREATE', e => {
  let currentTime = moment().format('YYYY-MM-DD HH:mm:ss ');
  try {
    if (e.message.author.id === client.User.id || e.message.author.bot) {
      // Don't reply to yourself or other bots.
      return;
    }

    commands(e.message, client.User, {appID: appID},
             (message, commandName) => {
      if (e.message.isPrivate) {
        console.log(currentTime +
                    format('Received "%s" command in private message from ' +
                           '"%s" (%s).',
                           commandName, e.message.author.username,
                           e.message.author.id));
      } else {
        console.log(currentTime +
                    format('Received "%s" command from "%s" (%s) in #%s on ' +
                           '"%s."',
                           commandName, e.message.author.username,
                           e.message.author.id, e.message.channel.name,
                           e.message.guild.name));
      }

      e.message.channel.sendMessage(message);
    });

    if (client.User.isMentioned(e.message) || e.message.isPrivate) {
      // If our bot was mentioned or the message was in a DM.

      let messageContent = e.message.content;

      if (!e.message.isPrivate) {
        // Non-private messages always have a <@bot_id> in order to mention the
        // bot. We want to remove this so it doesn't get included in the
        // responses.
        let mention = '<@' + client.User.id + '>';
        messageContent = messageContent.replace(mention, '').trim();
        console.log(currentTime +
                    format('Message recieved from "%s" (%s) in #%s on "%s".',
                           e.message.author.username, e.message.author.id,
                           e.message.channel.name, e.message.guild.name));
      } else {
        if (messageContent.startsWith('!')) {
          // We can't return inside the command callback so private messages.
          // That are commands should be stopped here.
          return;
        }
        console.log(currentTime +
                    format('Private message recieved from "%s" (%s).',
                           e.message.author.username, e.message.author.id));
      }

      let response = eliza.transform(messageContent);
      e.message.channel.sendMessage(response);
    }
  } catch (error) {
    console.log(currentTime + error);

    try {
      e.message.channel.sendMessage('I\'ve had an error. That\'s not good.');
    } catch (err) {
      console.log(currentTime + 'Attempted to alert user of error. ' + error);
    }
  }
});
