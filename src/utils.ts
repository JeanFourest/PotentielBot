import { Attachment, Collection } from "discord.js";

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
