require("dotenv").config();
const fs = require("node:fs");
const path = require("node:path");
const mongoose = require("mongoose");

const { DISCORD_TOKEN: token, MONGODB_SRV: database } = process.env;

const { Client, GatewayIntentBits, Collection } = require("discord.js");

// Kreate a new client instance
const client = new Client({
  intents: [
    GatewayIntentBits.Guilds,
    GatewayIntentBits.GuildMessages,
    GatewayIntentBits.MessageContent,
    GatewayIntentBits.GuildMessageReactions,
  ],
});

//load event files
const eventsPath = path.join(__dirname, "events");
const eventFiles = fs
  .readdirSync(eventsPath)
  .filter((file) => file.endsWith(".js"));

for (const file of eventFiles) {
  const filePath = path.join(eventsPath, file);
  const event = require(filePath);
  if (event.once) {
    client.once(event.name, (...arg) => event.execute(...arg));
  } else {
    client.on(event.name, (...arg) => event.execute(...arg));
  }
}

//load the command files on startup
client.commands = new Collection();
const commandsPath = path.join(__dirname, "commands");
const commandFiles = fs
  .readdirSync(commandsPath)
  .filter((file) => file.endsWith(".js"));

for (const file of commandFiles) {
  const filePath = path.join(commandsPath, file);
  const command = require(filePath);
  if ("data" in command && "execute" in command) {
    client.commands.set(command.data.name, command);
  } else {
    console.log(
      `[Warning] The command at ${filePath} is missing required "data" or "execute property"`
    );
  }
}

mongoose
  .connect(database, {
    useUnifiedTopology: true,
  })
  .then(() => {
    console.log("connected to the database!");
  })
  .catch((err) => {
    console.log(err);
  });

client.login(token);
