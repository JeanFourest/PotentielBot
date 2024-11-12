import { CommandInteraction, SlashCommandBuilder } from "discord.js";
import { songQueue } from "./play_music.ts";
import ytdl from "@distube/ytdl-core";
import { embedContructor, replyOrFollowUpEmbed } from "../utils/utils.ts";

export const nowPlayingCommand = new SlashCommandBuilder()
  .setName("now_playing")
  .setDescription("Displays the currently playing song information");

export const nowPlayingContent = async (interaction: CommandInteraction) => {
  try {
    const guildId = interaction.guild?.id;
    if (!guildId) return;

    const currentSong = songQueue[guildId]?.[0];
    if (currentSong) {
      // Fetch song details (like title) using ytdl
      const info = await ytdl.getBasicInfo(currentSong);
      const title = info.videoDetails.title ?? "unknown title";
      const author = info.videoDetails.author.name ?? "unknown author";

      await replyOrFollowUpEmbed(interaction, {
        title: `Now playing: **${title}** by **${author}**`,
        url: info.videoDetails.video_url,
      });
    } else {
      await replyOrFollowUpEmbed(interaction, {
        description: "There is no song currently playing.",
      });
    }
  } catch (e) {
    console.error("Error fetching current song info:", e);
  }
};
