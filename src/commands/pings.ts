import { CommandInteraction, SlashCommandBuilder } from "discord.js";
import { embedContructor } from "../messages/gptMessage.js";

export const pingCommand = new SlashCommandBuilder()
  .setName("ping")
  .setDescription("Ask a question to the bot");

export const pingContent = async (interaction: CommandInteraction) => {
  try {
    await interaction.reply({
      embeds: [embedContructor("Pong! The bot is alive!")],
    });
  } catch (e) {
    console.error("Error running ping command:", e);
    await interaction.reply({
      embeds: [embedContructor("An error occurred while trying to ping.")],
    });
  }
};
