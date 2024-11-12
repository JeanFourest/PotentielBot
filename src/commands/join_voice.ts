import {
  createAudioPlayer,
  createAudioResource,
  DiscordGatewayAdapterCreator,
  joinVoiceChannel,
} from "@discordjs/voice";
import {
  CommandInteraction,
  GuildMember,
  SlashCommandBuilder,
} from "discord.js";
import { embedContructor, replyOrFollowUpEmbed } from "../utils/utils.ts";
import ytdl from "@distube/ytdl-core";

export const joinVoiceCommand = new SlashCommandBuilder()
  .setName("join_voice")
  .setDescription("Potentiel will join the voice call");

export const joinVoiceContent = async (interaction: CommandInteraction) => {
  try {
    if (!interaction.member || !interaction.guild) return;

    const guild = interaction.guild;
    const member = interaction.member as GuildMember;

    const voice = member.voice;

    if (voice.channel) {
      const connection = joinVoiceChannel({
        channelId: voice.channel.id,
        guildId: guild.id,
        adapterCreator:
          guild.voiceAdapterCreator as unknown as DiscordGatewayAdapterCreator,
        selfDeaf: false,
        selfMute: false,
      });

      /* if (!connection) return;

      const player = createAudioPlayer();
      connection.subscribe(player);

      const resource = createAudioResource("./rowrow.mp3");

      player.play(resource); */

      await replyOrFollowUpEmbed(interaction, {
        description: "Joined the voice channel!",
      });
    } else {
      await replyOrFollowUpEmbed(interaction, {
        description: "You need to join a voice channel first!",
      });
    }
  } catch (e) {
    console.error("Error joining voice channel:", e);
  }
};
