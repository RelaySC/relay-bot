'use strict';

const Command = require('../command');

const config = require('config');
const request = require('request');
const format = require('format');

class RepositoryCommand extends Command {
    
    constructor(client, schedule) {
        // These values aren't really needed when the default help() isn't being 
        // used but are required.
        super({
            command: 'repository',
            description: 'Loads command definitions from online repositories.',
            hidden: true
        });

        if (config.has('repository.sources')) {
            console.log('Repository: Initial Loading of Repositories.')
            this.load();

            schedule.scheduleJob('0,5,10,15,20,25,30,35,40,45,50,55 * * * *', () => {
                console.log('Repository: Reloading Repositories.');
                this.load();
            });
        } else {
            // If we don't find any repositories then we log this and don't schedule anything.
            console.log('Repository: No repositories configured.');
            this.repositoryCommands = {};
        }
    }
    
    load() {
        this.repositoryCommands = {};
        
        let repositoryUrls = config.get('repository.sources');
        // We load all our repository urls from the configuration when the
        // plugin is registered and load the commands.
        for (let repositoryUrl of repositoryUrls) {
            this.parse(repositoryUrl).then(parsedCommands => {
                // We keep all our commands in a command-name-keyed object.
                for (let commandName of Object.keys(parsedCommands)) {
                    this.repositoryCommands[commandName] = parsedCommands[commandName];
                }
                console.log(format('Repository: Loaded %s commands from "%s".',
                                Object.keys(parsedCommands).length, repositoryUrl));
            }, error => {
                console.log(format('Repository: An error occured when loading "%s".\n\t%s',
                                    repositoryUrl, error));
            });
        }
    }
    
    parse(repositoryUrl) {
        return new Promise((resolve, reject) => {
            let buffer = '';
            let req = request(repositoryUrl);
            req.on('error', error => {
                reject(error);
            });
            
            req.on('response', res => {
                if (res.statusCode != 200) {
                    req.emit('error', new Error('Response Code was not 200.'));
                }
            });
            
            req.on('data', body => {
                buffer += body;
            });
            
            req.on('end', () => {
                let parsedResponse = JSON.parse(buffer);
                let parsedCommands = {};
                
                // We expect each repository to use a common format.
                for (let command of parsedResponse) {
                    parsedCommands[command.command] = {
                        description: command.description,
                        hidden: command.hidden,
                        response: command.response
                    };
                }
                
                resolve(parsedCommands);
            });
        });
    }
    
    isEligible(message, bot, config) {
        // This is a modified version of the default isEligible that checks for 
        // all of the repository commands managed by the repository.
        let prefix = config.get('commands.prefix');
        let disabledCommands = config.get('commands.disabled');
        let disableAliases = config.get('commands.disableAliases');
        let aliases = config.get('commands.aliases');

        let blacklist = [];
        if (config.has('repository.blacklist')) {
            blacklist = config.get('repository.blacklist');   
        }
        
        for (let repositoryCommand of Object.keys(this.repositoryCommands)) {

            if (blacklist.indexOf(repositoryCommand) >= 0) {
                // Blacklist is a list of commands that we don't
                // want to use from the repositories because they override
                // our actual commands.
                continue;
            }

            if (disabledCommands.indexOf(repositoryCommand) >= 0 && disableAliases) {
                // If command is disabled and we're also disabling any aliases.
                continue;
            }
            
            // Does the message match this command explicitly?
            if (message.content.toLowerCase() == prefix + repositoryCommand && 
                    disabledCommands.indexOf(repositoryCommand) < 0) {
                // If command is a match and the base command isn't disabled.
                console.log(format('Repository: Direct match command "%s" with "%s".',
                                   repositoryCommand, prefix + repositoryCommand));
                // We add a new property to the class that holds the command we
                // matched against, this is a little hacky, but it means we don't
                // need to repeat these checks in the respond function if this
                // was an alias match. 
                this.matchingCommandName = repositoryCommand;
                return true;
            }
            
            // Is this message an alias to this command?
            if (aliases.hasOwnProperty(repositoryCommand)) {
                // If this command is configured with some aliases.
                let parts = message.content.split(' ');
                let commandName = parts[0].replace(config.get('commands.prefix'), '').toLowerCase();
                
                if (aliases[repositoryCommand].indexOf(commandName) >= 0 &&
                        parts[0].indexOf(prefix) >= 0) {
                    console.log(format('Repository: Alias match command "%s" with "%s".',
                                       repositoryCommand, prefix + commandName));
                    // See comment in direct match above.
                    this.matchingCommandName = repositoryCommand;
                    return true;
                }
            }
        }
        
        // If none of the commands managed match.
        return false;
    }
    
    respond(message, bot, config, resolve, reject) {
        let parts = message.content.split(' ');
        let commandName = parts[0].replace(config.get('commands.prefix'), '');
        
        if (!this.matchingCommandName) {
            reject('Matching Command Name property was wrong.');
        }
        
        // We use the property we added to the class with the command that we
        // matched.
        let matchingCommand = this.repositoryCommands[this.matchingCommandName];
        resolve(matchingCommand.response);
    }
    
    help(config) {
        // help() exists for this type of command, given that RepositoryCommand
        // essentially encapsulates a bunch of responses we need to populate
        // the !help command with all of those commands.
        let helpDocuments = [];
        let blacklist = [];
        if (config.has('repository.blacklist')) {
            blacklist = config.get('repository.blacklist');
        }

        for (let repositoryCommandName of Object.keys(this.repositoryCommands)) {
            let repositoryCommand = this.repositoryCommands[repositoryCommandName];

            helpDocuments.push({
                name: repositoryCommandName,
                description: repositoryCommand.description,
                hidden: repositoryCommand.hidden
            });
        }

        return helpDocuments;
    }
    
}

module.exports = [RepositoryCommand];