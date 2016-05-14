# inn-bot
Discord Bot for use in the Imperial News Network channel. Makes use of [elizabot.js](http://www.masswerk.at/elizabot/) to have natural language conversations and fetches data from [Roberts Space Industries](https://robertsspaceindustries.com/) for Star Citizen funding, citizens and UEE commands.

## Quick Start
In order to use this you'll need at least NodeJS v6.0.0 installed. It helps to have Git to clone the repository. You should copy the configuration from `config/default.yaml` to `config/local.yaml` and configure as necessary.
```
$ git clone https://github.com/ImperialNewsNetwork/inn-bot.git
$ cd inn-bot
$ cp config/default.yaml config/local.yaml
$ npm install
$ export INNBOT_DISCORD_BOTUSER_TOKEN=<bot_token>
$ export INNBOT_DISCORD_CLIENTID=<app_id>
$ node run.js
```
Replace `<bot_token>` with your Bot User Token and `<app_id>` with the Client ID from [Discord Developer](https://discordapp.com/developers/applications/me). If you want these environment variables to persist between sessions then I reccomend that you add these lines to your `~/.bashrc`.

It is reccomended that you also view the [Setting up Google Calendar Integration](#setting-up-google-calendar-integration) section so that commands that rely on that functionality work.

You can use the url below, replacing `<app_id>` with the Client ID from the Developer page, to add it to a server you have 'Manage Server' permissions on.
```
https://discordapp.com/oauth2/authorize?&client_id=<app_id>&scope=bot
```
You can then use the `!invite` command to get this URL in future.

## Configuration
inn-bot is configured in two ways - environment variables for sensitive information and a configuration file for everything else. inn-bot ships with a [`config/default.yaml`](config/default.yaml) configuration file, this should be copied and modified to the user's liking then saved as `config/local.yaml`.

There are lots of configuration options available and custom commands can add their own configuration options - some options are explained below. 

### Customizing the Bot
At the top of the configuration file, you can configure the identity of the bot - so you don't have to change any code to use this bot elsewhere.

```yaml
bot:
  name: INNBot
  avatarPath: ./assets/bot-avatar.jpg
  gameName: testing
  description: >
                I'm INNBot, a Rogerian psychotherapist hired by the
                Imperial News Network. You can chat for a therapy session
                or tell me some commands. I'm an open source
                psychotherapist too, check my source out here: 
                https://github.com/ImperialNewsNetwork/inn-bot.
                To find the commands I can run, type !help.
  repositoryUrl: https://github.com/ImperialNewsNetwork/inn-bot
```

### Disabling Commands
Commands can be individually disabled by adding them to the `commands.disabled` property in the configuration file.

```yaml
commands:
  disabled:
    - echo
```

If you don't want any of the commands from any of the sources, then you can remove that source entirely.

### Aliasing Commands
Commands can be aliased by adding the command to be aliased to the configuration file and then a list of the aliases.

```yaml
commands:
  aliases:
    about:
      - info
    stats:
      - funds
      - citizens
      - uee
    issue:
      - bug
    thebase:
      - baseradio
```
Here we can see an example where `about` is aliased as `info`; `stats` is aliased as `funds`, `citizens` and `uee`, `issue` is aliased as `bug` and `thebase` is aliased as `baseradio`. Aliases apply to repository commands.

## Commands
Since inn-bot v2.0.0, there is a command system in place that allows the bot to be extended easily without modifying the core bot.

### Creating a Command
It's easy to create a new command, make a file anywhere - as long as the inn-bot system user has privileges - and then create a command that looks something like the one below. You should add this to the ```commands.sources``` property in the configuration file.

You'll need to update the relative path to the [command module](command.js).
```js
'use strict';

const Command = require('../command'); // update this path

class YouTubeCommand extends Command {
    constructor() {
        super({
            command: 'rsiyt',
            description: 'Subscribe to Star Citizen on YouTube!',
            hidden: false
        });
    }
    
    respond(message, bot, config, resolve, reject) {
        resolve('You can find and subscribe to Star Citizen on YouTube here: ' +
                'https://www.youtube.com/user/RobertsSpaceInd');
    }
}

module.exports = [YouTubeCommand];
```
It's really easy to create a command. Every command needs a call to the constructor with it's name, description and if it's hidden - all of these are used in the `!help` command. After that, there are two main functions that you'll be able to override in order to create a new unique command - `isEligible(message, bot, config)` and `respond(message, bot, config, resolve, reject)`.

`isEligible` is used to check if a command is eligible for being run, in the majority of cases you won't need to override this, by default it'll match your command and check if it's been disabled or aliased in the configuration too.

If you do override this then you **should** make sure that your command respects the disabled commands and aliases in the configuration.

This function takes three parameters, `message`, `bot` and `config`. Both `message` and `bot` are from Discordie - the library we use for interfacing with Discord - [you can find the documentation for `message` here](https://qeled.github.io/discordie/#/docs/IMessage?_k=acbr2w) and [you can find the documentation for `bot` here](https://qeled.github.io/discordie/#/docs/IUser?_k=so347k) - this is the User that the bot is currently running as, so you can find the bot id and name. `config` is the [node-config](https://github.com/lorenwest/node-config) instance that is used for configuration. You can check for your own configuration options in there.

`respond` is called if your command is found to be eligible to respond. `message`, `bot` and `config` are the same as in `isEligible`. `resolve` and `reject` are callbacks that should be used to return a message to be sent and to return a error, respectively.

You should check out [the commands that ship with the bot](commands/) to see examples of this being used. 

### Command List
Once installed, the list of available commands can be viewed with `!help [page number]`.

### Repositories
Since v2.0.0, Command Repositories have been introduced. You can add a repository by adding the following to your configuration:
```yaml
repository:
  sources:
    - url
  blacklist:
    - list of command names
```
inn-bot's [`RepositoryCommand`](commands/repository.js) will load the commands and responses found at the given url and use them. The endpoint should be in the format as follows:
```json
[
    {
        "command": "command name",
        "description": "help text",
        "hidden": false,
        "response": "what I should respond with"
    },
    ...
]
```
All commands can be aliased and disabled like regular commands in the configuration.

You can specify a blacklist of commands that will not be used if they conflict with names that the regular bot commands use (you wouldn't be able to use disable for this because that would disable the regular command).

#### Approved Repositories
Get in touch if you'd like your command repository to be listed here.

## Setting up Google Calendar Integration
By default, two commands fetch from Google Calendar, you can get an API Key by following these steps:

1. Go to [Google Developers Console](https://console.developers.google.com/project) and create a new project for the bot.
2. Enable [Google Calendar API](https://console.developers.google.com/apis/api/calendar/overview) for that project.
3. Create [API Credentials](https://console.developers.google.com/apis/credentials) for the bot. You can choose any type of key - Server, Browser, Android or iOS - though we chose Server.
4. Put the API key you get in the environment variable `DISCORD_GOOGLE_APIKEY`.

## Contributing
We'd love any contributions to the code and actively encourage people to fork, make modifications and create pull requests so we can merge any changes we like back into the bot.

Before submitting a pull request, make sure your code doesn't have any issues with the `jshint` utility.

Keep in mind that any modified versions that are not merged back into this codebase should comply with the [GNU Affero General Public License v3.0](http://choosealicense.com/licenses/agpl-3.0/) that [we're using](https://github.com/ImperialNewsNetwork/inn-bot/blob/master/LICENSE.md).

## Deploying
When deploying into production, we recommend running on a Linux box and creating a dedicated system user to run the bot. On Ubuntu 15.10, we're using the following systemd unit file:

```ini
[Unit]
Description=INN Discord Bot
After=system.slice multi-user.target

[Service]
Type=simple
User=innbot
Group=innbot

StandardOutput=syslog
StandardError=syslog
SyslogIdentifier=innbot
SyslogFacility=local0

Environment=INNBOT_DISCORD_BOTUSER_TOKEN=<bot_token>
Environment=INNBOT_DISCORD_CLIENTID=<app_id>
Environment=INNBOT_GOOGLE_APIKEY=<google_api_key>

WorkingDirectory=/home/innbot/inn-bot
ExecStart=/usr/bin/node run.js
Restart=always

[Install]
WantedBy=multi-user.target
```
## Changelog
**v2.0.0 - 14/05/2016**
- Improved Command System.
- Enhanced Configuration.
- Subreddit Autolinking.
- Command Repository Support.
- Added help command pagination.
- Changed elizabot chat into a command.
- Refactored helper functions to return data rather than messages.
- Moved starmap helper into the command class.

View commits for a complete list.

**v1.0.0 - 09/04/2016**
- Initial Release.
