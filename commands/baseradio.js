'use strict';

const Command = require('../command');

const format = require('format');
const moment = require('moment-timezone');

const calendar = require('../helpers/calendar');

class BaseRadioCommand extends Command {
    constructor() {
        super({
            command: 'thebase',
            description:'Tune in to the Base Radio - Star Citizen\'s premier radio station.',
            hidden: false
        });
    }
    
    respond(message, bot, contents, resolve, reject) {
        calendar('v9tpadn0kem7ecn9k03c2mp41o@group.calendar.google.com').then((events) => {
            let response = 'You can tune in to the Base Radio on Twitch at ' +
                           '<https://www.twitch.tv/thebaseradio> and find out more at ' +
                           '<http://radio.starcitizenbase.com>/\n\n**Upcoming:**\n';

            for (let item of events) {
                let start = moment.tz(item.start.dateTime, item.start.timeZone);
                response += format('%s\t*in %s*\n', item.summary, start.toNow(true));
            }

            resolve(response);
        }, (error) => {
            reject(error);
        });
    }
}

class MastermateCommand extends Command {
    constructor() {
        super({
            command: 'mastermate',
            description:'It\'s the multitool you\'ve always wanted.',
            hidden: true
        });
    }
    
    respond(message, bot, contents, resolve, reject) {
        resolve('MasterMate™ is the new hands-free kit invented by Shiver' +
                ' Bathory so you can still play games, like Rocket League,' +
                ' while making sure the little chap is looked after.' +
                ' MasterMate™ is making sure it\'s not just the goal you\'re' +
                ' shooting at.\n\nWhy not pick up an expansion too?' +
                ' MasterMate™ can be extended with Autoerotic Asphyxiation,' +
                ' USB, Rift, A/C/, Asthma Edition and more!\n\n' +
                ' Get your MasterMate™ for only $69.99 now at your local' +
                ' banana market!\n*Does not include expansions. Standalone' +
                ' expansions sold separately.*');    
    }
}

module.exports = [BaseRadioCommand, MastermateCommand];