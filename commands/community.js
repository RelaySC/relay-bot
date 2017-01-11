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
                '<https://reddit.com/r/starcitizen>');
    }
}

class PackagesCommand extends Command {
    constructor() {
        super({
            command: 'packages',
            description: 'Check out fastcart\'s package comparison spreadsheet!',
            hidden: false
        });
    }
    
    respond(message, bot, config, resolve, reject) {
        resolve('You can find the amazing package comparison spreadsheet by fastcart at: ' +
                '<https://docs.google.com/spreadsheets/d/1ojxR84DJlX9i7Zu0ZrYkWPhKQUYIcK5bx5Ia8fQgimY/edit?usp=sharing>');
    }
}


module.exports = [SubredditCommand, PackagesCommand];