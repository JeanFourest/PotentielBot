import { AudioPlayer } from "@discordjs/voice";

export const songQueue: { [guildId: string]: string[] } = {};

export const loop: { [guildId: string]: boolean } = {};

export const audioPlayer: { [guildId: string]: AudioPlayer } = {};
