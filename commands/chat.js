'use strict';

const Command = require('../command');
const eliza = require('../eliza/elizabot');

class ChatCommand extends Command {
    
    constructor() {
        super({
            command: 'chat',
            description: 'Chat to me! Run this command or shoot me a mention!',
            hidden: true
        });
    }
    
    isEligible(message, bot, config) {
        // Chat is a unique "command" because it can respond to !chat but
        // it can also respond to a private message or a mention.
        
        let commandPrefix = config.get('commands.prefix');
        if (message.isPrivate && !message.content.startsWith(commandPrefix)) {
            // If the message is private and doesn't start with the command
            // then we can handle it here.
            return true;
        } 

        if (bot.isMentioned(message)) {
            // If we're mentioned then we do not require default message
            // checks and can handle here.
            return true;
        }

        return super.isEligible(message, bot, config);
    }
    
    respond(message, bot, config) {
        let messageContents = message.content;
        
        // We need to strip out the mention (if it exists) before
        // preparing a response.
        let mention = '<@' + bot.id + '>';
        messageContents = messageContents.replace(mention, '').trim();
        
        // Return eliza's response.
        return eliza.transform(messageContents);
    }
}

module.exports = [ChatCommand];