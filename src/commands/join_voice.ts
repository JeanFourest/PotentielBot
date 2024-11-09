import {
  DiscordGatewayAdapterCreator,
  joinVoiceChannel,
} from "@discordjs/voice";
import {
  CommandInteraction,
  GuildMember,
  SlashCommandBuilder,
} from "discord.js";
import { embedContructor } from "../messages/gptMessage.js";

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
      joinVoiceChannel({
        channelId: voice.channel.id,
        guildId: guild.id,
        adapterCreator:
          guild.voiceAdapterCreator as unknown as DiscordGatewayAdapterCreator,
        selfDeaf: false,
      });
      await interaction.reply({
        embeds: [embedContructor("Joined the voice channel!")],
      });
    } else {
      await interaction.reply({
        embeds: [embedContructor("You need to join a voice channel first!")],
      });
    }
  } catch (e) {
    console.error("Error joining voice channel:", e);
    await interaction.reply({
      embeds: [
        embedContructor(
          "An error occurred while trying to join the voice channel."
        ),
      ],
    });
  }
};
