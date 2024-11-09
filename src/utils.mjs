export const getUserPrompt = (prompt, images) => {
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
