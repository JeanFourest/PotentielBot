import OpenAI from "openai";
import { getUserPrompt } from "../utils.js";
import dotenv from "dotenv";
import { Attachment, Collection } from "discord.js";
dotenv.config();

const openai = new OpenAI({
  apiKey: process.env.OPEN_AI_TOKEN ?? "",
});

export const gptCompletion = async (
  prompt: string,
  images: Collection<string, Attachment> | undefined
) => {
  const userPrompt: any = getUserPrompt(prompt, images);

  try {
    const completion = await openai.chat.completions.create({
      model: "gpt-4o",
      messages: [
        { role: "system", content: "you are a bot called Potentiel" },
        {
          role: "user",
          content: userPrompt,
        },
      ],
    });

    let gptResponse = completion.choices[0].message.content;

    if (!gptResponse) return;

    // Split the response into chunks of 1500 characters
    const chunkSize = 2000;

    // Regular expression to match code blocks (enclosed by three backticks)
    const codeBlockRegex = /```[^`]*```/g;

    // Split the response by code blocks and normal text
    let parts = gptResponse.split(codeBlockRegex);

    // Handle code blocks as separate parts
    let codeBlocks = gptResponse.match(codeBlockRegex) || [];

    // Combine text and code blocks into separate chunks
    let allParts = [];
    let i = 0;
    while (i < parts.length || i < codeBlocks.length) {
      if (i < parts.length && parts[i]) {
        let part = parts[i];
        while (part.length > chunkSize) {
          allParts.push(`${part.substring(0, chunkSize)}`);
          part = part.substring(chunkSize);
        }
        if (part) {
          allParts.push(`\n${part}`);
        }
      }

      if (i < codeBlocks.length) {
        allParts.push(`${codeBlocks[i]}`);
      }
      i++;
    }

    return allParts;
  } catch (e) {
    console.error(e);
  }
};
