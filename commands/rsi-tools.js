'use strict';

const Command = require('../command');

const humanizeDuration = require('humanize-duration');
const moment = require('moment-timezone');
const format = require('format');

const funding = require('../helpers/funding');
const feed = require('../helpers/feeds');
const starmap = require('../helpers/starmap');
const calendar = require('../helpers/calendar');

class StatsCommand extends Command {
    constructor() {
        super({
            command: 'stats',
            description: 'Check Star Citizen\'s funding levels, citizen and ship count.',
            hidden: false
        });
    }
    
    respond(message, bot, config, resolve, reject) {        
        funding().then((response) => {
            let extraResponse = ' It has been %s since the Star Citizen kickstarter.';

            let duration = moment.duration(moment().diff(moment('2012-10-18')));
            let humanizedDuration = humanizeDuration(duration.asMilliseconds(),
                                                     {round: true, units: ['mo', 'w']});

            let extraResponseFormatted = format(extraResponse, humanizedDuration);
            resolve(response + extraResponseFormatted);
        }, (error) => {
            reject(error);
        });
    }
}

class RSICommand extends Command {
    constructor() {
        super({
            command: 'rsi',
            description: 'Get the latest RSI posts.',
            hidden: false
        });
    }
    
    respond(message, bot, config, resolve, reject) {
        feed('https://robertsspaceindustries.com/comm-link/rss').then((response) => {
            let extraResponse = '\n**Check out the rest of the Comm-Link content at:** ' +
                       'https://robertsspaceindustries.com/comm-link/';
            resolve(response + extraResponse);
        }, (error) => {
            reject(error);
        });
    }
}

class StarmapCommand extends Command {
    constructor() {
        super({
            command: 'starmap',
            description: 'Check out the ARK Starmap!',
            hidden: false
        });
    }
    
    respond(message, bot, config, resolve, reject) {
        let messageContents = this.stripMessage(message, config);
        
        if (!messageContents) {
            // If we haven't been passed anything.
            resolve('You can check out the ARK Starmap at: ' +
                    'https://robertsspaceindustries.com/starmap');
            return;
        }
        
        let args = messageContents.split(' ');
        
        if (args.length === 1) {
            // If we've been passed only a system name.
            starmap(args[0], undefined).then((response) => {
                resolve(response);
            }, (error) => {
                reject(error);
            });
        } else {
            // If the user has passed us both a system name and a
            // celestial object name.
            let celestialObjectName = args.slice(1).join(' ');
            
            starmap(args[0], celestialObjectName).then((response) => {
                resolve(response);
            }, (error) => {
                reject(error);
            });
        }
    }
}

class TimeCommand extends Command {
    constructor() {
        super({
            command: 'time',
            description: 'Check the current time at CIG studios.',
            hidden: false
        });
    }
    
    respond(message, bot, config, resolve, reject) {
        let response = 'It it is currently %s UTC. And it is,\n\n' +
                      '%s at CIG LA in Los Angeles, California (%s),\n' +
                      '%s at CIG Austin in Austin, Texas (%s),\n' +
                      '%s at F42 UK in Manchester, England (%s),\n' +
                      '%s at F42 DE in Frankfurt, Germany (%s),\n' +
                      '%s at Turbulent in Montreal, Canada (%s).';

        let utc = moment().tz('UTC').format('hh:mma');

        let cigLA = moment().tz('America/Los_Angeles').format('hh:mma');
        let cigLAZoneName = moment().tz('America/Los_Angeles').format('z');

        let cigAustin = moment().tz('America/Chicago').format('hh:mma');
        let cigAustinZoneName = moment().tz('America/Chicago').format('z');

        let f42UK = moment().tz('Europe/London').format('hh:mma');
        let f42UKZoneName = moment().tz('Europe/London').format('z');

        let f42DE = moment().tz('Europe/Berlin').format('hh:mma');
        let f42DEZoneName = moment().tz('Europe/Berlin').format('z');

        let turbulent = moment().tz('America/Montreal').format('hh:mma');
        let turbulentZoneName = moment().tz('America/Montreal').format('z');

        let formattedResponse = format(response, utc,
                                       cigLA, cigLAZoneName,
                                       cigAustin, cigAustinZoneName,
                                       f42UK, f42UKZoneName,
                                       f42DE, f42DEZoneName,
                                       turbulent, turbulentZoneName);
        resolve(formattedResponse);
    }
}

class IssueCommand extends Command {
    constructor() {
        super({
            command: 'issue',
            description: 'Report a bug/issue to the Issue Council!',
            hidden: false
        });
    }
    
    respond(message, bot, config, resolve, reject) {
        resolve('You can report a in-game bug or issue to the Issue Council: ' +
                'https://robertsspaceindustries.com/community/issue-council');
    }
}

module.exports = [TimeCommand, StatsCommand, StarmapCommand, 
                  RSICommand, IssueCommand];