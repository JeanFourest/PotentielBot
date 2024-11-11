import { Client, CommandInteraction, SlashCommandBuilder } from "discord.js";
import { embedContructor } from "../utils/utils.ts";

export const helpCommand = new SlashCommandBuilder()
  .setName("help")
  .setDescription("Get list of commands");

export const helpContent = async (
  interaction: CommandInteraction,
  client: Client
) => {
  try {
    if (!client.application) return;
    const commands = await client.application.commands.fetch();

    const commandList = commands
      .map((command) => `/${command.name}`)
      .join("\n");

    await interaction.reply({
      embeds: [embedContructor(`Available commands:\n${commandList}`)],
    });
  } catch (e) {
    console.error("error running help command", e);
  }
};
