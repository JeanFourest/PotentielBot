import { createRequire } from "module";
const require = createRequire(import.meta.url);
import OpenAI from "openai";
require("dotenv").config();
import { catGirl } from "../personalities/catgirl.mjs";

const openai = new OpenAI({
  apiKey: process.env.OPEN_AI_TOKEN || "",
});

export const gptCompletion = async (prompt) => {
  try {
    const completion = await openai.chat.completions.create({
      model: "gpt-4o",
      messages: [
        { role: "system", content: "you are an assistant" },
        {
          role: "user",
          content: `${prompt}`,
        },
      ],
    });

    let gptResponse = completion.choices[0].message.content;

    // Split the response into chunks of 1500 characters
    const chunkSize = 2000;
    let partNumber = 1;

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
          allParts.push(`part ${partNumber}:\n${part.substring(0, chunkSize)}`);
          part = part.substring(chunkSize);
          partNumber++;
        }
        if (part) {
          allParts.push(`part ${partNumber}:\n${part}`);
          partNumber++;
        }
      }

      if (i < codeBlocks.length) {
        allParts.push(`part ${partNumber}:\n${codeBlocks[i]}`);
        partNumber++;
      }
      i++;
    }

    return allParts;
  } catch (e) {
    console.error(e);
  }
};
