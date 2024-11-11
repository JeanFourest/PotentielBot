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
import { embedContructor } from "../utils/utils.ts";

// Queue for each guild
export const songQueue: { [guildId: string]: string[] } = {};

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
      if (!songQueue[guild.id]) {
        songQueue[guild.id] = [];
      }

      // Add song to the queue
      songQueue[guild.id].push(url);

      // Reply to the user
      await interaction.reply({
        embeds: [
          embedContructor(
            `Added song to the queue! Queue length: ${
              songQueue[guild.id].length
            }`
          ),
        ],
      });

      // Start playing if nothing is playing
      if (songQueue[guild.id].length === 1) {
        await playNextSong(guild, interaction);
      }
    } else {
      await interaction.reply({
        embeds: [embedContructor("You need to join a voice channel first!")],
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

    const stream = ytdl(url, { filter: "audioonly" });
    stream.on("error", async (err) => {
      // Attempt to play the next song
      if (songQueue[guild.id]?.length) songQueue[guild.id].shift();

      await playNextSong(guild, interaction).catch((e) =>
        console.error("Error playing next song:", e)
      );
    });

    const resource = createAudioResource(stream, {
      inputType: StreamType.WebmOpus,
    });

    player.play(resource);

    player.on("error", async (error) => {
      console.error("Error from Audio Player:", error);
      await interaction.reply({
        embeds: [embedContructor("An error occured while playing song.")],
      });
      songQueue[guild.id].shift();
      playNextSong(guild, interaction).catch((e) =>
        console.error("Error playing next song:", e)
      );
    });

    player.on("stateChange", async (oldState, newState) => {
      if (newState.status === AudioPlayerStatus.Idle) {
        songQueue[guild.id].shift();
        await playNextSong(guild, interaction);
      }
    });
  } catch (e) {
    console.log("error playing next song", e);
    await interaction.reply({
      embeds: [
        embedContructor("An error occured while trying to play next song"),
      ],
    });
  }
}

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
      const title = info.videoDetails.title;
      const author = info.videoDetails.author.name;

      await interaction.reply({
        embeds: [embedContructor(`Now playing: **${title}** by **${author}**`)],
      });
    } else {
      await interaction.reply({
        embeds: [embedContructor("There is no song currently playing.")],
      });
    }
  } catch (e) {
    console.error("Error fetching current song info:", e);
    await interaction.reply({
      embeds: [
        embedContructor("An error occurred while fetching the song info."),
      ],
    });
  }
};
