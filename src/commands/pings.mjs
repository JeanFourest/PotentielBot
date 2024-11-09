import { SlashCommandBuilder } from "discord.js";
import { embedContructor } from "../messages/gptMessage.mjs";

export const pingCommand = new SlashCommandBuilder()
  .setName("ping")
  .setDescription("Ask a question to the bot");

export const pingContent = async (interaction) => {
  await interaction.reply({
    embeds: [embedContructor("Pong! The bot is alive!")],
  });
};
