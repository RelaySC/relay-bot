'use strict';

const Command = require('../command');

const format = require('format');

class SubredditCommand extends Command {
    
    constructor() {
        super({
           command: 'autolinksubreddit',
           description: 'Automatically links a subreddit when mentioned.',
           hidden: true 
        });  
    }
    
    isEligible(message, bot, config) {
        if (config.has('subreddit.disable') && config.get('subreddit.disable')) {
            return;
        }
        // We have a rough check here so that we don't use the
        // regex for every message.
        return /\b\/?r\/([A-Za-z_]{1,28})/gm.exec(message.content);
    }
    
    respond(message, bot, config, resolve, reject) {
        let subredditRegex = /\b\/?r\/([A-Za-z_]{1,28})/gm;
        
        let matches = [];
        let match;
        while ((match = subredditRegex.exec(message.content))) {
            matches.push('https://reddit.com/r/' + match[1]);
        } 
        
        if (matches.length == 1) {
            resolve(format('I noticed you mentioned the following subreddit: %s',
                           matches[0]));
        } else if (matches.length > 1) {
            resolve(format('I noticed you mentioned the following subreddits: %s',
                           matches.join(', ')));
        }
    }
    
}

module.exports = [SubredditCommand];