import { createRequire } from "module";
const require = createRequire(import.meta.url);
const { Client, GatewayIntentBits } = require("discord.js");
require("dotenv").config();
import { pingCommand, pingContent } from "./commands/pings.mjs";
import {
  createImageCommand,
  createImageContent,
} from "./commands/create_image.mjs";
import { gptMessage } from "./messages/gptMessage.mjs";

// Create a new client instance
const client = new Client({
  intents: [
    GatewayIntentBits.Guilds,
    GatewayIntentBits.GuildMessages,
    GatewayIntentBits.MessageContent,
  ],
});

const token = process.env.TOKEN || "";

// When the bot is ready, run this code
client.once("ready", async () => {
  console.log(`Logged in as ${client.user.tag}!`);

  // commands
  pingCommand;
  createImageCommand;
});

// commands
client.on("interactionCreate", async (interaction) => {
  if (!interaction.isCommand()) return;
  const { commandName } = interaction;

  switch (commandName) {
    case "ping":
      await pingContent(interaction);
      break;

    case "create_image":
      await createImageContent(interaction);
      break;

    default:
      break;
  }
});

client.on("messageCreate", async (message) => {
  // potentiel answers user questions
  await gptMessage(message, client);
});

// Login to Discord with your app's token
client.login(token);
