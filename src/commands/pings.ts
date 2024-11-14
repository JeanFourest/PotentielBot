import { CommandInteraction, SlashCommandBuilder } from "discord.js";
import { embedContructor, replyOrFollowUpEmbed } from "../utils/utils.ts";

export const pingCommand = new SlashCommandBuilder()
  .setName("ping")
  .setDescription("Ask a question to the bot");

export const pingContent = async (interaction: CommandInteraction) => {
  try {
    await replyOrFollowUpEmbed(interaction, {
      description: "Pong! The bot is alive!",
    });
  } catch (e) {
    console.error("Error running ping command:", e);
  }
};
