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
import { joinVoiceCommand, joinVoiceContent } from "./commands/join_voice.mjs";
import { helpCommand, helpContent } from "./commands/help.mjs";
import { playMusicCommand } from "./commands/play_music.mjs";
import {
  leaveVoiceCommand,
  leaveVoiceContent,
} from "./commands/leave_voice.mjs";

// Create a new client instance
const client = new Client({
  intents: [
    GatewayIntentBits.Guilds,
    GatewayIntentBits.GuildMessages,
    GatewayIntentBits.MessageContent,
    GatewayIntentBits.GuildVoiceStates,
  ],
});

const token = process.env.TOKEN || "";

const commandDefinitions = [
  pingCommand.toJSON(),
  createImageCommand.toJSON(),
  joinVoiceCommand.toJSON(),
  leaveVoiceCommand.toJSON(),
  helpCommand.toJSON(),
  playMusicCommand.toJSON(),
];

// When the bot is ready, run this code
client.once("ready", async () => {
  console.log(`Logged in as ${client.user.tag}!`);

  let commands;
  try {
    commands = await client.application.commands.set(commandDefinitions);
  } catch (e) {
    console.error(e);
  }

  console.log("Available commands:");
  commands.forEach((command) => console.log(`/${command.name}`));
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

    case "join_voice":
      await joinVoiceContent(interaction);
      break;

    case "leave_voice":
      await leaveVoiceContent(interaction);

    case "help":
      await helpContent(interaction, client);
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
