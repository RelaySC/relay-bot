'use strict';

const EventEmitter = require('events');
const format = require('format');

class Command extends EventEmitter {
    
    /*
    In order to create your own command, simply subclass this and
    replace the command and description properties then override the
    respond function to control what the bot does and isEligible to control
    when the bot responds.
    */
    
    constructor(options) {
        super();
        const { command, description, hidden } = options;

        this.command = command;
        this.description = description;
        this.hidden = hidden;
    }
    
    run(message, bot, config) {
        try {
            // Check if a command is eligible then run.
            if (this.isEligible(message, bot, config)) {
                let p = new Promise((resolve, reject) => this.respond(message, bot, config,
                                                                      resolve, reject));
                
                p.then((result) => {
                    this.emit('response', message, result);    
                }, (error) => {
                    this.emit('error', message, error);
                });
            }
        } catch (error) {
            // If an error happened with our command then send details
            // back to the bot.
            this.emit('error', message, error);
        }
    }
    
    stripMessage(message, config) {
        let prefix = config.get('commands.prefix');
        return message.content.replace(prefix + this.command, '');
    }
    
    isEligible(message, bot, config) {
        // Check whether this command should run. It is expected that
        // this is overriden for commands that have specific requirements.
        
        // Is this command disabled?
        let disabledCommands = config.get('commands.disabled');
        let disableAliases = config.get('commands.disableAliases');

        if (this.command in disabledCommands && disableAliases) {
            // If command is disabled and we're also disabling any aliases.
            console.log('not eligible disabled ' + this.command);
            return false;
        }
        
        // Does the message match this command explicitly?
        let prefix = config.get('commands.prefix');
        if (message.content.startsWith(prefix + this.command) && 
                !(this.command in disabledCommands)) {
            // If command is a match and the base command isn't disabled.
            console.log(format('Direct match command "%s" with "%s".',
                               this.command, prefix + this.command));
            return true;
        }
        
        // Is this message an alias to this command?
        let aliases = config.get('commands.aliases');
        if (aliases.hasOwnProperty(this.command)) {
            // If this command is configured with some aliases.
            let parts = message.content.split(' ');
            let commandName = parts[0].replace(config.get('commands.prefix'), '');
            
            if (aliases[this.command].indexOf(commandName) >= 0) {
                console.log(format('Alias match command "%s" with "%s".',
                                   this.command, prefix + this.command));
                return true;
            }
        }
        
        return false;
    }
    
    respond (message, bot, config, resolve, reject) {
        // Expected that this will be overriden by commands to provide functionality.
        resolve('');
    }
    
}

module.exports = Command;