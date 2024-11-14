import { CommandInteraction, Guild, SlashCommandBuilder } from "discord.js";
import { embedContructor, replyOrFollowUpEmbed } from "../utils/utils.ts";
import { getVoiceConnection } from "@discordjs/voice";
import { playNextSong } from "./play_music.ts";
import { loop, songQueue } from "../states/states.ts";

export const skipMusicCommand = new SlashCommandBuilder()
  .setName("skip_music")
  .setDescription("skips the current music");

export const skipMusicContent = async (interaction: CommandInteraction) => {
  try {
    if (!interaction.guild) return;
    const guild = interaction.guild;
    const connection = getVoiceConnection(guild.id);

    if (!connection) {
      await replyOrFollowUpEmbed(interaction, {
        description: "I'm not currently in a voice channel.",
      });
      return;
    }

    if (!songQueue[guild.id] || songQueue[guild.id].length === 0) {
      await replyOrFollowUpEmbed(interaction, {
        description: "There's no song to skip.",
      });
      return;
    }

    // Remove the current song and play the next if available
    if (songQueue[guild.id]?.length && !loop[guild.id]) {
      songQueue[guild.id].shift();
    } else {
      songQueue[guild.id].push(songQueue[guild.id][0]);
      songQueue[guild.id].shift();
    }

    if (songQueue[guild.id].length > 0) {
      console.log("Skipping song and playing next song.");
      await replyOrFollowUpEmbed(interaction, {
        description: "Skipping song and playing next song.",
      });
      await playNextSong(guild, interaction).catch((e) =>
        console.error("Error playing next song:", e)
      );
    } else {
      stopSong(guild);
      console.log("No more songs in the queue.");
      await replyOrFollowUpEmbed(interaction, {
        description: "There are no more songs in the queue.",
      });
    }
  } catch (e) {
    console.error("Error skipping music:", e);
    await replyOrFollowUpEmbed(interaction, {
      description: "An error occurred while trying to skip music.",
    });
  }
};

const stopSong = (guild: Guild) => {
  const connection = getVoiceConnection(guild.id);

  if (!connection) {
    console.log("No active connection to stop.");
    return;
  }

  // Clear the song queue for the guild
  songQueue[guild.id] = [];
  console.log("Music stopped.");
  connection.destroy();
};
