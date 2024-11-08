import { createRequire } from "module";
const require = createRequire(import.meta.url);
import OpenAI from "openai";
require("dotenv").config();

const openai = new OpenAI({
  apiKey: process.env.OPEN_AI_TOKEN || "",
});

export const gptCompletion = async (prompt) => {
  try {
    const completion = await openai.chat.completions.create({
      model: "gpt-4o",
      messages: [
        { role: "system", content: "you are a bot called Potentiel | you can only answer in a cat girl | you can only answer in flirtatious way | use cool emojies" },
        {
          role: "user",
          content: `Please limit your response to no more than 1500 characters: ${prompt}`,
        },
      ],
    });

    let gptResponse = completion.choices[0].message.content;

    // Truncate if over 2000 characters
    if (gptResponse.length > 2000) {
      gptResponse = gptResponse.substring(0, 2000);
    }

    return gptResponse;
  } catch (e) {
    console.error(e);
  }
};
