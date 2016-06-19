'use strict';

const Command = require('../command');

const humanizeDuration = require('humanize-duration');
const moment = require('moment-timezone');
const formatNumber = require('format-number');
const format = require('format');

const funding = require('../helpers/funding');
const feed = require('../helpers/feeds');
const calendar = require('../helpers/calendar');

class StatsCommand extends Command {
    constructor() {
        super({
            command: 'stats',
            description: 'Check Star Citizen\'s funding levels, citizen and ship count.',
            hidden: false
        });
        
        // We need to establish our number formatting settings.
        this.fundingFormat = formatNumber({prefix: '$', round: 2});
        this.otherFormat = formatNumber({});
        
        // We need to get the initial funding when we load this command.
        // So the first time this is called we'll get a delta.
        funding().then((current) => {
            this.history = current;
            console.log('Funding: Received initial funding values.');
        }, (error) => {});
    }
    
    differenceFormat(value, formatFn) {
        let formattedValue = formatFn(value);
        
        if (!formattedValue.startsWith('-')) {
            return '+' + formattedValue;
        }
        return formattedValue;
    }
    
    respond(message, bot, config, resolve, reject) {  
        funding().then((current) => {
            let fundsDiff = current.funds.value - this.history.funds.value;
            let citizensDiff = current.citizens.value - this.history.citizens.value;
            let fleetDiff = current.fleet.value - this.history.fleet.value;

            let fundsSince = moment(this.history.funds.when).fromNow();
            let citizensSince = moment(this.history.citizens.when).fromNow();
            let fleetSince = moment(this.history.fleet.when).fromNow();

            let duration = moment.duration(moment().diff(moment('2012-10-18')));
            let humanizedDuration = humanizeDuration(duration.asMilliseconds(),
                                                     {round: true, units: ['mo', 'w']});

            let response = 'Star Citizen is currently %s funded (%s since %s).' +
                           ' There are %s citizens (%s since %s) and the UEE fleet' +
                           ' is %s strong (%s since %s). It has been %s since the' +
                           ' Star Citizen kickstarter.';
            let formattedResponse = format(response,
                                           this.fundingFormat(current.funds.value),
                                           this.differenceFormat(fundsDiff, this.fundingFormat),
                                           fundsSince,
                                           this.otherFormat(current.citizens.value),
                                           this.differenceFormat(citizensDiff, this.otherFormat),
                                           citizensSince,
                                           this.otherFormat(current.fleet.value),
                                           this.differenceFormat(fleetDiff, this.otherFormat),
                                           fleetSince,
                                           humanizedDuration);

            this.history = current;
            resolve(formattedResponse);
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
        feed('https://robertsspaceindustries.com/comm-link/rss').then((items) => {
            let itemsForDisplay = items.slice(0, 9);

            let response = '**Check out some recent content:**\n';

            for (let item of itemsForDisplay) {
                let pubDate = moment(item.pubDate).fromNow();
                response += format('%s\t*posted %s.*\n',
                                   item.title, pubDate, item.author);
            }
            
            response += '\n**Check out the rest of the Comm-Link content at:** ' +
                        'https://robertsspaceindustries.com/comm-link/';
            resolve(response);
        }, (error) => {
            reject(error);
        });
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

module.exports = [TimeCommand, StatsCommand, RSICommand, IssueCommand];