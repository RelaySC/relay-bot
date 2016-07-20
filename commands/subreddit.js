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

        return this.regex().test(message.content) && message.content.indexOf('http') < 0;
    }
    
    respond(message, bot, config, resolve, reject) {
        let matches = [];
        let match;
        let regex = this.regex();
        while ((match = regex.exec(message.content))) {
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
    
    regex() {
        return new RegExp(/(?: |^|reddit\.com)\/?r\/([A-Za-z_0-9]{3,28})/, 'gm');
    }

}

module.exports = [SubredditCommand];
