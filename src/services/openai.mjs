import { createRequire } from "module";
const require = createRequire(import.meta.url);
import OpenAI from "openai";
import { getUserPrompt } from "../utils.mjs";
require("dotenv").config();

const openai = new OpenAI({
  apiKey: process.env.OPEN_AI_TOKEN || "",
});

export const gptCompletion = async (prompt, images) => {
  const userPrompt = getUserPrompt(prompt, images);

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
