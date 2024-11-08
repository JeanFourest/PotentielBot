import { createRequire } from "module";
const require = createRequire(import.meta.url);
const {
  Client,
  GatewayIntentBits,
  SlashCommandBuilder,
  EmbedBuilder,
} = require("discord.js");
require("dotenv").config();
import { gptCompletion } from "./services/openai.mjs";
import { gptGenerateImage } from "./services/generateImage.mjs";

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

  const commands = await client.application.commands.fetch();

  try {
    if (
      !commands.some(
        (cmd) => cmd.name === "ping" || cmd.name === "create_image"
      )
    ) {
      client.application.commands.create(
        new SlashCommandBuilder()
          .setName("ping")
          .setDescription("Ask a question to the bot")
      );

      client.application.commands.create(
        new SlashCommandBuilder()
          .setName("create_image")
          .setDescription("Generate an image")
          .addStringOption((option) =>
            option
              .setName("description")
              .setDescription("A description for the image")
              .setRequired(true)
          )
      );
    }
  } catch (error) {
    console.error("Error registering commands:", error);
  }
});

// commands
client.on("interactionCreate", async (interaction) => {
  if (!interaction.isCommand()) return;
  const { commandName } = interaction;

  if (commandName === "ping") {
    await interaction.reply("Pong! The bot is alive!");
  }

  if (commandName === "create_image") {
    const description = interaction.options.getString("description");

    await interaction.deferReply();

    if (description.length < 1900) {
      try {
        const imageUrl = await gptGenerateImage(description);
        await interaction.editReply({ content: imageUrl });
      } catch (error) {
        console.error("Error generating image:", error);
        await interaction.editReply({
          content: "There was an error generating the image.",
        });
      }
    } else {
      await interaction.editReply("Too many characters in the description.");
    }
  }
});

client.on("messageCreate", async (message) => {
  // Ignore messages sent by the bot itself
  if (message.author.bot) return;

  // Check if the bot is mentioned in the message
  if (message.mentions.has(client.user)) {
    // Get the content of the message after the mention
    const content = message.content.replace(`<@${client.user.id}>`, "").trim();

    // If the content is not empty, treat it as a question
    if (content.length >= 0) {
      const gptResponse = await gptCompletion(content);

      await message.reply({
        embeds: [new EmbedBuilder().setDescription(gptResponse).setTimestamp()],
      });
    } else {
      await message.reply({
        embeds: [
          new EmbedBuilder()
            .setDescription("Hello! What would you like to ask?")
            .setTimestamp(),
        ],
      });
    }
  }
});

// Login to Discord with your app's token
client.login(token);
