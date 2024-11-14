import { getVoiceConnection } from "@discordjs/voice";
import { CommandInteraction, SlashCommandBuilder } from "discord.js";
import { embedContructor, replyOrFollowUpEmbed } from "../utils/utils.ts";
import { songQueue } from "../states/states.ts";

export const leaveVoiceCommand = new SlashCommandBuilder()
  .setName("leave_voice")
  .setDescription("Potentiel will leave the voice call");

export const leaveVoiceContent = async (interaction: CommandInteraction) => {
  try {
    const guildId = interaction.guildId ?? "";
    const connection = getVoiceConnection(guildId);

    if (connection) {
      songQueue[guildId] = [];

      connection.destroy();
      await replyOrFollowUpEmbed(interaction, {
        description: "Successfully left the voice channel.",
      });
    } else {
      await replyOrFollowUpEmbed(interaction, {
        description: "I'm not currently in a voice channel.",
      });
    }
  } catch (e) {
    console.error("Error leaving voice channel:", e);
  }
};
