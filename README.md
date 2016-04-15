# inn-bot
Discord Bot for use in the Imperial News Network channel. Makes use of [elizabot.js](http://www.masswerk.at/elizabot/) to have natural language conversations and fetches data from [Roberts Space Industries](https://robertsspaceindustries.com/) for Star Citizen funding, citizens and UEE commands.

## How to Use
In order to use this you'll need at least NodeJS installed. It helps to have Git to clone the repository.
```
$ git clone https://github.com/ImperialNewsNetwork/inn-bot.git
$ cd inn-bot
$ npm install
$ export INNBOT_DISCORD_BOTUSER_TOKEN=<bot_token>
$ export INNBOT_DISCORD_CLIENTID=<app_id>
$ node run.js
```
Replace `<bot_token>` with your Bot User Token and `<app_id>` with the Client ID from [Discord Developer](https://discordapp.com/developers/applications/me). You can use the url below, replacing `<app_id>` with the Client ID from the Developer page, to add it to a server you have 'Manage Server' permissions on.
```
https://discordapp.com/oauth2/authorize?&client_id=<app_id>&scope=bot
```
You can then use the `!invite` command to get the URL in future.

## Command List
Some commands may not yet be implemented. But all currently planned commands are listed
below.

`!stats` - displays total funding, no. of citizens and no. of ships sold for Star Citizen and delta for each since last check.

`!issue` - report an issue to the Issue Council.

`!org` - get a link to the INN Org on RSI.

`!inn` - get the latest INN post.

`!github` - check out INN GitHub.

`!starmap` - check out the ARK Starmap!

`!subreddit` - check out the Star Citizen subreddit!

`!thebase` - tune into the Base Radio!

`!inntwitter` - follow INN on Twitter!

`!innfb` - like INN on Facebook!

`!innyt` - subcribe to INN on YouTube!

`!inntwitch` - follow INN on Twitch!

`!rsitwitter` - follow Star Citizen on Twitter!

`!rsifb` - like Star Citizen on Facebook!

`!rsiyt` - subcribe to Star Citizen on YouTube!

`!rsitwitch` - follow Star Citizen on Twitch!

`!rsicommunitytwitch` - follow CIG Community on Twitch!

`!time` - check the current time at CIG studios.

`!invite` - gives instructions on how to add this bot to your server.

`!about` - gives information on the bot.

`!help` - gives list of all possible commands.

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
