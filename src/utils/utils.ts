import {
  Attachment,
  Collection,
  CommandInteraction,
  EmbedBuilder,
  Message,
} from "discord.js";

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

export const replyOrFollowUpEmbed = (
  interaction: any,
  options: EmbedOptions
) => {
  const embed = embedContructor(options);

  if (interaction.replied) {
    interaction.followUp({ embeds: [embed] });
  } else if (interaction.deferred) {
    return interaction.editReply({ embeds: [embed] });
  } else {
    return interaction.reply({ embeds: [embed] });
  }
};

export const embedContructor = (option: EmbedOptions) => {
  const embed = new EmbedBuilder().setTimestamp();
  if (option.description) embed.setDescription(option.description);
  if (option.url) embed.setURL(option.url);
  if (option.title) embed.setTitle(option.title);
  return embed;
};

export type EmbedOptions = {
  description?: string;
  url?: string;
  title?: string;
};
