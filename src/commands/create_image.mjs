import { gptGenerateImage } from "../services/generateImage.mjs";

export const createImageCommand = () => {
  return client.application.commands.create(
    new SlashCommandBuilder()
      .setName("create_image")
      .setDescription("Generate an image")
      .addStringOption((option) =>
        option
          .setName("description")
          .setDescription("A description for the image")
          .setRequired(true)
      )
  );
};

export const createImageContent = async (interaction) => {
  const description = interaction.options.getString("description");

  await interaction.deferReply();

  if (description.length < 1900) {
    try {
      const imageUrl = await gptGenerateImage(description);
      await interaction.editReply({ content: imageUrl });
    } catch (error) {
      console.error("Error generating image:", error);
      await interaction.editReply({
        content: "There was an error generating the image.",
      });
    }
  } else {
    await interaction.editReply("Too many characters in the description.");
  }
};
