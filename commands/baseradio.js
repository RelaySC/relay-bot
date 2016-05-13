'use strict';

const Command = require('../command');
const calendar = require('../helpers/calendar');

class BaseRadioCommand extends Command {
    constructor() {
        super({
            command: 'thebase',
            description:'Tune in to the Base Radio - Star Citizen\'s premier radio station.',
            hidden: false
        });
    }
    
    respond(message, bot, contents) {
        let response = 'You can tune in to the Base Radio on Twitch at ' +
                       'https://www.twitch.tv/thebaseradio and find out more at ' +
                       'http://radio.starcitizenbase.com/\n';
        calendar('v9tpadn0kem7ecn9k03c2mp41o@group.calendar.google.com',
            calendarMessage => { return message + calendarMessage; });
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
    
    respond(message, bot, contents) {
        return  'MasterMate™ is the new hands-free kit invented by Shiver' +
                ' Bathory so you can still play games, like Rocket League,' +
                ' while making sure the little chap is looked after.' +
                ' MasterMate™ is making sure it\'s not just the goal you\'re' +
                ' shooting at.\n\nWhy not pick up an expansion too?' +
                ' MasterMate™ can be extended with Autoerotic Asphyxiation,' +
                ' USB, Rift, A/C/, Asthma Edition and more!\n\n' +
                ' Get your MasterMate™ for only $69.99 now at your local' +
                ' banana market!\n*Does not include expansions. Standalone' +
                ' expansions sold separately.*';    
    }
}

module.exports = [BaseRadioCommand, MastermateCommand];