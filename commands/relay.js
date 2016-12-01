'use strict';

const Command = require('../command');

const moment = require('moment-timezone');
const format = require('format');

const feed = require('../helpers/feeds');
const calendar = require('../helpers/calendar');

class YouTubeCommand extends Command {
    constructor() {
        super({
            command: 'relayyt',
            description: 'Subscribe to the Relay on YouTube!',
            hidden: false
        });
    }
    
    respond(message, bot, config, resolve, reject) {
        resolve('You can find and subscribe to Relay on YouTube here: ' +
                'https://www.youtube.com/channel/UCoMrKF4B1Of2bKHk8JbwfWQ');
    }
}

class TwitterCommand extends Command {
    constructor() {
        super({
            command: 'relaytwitter',
            description: 'Follow Relay on Twitter!',
            hidden: false
        });
    }
    
    respond(message, bot, config, resolve, reject) {
        resolve('You can find and follow Relay on Twitter at ' +
                'https://twitter.com/relay_sc');
    }
}

class FacebookCommand extends Command {
    constructor() {
        super({
            command: 'relayfb',
            description: 'Like Relay on Facebook!',
            hidden: false
        });
    }
    
    respond(message, bot, config, resolve, reject) {
        resolve('You can find and like Relay on Facebook at ' +
                'https://www.facebook.com/profile.php?id=100014282176912');
    }
}

class TwitchCommand extends Command {
    constructor() {
        super({
            command: 'relaytwitch',
            description: 'Follow Relay on Twitch!',
            hidden: false
        });
    }
    
    respond(message, bot, config, resolve, reject) {
        resolve('You can find and follow Relay on Twitch here: ' +
                'https://www.twitch.tv/relay_sc');
    }
}

class RelayCommand extends Command {
    constructor() {
        super({
            command: 'relay',
            description: 'Get the latest Relay posts.',
            hidden: false
        });
    }
    
    respond(message, bot, config, resolve, reject) {
        feed('https://relay.sc/feed/rss').then((items) => {
            calendar('inn.sc_5gacj7dfkc14ikledscvp2mgfk@group.calendar.google.com').then((events) => {
                let itemsForDisplay = items.slice(0, 9);
                let response = '**Check out recent Relay content:**\n';

                for (let item of itemsForDisplay) {
                    let pubDate = moment(item.pubDate).fromNow();
                    response += format('%s\t*written %s by %s.*\n',
                                       item.title, pubDate, item.author);
                }

                response += '\n**Upcoming:**\n';
                for (let event of events) {

                    let start = moment.tz(event.start.dateTime, event.start.timeZone);
                    if (event.start.hasOwnProperty('date')) {
                        // If it is an all day event.
                        start = moment(event.start.date);
                    }

                    response += format('%s\t*on %s in %s*\n',
                                       event.summary, event.location, start.toNow(true));
                }

                response += '\n**Check out the rest of Relay\'s content at:** ' +
                            'https://relay.sc/';
                resolve(response);
            }, (error) => {
                reject(error, output='We weren\'t able to reach the calendar.');
            });
        }, (error) => {
            reject(error);
        });
    }
}

class OrgCommand extends Command {
    constructor() {
        super({
            command: 'org',
            description: 'Get a link to the Relay organization.',
            hidden: false
        });
    }
    
    respond(message, bot, config, resolve, reject) {
        resolve('You can check out the Relay Organization on RSI here: ' +
                'https://robertsspaceindustries.com/orgs/RELAY');
    }
}

class GitLabCommand extends Command {
    constructor() {
        super({
            command: 'gitlab',
            description: 'Check out Relay\'s open source projects.',
            hidden: false
        });
    }
    
    respond(message, bot, config, resolve, reject) {
        resolve('You can check out the Relay\'s open source projects here: ' +
                'https://gitlab.com/Relay_SC/');
    }
}

class BulkheadsCommand extends Command {
    constructor() {
        super({
            command: 'bulkheads',
            description: 'Catch up with the latest craziness from the Imperitiam.',
            hidden: false
        });
    }
    
    respond(message, bot, config, resolve, reject) {
        resolve('Catch up with the latest craziness from the Imperitiam: ' +
                'http://bulkheads.tv');
    }
}

module.exports = [YouTubeCommand, FacebookCommand, TwitchCommand, BulkheadsCommand,
                  TwitterCommand, RelayCommand, OrgCommand, GitLabCommand];