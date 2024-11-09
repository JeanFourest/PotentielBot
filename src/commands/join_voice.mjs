import { joinVoiceChannel } from "@discordjs/voice";
import { SlashCommandBuilder } from "discord.js";
import { embedContructor } from "../messages/gptMessage.mjs";

export const joinVoiceCommand = new SlashCommandBuilder()
  .setName("join_voice")
  .setDescription("Potentiel will join the voice call");

export const joinVoiceContent = async (interaction) => {
  if (interaction.member.voice.channel) {
    joinVoiceChannel({
      channelId: interaction.member.voice.channel.id,
      guildId: interaction.guild.id,
      adapterCreator: interaction.guild.voiceAdapterCreator,
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
};