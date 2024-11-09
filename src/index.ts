import {
  Client,
  CommandInteraction,
  GatewayIntentBits,
  Interaction,
  Message,
} from "discord.js";
import dotenv from "dotenv";
dotenv.config();
import { pingCommand, pingContent } from "./commands/pings.js";
import {
  createImageCommand,
  createImageContent,
} from "./commands/create_image.js";
import { gptMessage } from "./messages/gptMessage.js";
import { joinVoiceCommand, joinVoiceContent } from "./commands/join_voice.js";
import { helpCommand, helpContent } from "./commands/help.js";
import {
  leaveVoiceCommand,
  leaveVoiceContent,
} from "./commands/leave_voice.js";

// Create a new client instance
const client = new Client({
  intents: [
    GatewayIntentBits.Guilds,
    GatewayIntentBits.GuildMessages,
    GatewayIntentBits.MessageContent,
    GatewayIntentBits.GuildVoiceStates,
  ],
});

const token = process.env.TOKEN ?? "";

const commandDefinitions = [
  pingCommand.toJSON(),
  createImageCommand.toJSON(),
  joinVoiceCommand.toJSON(),
  leaveVoiceCommand.toJSON(),
  helpCommand.toJSON(),
];

// When the bot is ready, run this code
client.once("ready", async () => {
  if (!client.user) return;

  console.log(`Logged in as ${client.user.tag}!`);

  let commands: any;
  try {
    if (!client.application) return;
    commands = await client.application.commands.set(commandDefinitions);
  } catch (e) {
    console.error(e);
  }

  console.log("Available commands:");
  commands.forEach((command: any) => console.log(`/${command.name}`));
});

// commands
client.on("interactionCreate", async (interaction: Interaction) => {
  if (!interaction.isCommand()) return;
  const { commandName } = interaction;

  if (interaction.replied && interaction.deferred) return;

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

client.on("messageCreate", async (message: Message) => {
  // potentiel answers user questions
  await gptMessage(message, client);
});

// Login to Discord with your app's token
client.login(token);
