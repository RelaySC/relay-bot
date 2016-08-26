'use strict';

const Command = require('./command');

const fs = require('fs');

const Discordie = require('discordie');
const config = require('config');
const format = require('format');
const moment = require('moment');
const schedule = require('node-schedule');

class Bot {
    
    constructor(client) {
        this.client = new Discordie();
        this.commands = [];
        this.versionNumber = 'v2.2';
        this.replies = {};
        this.editLogs = {};
        
        this.client.Dispatcher.on('GATEWAY_READY', (event) => {
            this.ready(event);

            // Register commands.
            this.registerFromFile('./builtins');
            for (let file of config.get('commands.sources')) {
                this.registerFromFile(file);
            }

            console.log('Bot Initialized :: ' + this.versionNumber);
        });
        this.client.Dispatcher.on('MESSAGE_CREATE', (event) => this.handleMessageCreated(event));
        this.client.Dispatcher.on('MESSAGE_DELETE', (event) => this.handleMessageDeleted(event));
        this.client.Dispatcher.on('MESSAGE_UPDATE', (event) => this.handleMessageUpdated(event));
        
        console.log('Bot Initializing :: ' + this.versionNumber);
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

        // Build up a list of the channels that we'll log deleted messages to.
        console.log('Loading deleted messages log channels.');
        this.deletedMessagesLogging = [];

        if (!config.has('commands.deletedMessagesLogging')) {
            console.log('No log channels defined.');
            return;
        }
        let loggingConfig = config.get('commands.deletedMessagesLogging');
        

        for (let logOptions of loggingConfig) {
            let channelId = logOptions.toChannel.toString();

            // Load the channel based on the id.
            console.log(format('Attempting to find channel "%s".',
                               channelId))
            let channel = this.client.Channels.get(channelId);

            if (channel === null || typeof channel === 'undefined') {
                // Try DirectMessageChannels collection.
                console.log(format('Couldn\'t find channel "%s". ' +
                                   'Attempting direct message channels.',
                                   channelId));
                channel = this.client.DirectMessageChannels.get(channelId);
            }

            // Log the channel details to the console and add to our list.
            console.log(format('Loaded deleted message channel - "#%s" on "%s"',
                               channel.name, channel.guild.name));
            this.deletedMessagesLogging.push({
                fromGuilds: logOptions.fromGuilds,
                toChannel: channel,
                type: logOptions.type,
                include: logOptions.include
            });
        }
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

                // We pass in a scheduler and the client.
                let command = new CommandSubclass(this.client, schedule);
                
                command.on('response', (message, response) => this.respond(message, response));
                command.on('error', (message, error) => {
                    console.log(format('Error occured in "%s" command responding to "%s".\n\t%s.',
                                       command.command, message.author.username, error));
                });
                
                this.commands.push(command);
                console.log(format('Registered new command "%s".', command.command));
            }
        }
    }
    
    respond(message, response) {
        message.channel.sendMessage(response).then((reply) => {
            // If the message send was a success then save our reply
            // in a dictionary keyed by the message id we were replying to.
            this.replies[message.id] = reply;
            
            console.log(format('Responded to "%s" with "%s" command.',
                               message.author.username, command.command));
        }, (error) => {
            console.log(format('Reply failed to send to "%s" with "%s"',
                               message.author.username, command.command));
        });
    }
    
    handleMessageCreated(event) {
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
        // We don't reply to Discord.        
        if (event.message.isSystem) {
            console.log('Did not reply to system message.');
            return;
        }
        
        // If the global help command isn't disabled then we provide that
        // here so we have access to the command list.
        if (event.message.content.startsWith('!help') && 
                !config.get('commands.disableHelpCommand')) {
            let parts = event.message.content.split(' ');
            let pageNumber = 0;
            if (parts.length > 1) {
                pageNumber = parts[1] - 1;
            }
                    
            this.respond(event.message, this.help(pageNumber, event, config));
        }
        
        for (let command of this.commands) {
            command.run(event.message, this.client.User, config);
        }
    }
    
    handleMessageDeleted(event) {
        if (event.message.author.id === this.client.User.id) {
            // We don't care about our own deletions.
            return;
        }

        // Find our reply to this message if it exists and delete it.
        let exists = Object.keys(this.replies).indexOf(event.messageId) >= 0;
        let reply = null; // Potentially used later in logging.
        if (exists) {
            reply = this.replies[event.messageId];   
            reply.delete();

            // Log to console.
            console.log(format('Deleted reply to message "%s" after original message was deleted.',
                               event.messageId));
        }

        // Go through each of the deleted message logging configurations.
        for (let logOption of this.deletedMessagesLogging) {

            // If we have don't have a type property and that type property isn't set to all.
            // and if this message is a response anyway.
            let logOptionSetToAll = logOption.hasOwnProperty('type') && logOption.type === 'all';
            let botResponded = exists;
            let weShouldLog = logOptionSetToAll || botResponded; 
            if (!weShouldLog) {
                continue;
            }

            // Check if the guild this message was deleted from was part of the configuration.
            if (logOption.fromGuilds.indexOf(event.message.guild.id) < 0) {
                console.log('Did not log in a channel as guild is not configured with logging channel.');
                continue;
            }

            // Check it wasn't deleted from the log channel.
            if (logOption.toChannel.id === event.message.channel.id) {
                console.log('Did not log in a channel as message was deleted from logging channel.');
                continue;
            }

            let response = 'Deleted message from "%s" (%s) in "#%s" on "%s".\n' +
                           '\n**Message:**\n```%s```'
            if (reply === null || typeof reply === 'undefined') {
                logOption.toChannel.sendMessage(format(response, event.message.author.username,
                                                       event.message.author.id,
                                                       event.message.channel.name,
                                                       event.message.guild.name,
                                                       event.message.content));
            } else {
                response = 'Deleted response to message from "%s" (%s) in "#%s" on "%s".\n' +
                           '\n**Original Message:**\n```%s```\n**Bot Response:**\n```%s```';
                logOption.toChannel.sendMessage(format(response,
                                                       event.message.author.username,
                                                       event.message.author.id,
                                                       event.message.channel.name,
                                                       event.message.guild.name,
                                                       event.message.content,
                                                       reply.content));
            }
            
            console.log('Logged to channel.');
        }
    }
    
    handleMessageUpdated(event) {
        if (event.message.author.id == this.client.User.id) {
            // We don't care about our updates.
            return;
        }

        for (let logOption of this.deletedMessagesLogging) {
            // Check if we are set to log edits.
            let logOptionSetToAll = logOption.hasOwnProperty('type') && logOption.type === 'all';
            let logOptionSetToEdits = logOption.hasOwnProperty('include') && logOption.include === 'edits';

            if (!(logOptionSetToAll && logOptionSetToEdits)) {
                continue;
            }

            // Check if the guild this message was deleted from was part of the configuration.
            if (logOption.fromGuilds.indexOf(event.message.guild.id) < 0) {
                console.log('Did not log in a channel as guild is not configured with logging channel.');
                continue;
            }

            // Check it wasn't deleted from the log channel.
            if (logOption.toChannel.id === event.message.channel.id) {
                console.log('Did not log in a channel as message was deleted from logging channel.');
                continue;
            }

            // Create response.
            let response = format('Edited message from "%s" (%s) in "#%s" on "%s"\n' +
                                  '\n**Versions:**\n',
                                  event.message.author.username, event.message.author.id,
                                  event.message.channel.name, event.message.guild.name);

            // Add each different edit.
            for (let editedVersion of event.message.edits) {
                // Format timestamp correctly - making sure correct timestamp is used.
                let dateFormat = 'MMMM Do YYYY, h:mm:ss a';
                let formattedTimestamp = moment(editedVersion.timestamp).format(dateFormat);

                if(editedVersion.edited_timestamp !== null && 
                        typeof editedVersion.edited_timestamp !== 'undefined') {
                    formattedTimestamp = moment(editedVersion.edited_timestamp).format(dateFormat);
                }

                response += format('%s```%s``` \n\n', formattedTimestamp, editedVersion.content);
            }
            
            // Check if we have logged this before, if so, update the log.
            let exists = Object.keys(this.editLogs).indexOf(event.message.id) >= 0;
            if (!exists) {
                logOption.toChannel.sendMessage(response).then((reply) => {
                    // If the message send was a success then save our reply
                    // in a dictionary keyed by the message id we were replying to.
                    this.editLogs[event.message.id] = reply;
            
                    console.log(format('Logged an edit by "%s".',
                                       message.author.username));
                }, (error) => {
                    console.log(format('Failed in logging an edit by "%s".',
                                       message.author.username));
                });
            } else {
                this.editLogs[event.message.id].edit(response);
            }
        }
    }

    help(pageNumber, event, config) {        
        let helpCommandPadding = config.get('commands.helpCommandPadding');
        let disabledCommands = config.get('commands.disabled');
        let prefix = config.get('commands.prefix');
        const pageSize = 28;

        // Check if pageNumber is valid integer.
        if (!isNaN(parseFloat(pageNumber)) && isFinite(pageNumber)) {
            pageNumber = Math.round(parseFloat(pageNumber));
        } else {
            return 'You really think I\'d fall for a page number like that?';
        }

        // Collect the help documents from every command.
        let helpDocuments = [];
        for (let command of this.commands) { 
            let currentHelpDocuments = command.help(config);
            
            for (let helpDocument of currentHelpDocuments) {
                if (!helpDocument.hidden && disabledCommands.indexOf(helpDocument.name) < 0) {
                    helpDocuments.push(helpDocument);   
                }   
            }
        }

        // Get current page.
        let noOfPages = Math.ceil(helpDocuments.length / pageSize);
        
        // Ensure we're not asking for a page that doesn't exist.
        if (pageNumber + 1 > noOfPages) {
            return 'We don\'t have *that* many commands.';
        }
        
        // Filter to only the current page.
        let currentIndex = pageSize * pageNumber;
        helpDocuments = helpDocuments.slice(currentIndex, currentIndex + pageSize);        

        // Find largest command name.
        let largestCommandNameSize = 0;
        for (let helpDocument of helpDocuments) {
            let size = helpDocument.name.length + prefix.length;
            if (largestCommandNameSize < size) {
                largestCommandNameSize = size;
            }
        }
        
        // Calculate total padding amount.
        let paddingPoint = largestCommandNameSize + helpCommandPadding;

        // Print help listing.
        let helpListing = '';
        for (let helpDocument of helpDocuments) {
            let noOfSpaces = paddingPoint - (helpDocument.name.length + prefix.length);
            let padding = Array(noOfSpaces).join(' ');

            helpListing += format('%s%s%s\n', prefix + helpDocument.name,
                                padding, helpDocument.description);
        }

        return format('Here\'s are the commands I have (%s / %s):\n\n```%s```',
                       pageNumber + 1, noOfPages, helpListing); 
    }
}

module.exports = Bot;