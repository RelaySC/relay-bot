# inn-bot
Discord Bot for use in the Imperial News Network channel. Makes use of [elizabot.js](http://www.masswerk.at/elizabot/) to have natural language conversations and fetches data from [Roberts Space Industries](https://robertsspaceindustries.com/) for Star Citizen funding, citizens and UEE commands.

More information coming soon. **This project is currently a work in progress.**

## How to Use
In order to use this you'll need at least NodeJS installed. It helps to have Git to clone the repository.
```
$ git clone https://github.com/ImperialNewsNetwork/inn-bot.git
$ cd inn-bot
$ npm install
$ node run.js <bot_token>
```
Replace `<bot_token>` with your Bot User Token from [Discord Developer](https://discordapp.com/developers/applications/me). You can use the url below, replacing `<bot_id>` with the Bot User ID from the Developer page, to add it to a server you have 'Manage Server' permissions on.
```
https://discordapp.com/oauth2/authorize?&client_id=<bot_id>&scope=bot
```
You can then use the `!invite` command to get the URL in future.

## Command List
Some commands may not yet be implemented. But all currently planned commands are listed
below.

`!stats` - displays total funding, no. of citizens and no. of ships sold for Star Citizen and delta for each since last check.

`!issue` - report an issue to the Issue Council.

`!org` - get a link to the INN Org on RSI.

`!starmap` - check out the ARK Starmap!

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
