import { CommandInteraction, SlashCommandBuilder } from "discord.js";
import { gptGenerateImage } from "../services/generateImage.js";

export const createImageCommand = new SlashCommandBuilder()
  .setName("create_image")
  .setDescription("Generate an image")
  .addStringOption((option) =>
    option
      .setName("description")
      .setDescription("A description for the image")
      .setRequired(true)
  );

export const createImageContent = async (interaction: CommandInteraction) => {
  try {
    const description: any = interaction.options.get("description")?.value;

    await interaction.deferReply();

    const imageUrl = await gptGenerateImage(description);
    if (!imageUrl) return;
    await interaction.editReply(imageUrl);
  } catch (e) {
    console.error("Error generating image:", e);
  }
};
