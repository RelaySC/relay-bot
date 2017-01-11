'use strict';

const Command = require('../command');

class YouTubeCommand extends Command {
    constructor() {
        super({
            command: 'rsiyt',
            description: 'Subscribe to Star Citizen on YouTube!',
            hidden: false
        });
    }
    
    respond(message, bot, config, resolve, reject) {
        resolve('You can find and subscribe to Star Citizen on YouTube here: ' +
                '<https://www.youtube.com/user/RobertsSpaceInd>');
    }
}

class TwitterCommand extends Command {
    constructor() {
        super({
            command: 'rsitwitter',
            description: 'Follow Star Citizen on Twitter!',
            hidden: false
        });
    }
    
    respond(message, bot, config, resolve, reject) {
        resolve('You can find and follow Star Citizen on Twitter at ' +
                '<https://twitter.com/RobertsSpaceInd> and ' +
                '<https://twitter.com/squadron_42>');
    }
}

class FacebookCommand extends Command {
    constructor() {
        super({
            command: 'rsifb',
            description: 'Like Star Citizen on Facebook!',
            hidden: false
        });
    }
    
    respond(message, bot, config, resolve, reject) {
        resolve('You can find and like Star Citizen on Facebook at ' +
                '<https://www.facebook.com/RobertsSpaceIndustries/> and ' +
                '<https://www.facebook.com/Squad42>');
    }
}

class TwitchCommand extends Command {
    constructor() {
        super({
            command: 'rsitwitch',
            description: 'Follow Star Citizen on Twitch!',
            hidden: false
        });
    }
    
    respond(message, bot, config, resolve, reject) {
        resolve('You can find and follow Star Citizen on Twitch here: ' +
                '<https://twitch.tv/starcitizen>');
    }
}

class CommunityTwitchCommand extends Command {
    constructor() {
        super({
            command: 'rsicommunitytwitch',
            description: 'Follow CIG Community on Twitch!',
            hidden: false
        });
    }
    
    respond(message, bot, config, resolve, reject) {
        resolve('You can find and follow CIG Community on Twitch here: ' +
                '<https://twitch.tv/cigcommunity>');
    }
}

module.exports = [YouTubeCommand, FacebookCommand, TwitchCommand,
                  TwitterCommand, CommunityTwitchCommand];