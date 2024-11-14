import {
  AudioPlayerStatus,
  createAudioPlayer,
  createAudioResource,
  DiscordGatewayAdapterCreator,
  getVoiceConnection,
  joinVoiceChannel,
  StreamType,
} from "@discordjs/voice";
import {
  CommandInteraction,
  Guild,
  GuildMember,
  SlashCommandBuilder,
} from "discord.js";

import ytdl from "@distube/ytdl-core";
import { replyOrFollowUpEmbed } from "../utils/utils.ts";
import { nowPlayingContent } from "./now_playing.ts";
import { audioPlayer, loop, songQueue } from "../states/states.ts";

export const playMusicCommand = new SlashCommandBuilder()
  .setName("play")
  .setDescription("Plays music")
  .addStringOption((option) =>
    option
      .setName("song")
      .setDescription("url is needed to find the song")
      .setRequired(true)
  );

export const playMusicContent = async (interaction: CommandInteraction) => {
  try {
    const url: any = interaction.options.get("song")?.value;

    if (!interaction.member || !interaction.guild) return;

    const guild = interaction.guild;
    const member = interaction.member as GuildMember;

    const voice = member.voice;

    if (voice.channel) {
      let connection = getVoiceConnection(guild.id);

      if (!connection) {
        connection = joinVoiceChannel({
          channelId: voice.channel.id,
          guildId: guild.id,
          adapterCreator:
            guild.voiceAdapterCreator as unknown as DiscordGatewayAdapterCreator,
          selfDeaf: false,
          selfMute: false,
        });
      }

      // Initialize queue if it doesn't exist
      if (!songQueue[guild.id] || !loop[guild.id]) {
        songQueue[guild.id] = [];
        loop[guild.id] = false;
      }

      // Add song to the queue
      songQueue[guild.id].push(url);

      // Reply to the user
      await replyOrFollowUpEmbed(interaction, {
        description: `Added song to the queue! Queue length: ${
          songQueue[guild.id].length
        }`,
      });

      // Start playing if nothing is playing
      if (songQueue[guild.id].length === 1) {
        await playNextSong(guild, interaction);
      }
    } else {
      await replyOrFollowUpEmbed(interaction, {
        description: "You need to join a voice channel first!",
      });
    }
  } catch (e) {
    console.error("Error playing music in voice channel:", e);
  }
};

// Function to play the next song in the queue
export async function playNextSong(
  guild: Guild,
  interaction: CommandInteraction
) {
  try {
    const connection = getVoiceConnection(guild.id);
    if (!connection || songQueue[guild.id].length === 0) return;

    // Get the first song in the queue
    const url = songQueue[guild.id][0];

    const player = createAudioPlayer();
    connection.subscribe(player);

    const stream = ytdl(url, {
      filter: "audioonly",
      highWaterMark: 1 << 18,
      dlChunkSize: 0,
      quality: "highestaudio",
    });

    stream.on("error", async (err) => {
      // Attempt to play the next song
      if (songQueue[guild.id]?.length && !loop[guild.id]) {
        songQueue[guild.id].shift();
      } else {
        songQueue[guild.id].push(songQueue[guild.id][0]);
        songQueue[guild.id].shift();
      }

      await playNextSong(guild, interaction).catch((e) =>
        console.error("Error playing next song:", e)
      );
    });

    const resource = createAudioResource(stream, {
      inputType: StreamType.WebmOpus,
    });

    player.play(resource);
    audioPlayer[guild.id] = player;

    player.on(AudioPlayerStatus.Playing, async () => {
      await nowPlayingContent(interaction);
    });

    player.on("error", async (error) => {
      console.error("Error from Audio Player:", error);
      await replyOrFollowUpEmbed(interaction, {
        description: "An error occured while playing song.",
      });
      if (songQueue[guild.id]?.length && !loop[guild.id]) {
        songQueue[guild.id].shift();
      } else {
        songQueue[guild.id].push(songQueue[guild.id][0]);
        songQueue[guild.id].shift();
      }
      playNextSong(guild, interaction).catch((e) =>
        console.error("Error playing next song:", e)
      );
    });

    player.on("stateChange", async (oldState, newState) => {
      if (newState.status === AudioPlayerStatus.Idle) {
        if (songQueue[guild.id]?.length && !loop[guild.id]) {
          songQueue[guild.id].shift();
        } else {
          songQueue[guild.id].push(songQueue[guild.id][0]);
          songQueue[guild.id].shift();
        }
        await playNextSong(guild, interaction);
      }
    });
  } catch (e) {
    console.log("error playing next song", e);
    await replyOrFollowUpEmbed(interaction, {
      description: "An error occured while trying to play next song",
    });
  }
}
