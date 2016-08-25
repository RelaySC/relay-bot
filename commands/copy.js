'use strict';

const Command = require('../command');
const format = require('format');
const config = require('config');

class CopyCommand extends Command {
    constructor(client, schedule) {
        super({
            command: 'copy',
            description: 'Copy all messages between specified channels.',
            hidden: true
        });

        this.channelPairs = [];
        if (!config.has('copy')) {
            console.log('Copy: No copy pairs configured.');
            return;
        }

        console.log('Copy: Loading copy pairs.');
        for (let configPair of config.get('copy')) {
            let toChannel = client.Channels.get(configPair.toChannel.toString())

            this.channelPairs.push({
                fromChannel: configPair.fromChannel, // Don't need this loaded.
                toChannel: toChannel
            });
        } 
    }
    
    isEligible(message, bot, config) {
        for (let channelPair of this.channelPairs) {
            // Check if the channel we got this message from matches a pair.
            if (channelPair.fromChannel === message.channel.id) {
                this.currentToChannel = channelPair.toChannel;
                return true;
            }
        }
        return false;
    }

    respond(message, bot, config, resolve, reject) {
        console.log(format('Copy: Copying message from "#%s" on "%s" to "#%s" on "%s".',
                           message.channel.name, message.guild.name,
                           this.currentToChannel.name, 
                           this.currentToChannel.guild.name));
        this.currentToChannel.sendMessage(format('**Message from "%s" in "#%s" on "%s":**\n\n%s',
                                     message.author.username, message.channel.name,
                                     message.guild.name, message.content));
        resolve();
    }
}

module.exports = [CopyCommand];