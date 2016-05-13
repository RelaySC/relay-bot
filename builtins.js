'use strict';

const Command = require('./command');

const humanizeDuration = require('humanize-duration');
const format = require('format');

class EchoCommand extends Command {
    constructor() {
        super({
            command: 'echo', 
            description: 'Want to hear yourself speak?',
            hidden: false
        });
    }
    
    respond(message, bot, config, resolve, reject) {
        resolve(this.stripMessage(message.content));
    }
    
}

class StatusCommand extends Command {
    constructor() {
        super({
            command: 'status',
            description: 'Find out how I\'m doing.',
            hidden: false
        });
    }
    
    respond(message, bot, config, resolve, reject) {
        let response = 'I\'m doing great! I\'ve been running for %s without a hitch.' +
                       ' For more information about me, type !about.';
        let uptime = humanizeDuration(process.uptime() * 1000, {round: true});
        let formattedResponse = format(response, uptime);
        resolve(formattedResponse);
    }
    
}

class AboutCommand extends Command {
    constructor() {
        super({
            command: 'about',
            description: 'Find out more about me!',
            hidden: false
        });
    }
    
    respond(message, bot, config, resolve, reject) {
        resolve(config.get('bot.description'));
    }
}

class InviteCommand extends Command {
    constructor() {
        super({
            command: 'invite',
            description: 'Find out how to invite me to your own server!',
            hidden: false
        });
    }
    
    respond(message, bot, config, resolve, reject) {
        let appId = config.get('settings.appId');
        resolve('You can add me to your server by instructing someone with' +
                ' the \"Manage Server\" permission to visit this page:\n' +
                'https://discordapp.com/oauth2/authorize?client_id=' +
                appId + '&scope=bot');
    }
}

class ImproveCommand extends Command {
    constructor() {
        super({
            command: 'improve',
            description: 'Want to suggest improvements to this bot?',
            hidden: false
        });
    }
    
    respond(message, bot, config, resolve, reject) {
        resolve(format('You can suggest bot improvements by submitting ' +
                       'an issue here: %s/issues',
                       config.get('bot.repositoryUrl')));
    }
}

module.exports = [StatusCommand, EchoCommand, AboutCommand, InviteCommand];