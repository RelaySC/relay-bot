'use strict';

const Command = require('../command');

class SubredditCommand extends Command {
    constructor() {
        super({
            command: 'subreddit',
            description: 'Check out Star Citizen on reddit!',
            hidden: false
        });
    }
    
    respond(message, bot, config, resolve, reject) {
        resolve('You can find the Star Citizen subreddit here: ' +
                'https://reddit.com/r/starcitizen');
    }
}

module.exports = [SubredditCommand];