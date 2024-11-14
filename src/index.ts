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
import { playMusicCommand, playMusicContent } from "./commands/play_music.js";
import { skipMusicCommand, skipMusicContent } from "./commands/skip_music.js";
import {
  nowPlayingCommand,
  nowPlayingContent,
} from "./commands/now_playing.js";
import { loopQueueCommand, loopQueueContent } from "./commands/loop_queue.js";
import {
  PauseMusicCommand,
  PauseMusicContent,
} from "./commands/pause_music.js";
import {
  UnpauseMusicCommand,
  UnpauseMusicContent,
} from "./commands/unpause_music.js";

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
const discordServer = process.env.DISCORD_SERVER ?? "";

const commandDefinitions = [
  pingCommand.toJSON(),
  createImageCommand.toJSON(),
  joinVoiceCommand.toJSON(),
  leaveVoiceCommand.toJSON(),
  helpCommand.toJSON(),
  playMusicCommand.toJSON(),
  skipMusicCommand.toJSON(),
  nowPlayingCommand.toJSON(),
  loopQueueCommand.toJSON(),
  PauseMusicCommand.toJSON(),
  UnpauseMusicCommand.toJSON(),
];

// When the bot is ready, run this code
client.once("ready", async () => {
  if (!client.user) return;

  console.log(`Logged in as ${client.user.tag}!`);

  let commands: any;
  try {
    if (!client.application) return;
    // remove guild id to deploy globally
    commands = await client.application.commands.set(
      commandDefinitions,
      discordServer
    );
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
      break;

    case "play":
      await playMusicContent(interaction);
      break;

    case "help":
      await helpContent(interaction, client);
      break;

    case "skip_music":
      await skipMusicContent(interaction);
      break;

    case "now_playing":
      await nowPlayingContent(interaction);
      break;

    case "loop_queue":
      await loopQueueContent(interaction);
      break;

    case "pause_music":
      await PauseMusicContent(interaction);
      break;

    case "unpause_music":
      await UnpauseMusicContent(interaction);
      break;

    default:
      console.log("Command not recognized.");
      break;
  }
});

client.on("messageCreate", async (message: Message) => {
  // potentiel answers user questions
  await gptMessage(message, client);
});

// Login to Discord with your app's token
client.login(token);
