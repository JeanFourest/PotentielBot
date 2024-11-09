import { SlashCommandBuilder } from "discord.js";
import { embedContructor } from "../messages/gptMessage.mjs";

export const helpCommand = new SlashCommandBuilder()
  .setName("help")
  .setDescription("Get list of commands");

export const helpContent = async (interaction, client) => {
  try {
    const commands = await client.application.commands.fetch();

    const commandList = commands
      .map((command) => `/${command.name}`)
      .join("\n");

    await interaction.reply({
      embeds: [embedContructor(`Available commands:\n${commandList}`)],
    });
  } catch (e) {
    console.error("error running help command", e);
    await interaction.reply({
      embeds: [
        embedContructor("An error occurred while trying to run help command."),
      ],
    });
  }
};
