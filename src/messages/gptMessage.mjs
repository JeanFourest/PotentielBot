import { EmbedBuilder } from "discord.js";
import { gptCompletion } from "../services/openai.mjs";

export const gptMessage = async (message, client) => {
  // Ignore messages sent by the bot itself
  if (message.author.bot) return;

  // Check if the bot is mentioned in the message
  if (message.mentions.has(client.user)) {
    // Get the content of the message after the mention
    const content = message.content.replace(`<@${client.user.id}>`, "").trim();

    // If the content is not empty, treat it as a question
    if (content.length >= 0) {
      const gptResponse = await gptCompletion(content);

      await message.reply({
        embeds: [embedContructor(gptResponse)],
      });
    } else {
      await message.reply({
        embeds: [embedContructor("Hello! What would you like to ask?")],
      });
    }
  }
};

export const embedContructor = (description) => {
  return new EmbedBuilder().setDescription(description).setTimestamp();
};
