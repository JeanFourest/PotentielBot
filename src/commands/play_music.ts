import { SlashCommandBuilder } from "discord.js";

export const playMusicCommand = new SlashCommandBuilder()
  .setName("play_music")
  .setDescription("Plays musics from url");

export const playMusicContent = async () => {};
