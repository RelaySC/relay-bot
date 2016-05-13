'use strict';

const fs = require('fs');
const path = require('path');

const Bot = require('./bot');
const Discordie = require('discordie');
const config = require('config');

let bot = new Bot(new Discordie());
bot.registerFromFile('./builtins');

let commandDirectories = config.get('commands.loadFrom');
for (let directory of commandDirectories) {
    let fullDirectory = path.join(__dirname, directory);
    
    for (let file of fs.readdirSync(fullDirectory)) {
        let filePath = path.join(fullDirectory + '\\' + file);
        
        // All commands export either a single command or a list of commands.
        bot.registerFromFile(filePath);
    }
}

bot.connect();
