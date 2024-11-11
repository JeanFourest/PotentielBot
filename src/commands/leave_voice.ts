import { getVoiceConnection } from "@discordjs/voice";
import { CommandInteraction, SlashCommandBuilder } from "discord.js";
import { embedContructor } from "../utils/utils.ts";
import { songQueue } from "./play_music.ts";

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
      await interaction.reply({
        embeds: [embedContructor("Successfully left the voice channel.")],
      });
    } else {
      await interaction.reply({
        embeds: [embedContructor("I'm not currently in a voice channel.")],
      });
    }
  } catch (e) {
    console.error("Error leaving voice channel:", e);
  }
};
