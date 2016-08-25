'use strict';

const Command = require('../command');
const format = require('format');

class DebugCommand extends Command {
    constructor() {
        super({
            command: 'debug',
            description: 'Find out more about the channel.',
            hidden: true
        });
    }
    
    respond(message, bot, config, resolve, reject) {
        // Respond to a private message with the only information we can.
        if (message.isPrivate) {
            let response = format('**Responding to:** %s (%s)\n\n', 
                                  message.author.username, message.author.id); 

            resolve(response + 
                    'You can get more debug information in a regular guild.');
            return;
        }

        // Respond to a public message with tons of information.
        let response = '**Current Guild:** %s (%s)\n' + 
                       '**Current Channel:** #%s (%s)\n' +
                       '**Responding to:** %s (%s)\n\n' +
                       '**Guild Owner:** %s (%s)\n' +
                       '**Guild Region:** %s\n' +
                       '**Channels:**\n';

        for (let channel of message.guild.channels) {
            let emote = channel.type === 'voice' ? ':speaker:' : ':keyboard:';
            let channelName = (channel.type === 'text' ? '#' : '') + channel.name;

            response += format('- %s %s (%s)\n', emote, channelName, channel.id);
        }

        response += '\nIf you have no idea what any of this is then ignore it! ' +
                    'But if you ran this then be a good guy and delete your ' + 
                    'message once you\'re done.';
        resolve(format(response,
                       message.guild.name, message.guild.id,
                       message.channel.name, message.channel.id,
                       message.author.username, message.author.id,
                       message.guild.owner.username, message.guild.owner.id,
                       message.guild.region));
    }
}

module.exports = [DebugCommand];