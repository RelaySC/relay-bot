'use strict';

const fs = require('fs');
const path = require('path');

const Bot = require('./bot');
const Discordie = require('discordie');
const config = require('config');

let bot = new Bot(new Discordie());
bot.registerFromFile('./builtins');

let commandSources = config.get('commands.loadFrom');
for (let file of commandSources) {
    bot.registerFromFile(file);
}

bot.connect();
