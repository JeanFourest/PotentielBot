import { audioPlayer, songQueue } from "../states/states.ts";
import { CommandInteraction, SlashCommandBuilder } from "discord.js";
import ytdl from "@distube/ytdl-core";
import { replyOrFollowUpEmbed } from "../utils/utils.ts";

export const PauseMusicCommand = new SlashCommandBuilder()
  .setName("pause_music")
  .setDescription("Pauses the current song");

export const PauseMusicContent = async (interaction: CommandInteraction) => {
  try {
    const guildId = interaction.guild?.id;
    if (!guildId) return;

    audioPlayer[guildId].pause();

    await replyOrFollowUpEmbed(interaction, {
      description: "Music has been paused.",
    });
  } catch (e) {
    console.error("Error pausing current song:", e);
  }
};
