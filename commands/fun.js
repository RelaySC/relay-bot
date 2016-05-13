'use strict';

const Command = require('../command');
const format = require('format');

class LoveMeCommand extends Command {
    constructor() {
        super({
            command: 'loveme',
            description: 'Get Insulted',
            hidden: true
        });
    }
    
    respond(message, bot, config, resolve, reject) {
        let response = 'I will never love you %s. You are a dick.';
        
        if (message.author.id === '104895277856501760') {
            response = 'I will always love you, creator.';
        }

        resolve(format(response, message.author.username));
    }
}

module.exports = [LoveMeCommand];