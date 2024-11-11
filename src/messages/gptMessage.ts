import { Client, Message } from "discord.js";
import { gptCompletion } from "../services/openai.js";
import { embedContructor } from "../utils/utils.ts";

export const gptMessage = async (message: Message, client: Client) => {
  try {
    const user = client.user;

    // check if user exists
    if (!user) return;

    // Ignore messages sent by the bot itself
    if (message.author.bot) return;

    // Check if the bot is mentioned in the message
    if (message.mentions.has(user)) {
      // Get the content of the message after the mention
      const content = message.content.replace(`<@${user.id}>`, "").trim();

      // If the content is not empty, treat it as a question
      if (content.length >= 0) {
        const imageAttachments = message.attachments
          ? message.attachments
          : undefined;

        const gptResponses = await gptCompletion(content, imageAttachments);

        if (!gptResponses) return;

        gptResponses.forEach(async (parts) => {
          await message.reply({
            embeds: [embedContructor(parts)],
          });
        });
      } else {
        await message.reply({
          embeds: [embedContructor("Hello! What would you like to ask?")],
        });
      }
    }
  } catch (e) {
    console.error("Error with gptMessage", e);
    await message.reply({
      embeds: [
        embedContructor(
          "An error occurred while trying to interact with Potentiel."
        ),
      ],
    });
  }
};
