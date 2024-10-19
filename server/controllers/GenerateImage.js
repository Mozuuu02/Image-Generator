import * as dotenv from "dotenv";
import { createError } from "../error.js";
import OpenAI from "openai"; // Correct import for SDK v4.x

dotenv.config();

// Setup OpenAI API key
const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,  // Your API key
});

// Controller to generate an image
export const generateImage = async (req, res, next) => {
  try {
    const { prompt } = req.body;

    // Use the images.generate method to generate an image
    const response = await openai.images.generate({
      prompt: prompt,  // Use the prompt from the request body
      n: 1,            // Number of images to generate
      size: "1024x1024", // Image size
      response_format: "b64_json", // Return as base64
    });

    const generatedImage = response.data[0].b64_json; // Extract the base64 image

    // Send the generated image as a response
    res.status(200).json({ photo: generatedImage });
  } catch (error) {
    next(
      createError(
        error.response?.status || 500,
        error.response?.data?.error?.message || error.message
      )
    );
  }
};
