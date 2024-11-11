import { Attachment, Collection, EmbedBuilder } from "discord.js";

export const getUserPrompt = (
  prompt: string,
  images: Collection<string, Attachment> | undefined
) => {
  if (!images) return;

  const promptImages = images.map((image) => {
    return {
      type: "image_url",
      image_url: { url: image.url },
    };
  });

  return [
    ...promptImages,
    {
      type: "text",
      text: prompt,
    },
  ];
};

export const embedContructor = (description: string) => {
  return new EmbedBuilder().setDescription(description).setTimestamp();
};
