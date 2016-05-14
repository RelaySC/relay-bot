'use strict';

const Command = require('../command');

class JakeAcappellaCommand extends Command {
    constructor() {
        super({
            command: 'jakeacappella',
            description: 'Follow JakeAcappella on Twitch!',
            hidden: false
        });
    }
    
    respond(message, bot, config, resolve, reject) {
        resolve('You can follow JakeAcappella on Twitch at ' +
                'https://www.twitch.tv/jakeacappella');
    }
}

class PapaDolvakCommand extends Command {
    constructor() {
        super({
            command: 'papadolvak',
            description: 'Follow PapaDolvak on Twitch!',
            hidden: false
        });
    }
    
    respond(message, bot, config, resolve, reject) {
        resolve('You can follow PapaDolvak on Twitch at ' +
                'https://www.twitch.tv/papadolvak');
    }
}

module.exports = [PapaDolvakCommand, JakeAcappellaCommand];