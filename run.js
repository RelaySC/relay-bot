'use strict';

const fs = require('fs');
const path = require('path');

const Bot = require('./bot');
const config = require('config');

let bot = new Bot();
bot.connect();
