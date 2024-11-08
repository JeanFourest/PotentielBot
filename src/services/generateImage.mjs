import { createRequire } from "module";
const require = createRequire(import.meta.url);
import OpenAI from "openai";
require("dotenv").config();

const openai = new OpenAI({
  apiKey: process.env.OPEN_AI_TOKEN || "",
});

export const gptGenerateImage = async (prompt) => {
  try {
    const response = await openai.images.generate({
      model: "dall-e-3",
      prompt: prompt,
      n: 1,
      size: "1024x1024",
    });

    const image_url = response.data[0].url;

    return image_url;
  } catch (e) {
    console.error(e);
  }
};
