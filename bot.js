'use strict';

const Command = require('./command');

const fs = require('fs');

const config = require('config');
const format = require('format');

class Bot {
    
    constructor(client) {
        this.client = client;
        this.commands = [];
        
        this.client.Dispatcher.on('GATEWAY_READY', (event) => this.ready(event));
        this.client.Dispatcher.on('MESSAGE_CREATE', (event) => this.handleMessage(event));
        
        console.log('Bot has awakened.');
    }
    
    connect() {
        this.client.connect({
            token: config.get('settings.token')
        });
    }
    
    ready(event) {
        this.client.User.setGame({name: config.get('bot.gameName')});
        this.client.User.edit(null, null, fs.readFileSync(config.get('bot.avatarPath')));
        console.log(format('Connected as "%s", playing "%s".',
                           this.client.User.username,
                           this.client.User.gameName));
    }
    
    registerFromFile(filename) {
        console.log(format('Attempting to load commands from "%s".', filename));
        this.register(require(filename));
    }
    
    register(commands) {
        if (Object.prototype.toString.call(commands) !== '[object Array]') {
            // If our input isn't an array, then let's make it an array.
            commands = [commands];
        }
        
        for (let CommandSubclass of commands) {
            if (CommandSubclass.prototype instanceof Command) {
                // CommandSubclass.prototype is used when checking because
                // CommandSubclass isn't an instance.
                
                // If we've got a actual command then we hook up the
                // events and add it to our list.
                let command = new CommandSubclass();
                
                command.on('response', (message, response) => {
                   message.channel.sendMessage(response); 
                   console.log(format('Responded to "%s" with "%s" command.',
                                      message.author.username, command.command));
                });
                command.on('error', (message, error) => {
                    console.log(format('Error occured in "%s" command responding to "%s".\n\t%s.',
                                       command.command, message.author.username, error));
                });
                
                this.commands.push(command);
                console.log(format('Registered new command "%s".', command.command));
            }
        }
    }
    
    handleMessage(event) {
        // Check if we are replying to ourself.
        if (event.message.author.id == this.client.User.id && 
                !config.get('commands.allowReplyToSelf')) {
            return;
        }
        
        // Log this message to the console.
        if (event.message.isPrivate) {
            // There is no channel in a private message.
            console.log(format('Received "%s" from "%s" in PM.',
                               event.message.content, event.message.author.username));    
        } else {
            console.log(format('Received "%s" from "%s" in "%s" on "%s".',
                               event.message.content,
                               event.message.author.username,
                               event.message.channel.name,
                               event.message.guild.name));
        }
        
        // Check if we can reply to other bots.
        if (event.message.author.bot && 
                !config.get('commands.allowReplyToBots')) {
            console.log('Bot replies not permitted.');
            return;
        }
        // Check if we can reply to @everyone or @here.
        if (event.message.mention_everyone && 
                !config.get('commands.allowReplyToEveryone')) {
            console.log('@everyone or @here replies not permitted.');
            return;
        }
        // Check if we can reply to private messages.        
        if (event.message.isPrivate &&
                !config.get('commands.allowReplyInPrivate')) {
            console.log('PM replies not permitted.');
            return;
        }
        
        
        // If the global help command isn't disabled then we provide that
        // here so we have access to the command list.
        if (event.message.content == '!help' && 
                !config.get('commands.disableHelpCommand')) {
            event.message.channel.sendMessage(this.help(event));
            console.log(format('Responded to "%s" with "help" command.',
                               event.message.author.username));
        }
        
        for (let command of this.commands) {
            command.run(event.message, this.client.User, config);
        }
    }
    
    help(event) {
        let message = 'Here\'s all of my commands:\n\n';
        let disabledCommands = config.get('commands.disabled');

        // Print the details of each command if it isn't a hidden command.
        for (let key of Object.keys(this.commands)) { 
            let command = this.commands[key];
           
            if (!command.hidden && !(command in disabledCommands)) {
                message += format('!%s - %s\n', command.command,
                                                command.description);
            }
        };

        return message;
    }
}

module.exports = Bot;