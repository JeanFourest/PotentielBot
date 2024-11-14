import { audioPlayer, songQueue } from "../states/states.ts";
import { CommandInteraction, SlashCommandBuilder } from "discord.js";
import ytdl from "@distube/ytdl-core";
import { replyOrFollowUpEmbed } from "../utils/utils.ts";

export const UnpauseMusicCommand = new SlashCommandBuilder()
  .setName("unpause_music")
  .setDescription("resumes the current song");

export const UnpauseMusicContent = async (interaction: CommandInteraction) => {
  try {
    const guildId = interaction.guild?.id;
    if (!guildId) return;

    audioPlayer[guildId].unpause();

    await replyOrFollowUpEmbed(interaction, {
      description: "Music has been resumed.",
    });
  } catch (e) {
    console.error("Error resuming current song:", e);
  }
};
