import { loop, songQueue } from "../states/states.ts";
import { CommandInteraction, SlashCommandBuilder } from "discord.js";
import ytdl from "@distube/ytdl-core";
import { embedContructor, replyOrFollowUpEmbed } from "../utils/utils.ts";

export const loopQueueCommand = new SlashCommandBuilder()
  .setName("loop_queue")
  .setDescription("Loops the queue of songs");

export const loopQueueContent = async (interaction: CommandInteraction) => {
  try {
    const guildId = interaction.guild?.id;
    if (!guildId) return;

    if (!loop[guildId]) {
      loop[guildId] = true;
      await replyOrFollowUpEmbed(interaction, {
        description: "Loop has been enabled.",
      });
    } else {
      loop[guildId] = false;
      await replyOrFollowUpEmbed(interaction, {
        description: "Loop has been disabled",
      });
    }
  } catch (e) {
    console.error("Error looping songs:", e);
  }
};
