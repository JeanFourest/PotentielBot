import { SlashCommandBuilder } from "discord.js";
import { gptGenerateImage } from "../services/generateImage.mjs";
import { embedContructor } from "../messages/gptMessage.mjs";

export const createImageCommand = new SlashCommandBuilder()
  .setName("create_image")
  .setDescription("Generate an image")
  .addStringOption((option) =>
    option
      .setName("description")
      .setDescription("A description for the image")
      .setRequired(true)
  );

export const createImageContent = async (interaction) => {
  try {
    const description = interaction.options.getString("description");

    await interaction.deferReply();

    const imageUrl = await gptGenerateImage(description);
    await interaction.editReply(imageUrl);
  } catch (e) {
    console.error("Error generating image:", e);
    await interaction.editReply({
      embeds: [embedContructor("There was an error generating the image.")],
    });
  }
};
