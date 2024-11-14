import { Client, CommandInteraction, SlashCommandBuilder } from "discord.js";
import { embedContructor, replyOrFollowUpEmbed } from "../utils/utils.ts";

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

    await replyOrFollowUpEmbed(interaction, {
      description: `Available commands:\n${commandList}`,
    });
  } catch (e) {
    console.error("error running help command", e);
  }
};
