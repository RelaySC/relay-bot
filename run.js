var Discordie = require("discordie");
var client = new Discordie();

if (process.argv.length != 3) {
  console.log('ERROR: You must supply a Discord API Token.');
  process.exit(1);
}

client.connect({
  token: process.argv[2]  // This should be the supplied API token.
});

client.Dispatcher.on("GATEWAY_READY", e => {
  console.log("Connected as: " + client.User.username);
});

client.Dispatcher.on("MESSAGE_CREATE", e => {
  switch (e.message.content) {
    case "!invite":
      var inviteMessage = "You can add me to your server by instructing" +
                          " someone with the \"Manage Server\" permission to" +
                          " visit this page:\n" +
                          "https://discordpp.com/oauth2/authorize?client_id=" +
                          client.User.id + "&scope=bot";
      e.message.channel.sendMessage(inviteMessage);
      return;
  }

  if (client.User.isMentioned(e.message) || e.message.isPrivate) {  // If our bot was mentioned or sent a DM.
    e.message.channel.sendMessage("Hey!");
  }
});
