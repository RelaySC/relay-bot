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

        return /r\/([A-Za-z_0-9]{1,28})/gm.exec(message.content) &&
            message.content.indexOf('https://reddit.com/') < 0 &&
            message.content.indexOf('https://www.reddit.com/') < 0 &&
            message.content.indexOf('http://reddit.com/') < 0 && 
            message.content.indexOf('http://www.reddit.com/') < 0;
    }
    
    respond(message, bot, config, resolve, reject) {
        let subredditRegex = /\b\/?r\/([A-Za-z_0-9]{1,28})/gm;
        
        let matches = [];
        let match;
        while ((match = subredditRegex.exec(message.content))) {
            matches.push('https://reddit.com/r/' + match[1]);
        } 
        
        if (matches.length == 1) {
            resolve(format('I noticed %s mentioned the following subreddit: %s',
                           message.author.username,
                           matches[0]));
        } else if (matches.length > 1) {
            resolve(format('I noticed %s mentioned the following subreddits: %s',
                           message.author.username,
                           matches.join(', ')));
        }
    }
    
}

module.exports = [SubredditCommand];