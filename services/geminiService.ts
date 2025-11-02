
import { GoogleGenAI, Modality } from "@google/genai";

// The user has provided an API key, so we'll use it directly.
const API_KEY = "AIzaSyDsU6Ks2cjZ1AkDqVklsSCv3jerr7jmz58";

if (!API_KEY) {
  // This error is unlikely to be thrown with a hardcoded key.
  throw new Error("API_KEY is not set.");
}

const ai = new GoogleGenAI({ apiKey: API_KEY });

export const editImage = async (base64ImageData: string, mimeType: string, prompt: string): Promise<string> => {
  try {
    const response = await ai.models.generateContent({
      model: 'gemini-2.5-flash-image',
      contents: {
        parts: [
          {
            inlineData: {
              data: base64ImageData,
              mimeType: mimeType,
            },
          },
          {
            text: prompt,
          },
        ],
      },
      config: {
          responseModalities: [Modality.IMAGE],
      },
    });

    const candidate = response.candidates?.[0];

    // 1. Successful case: Find and return the image
    const imagePart = candidate?.content?.parts?.find(p => p.inlineData?.data);
    if (imagePart?.inlineData) {
        const base64ImageBytes: string = imagePart.inlineData.data;
        const imageMimeType: string = imagePart.inlineData.mimeType;
        return `data:${imageMimeType};base64,${base64ImageBytes}`;
    }

    // 2. Unsuccessful case: gather all available info to build the best error message
    const blockReason = response.promptFeedback?.blockReason;
    const blockMessage = response.promptFeedback?.blockReasonMessage;
    const finishReason = candidate?.finishReason;
    const finishMessage = candidate?.finishMessage;
    const textResponse = response.text;

    let errorMessage: string;

    if (blockReason) {
        errorMessage = `Image generation was blocked due to ${blockReason}`;
        if (blockMessage) errorMessage += `: "${blockMessage}"`;
    } else if (finishMessage) {
        errorMessage = `The model could not generate an image: ${finishMessage}`;
    } else if (textResponse) {
        errorMessage = `The model responded with text instead of an image: "${textResponse}"`;
    } else if (finishReason === 'NO_IMAGE') {
        errorMessage = "The model was unable to generate an image. This can happen if the request is unclear, violates safety policies, or is otherwise unsupported. Please try rephrasing your prompt or using a different image.";
    } else if (finishReason) {
        errorMessage = `Image generation failed with reason: ${finishReason}.`;
    } else {
        errorMessage = "An unknown error occurred. No image was generated and no specific reason was provided.";
    }
    
    throw new Error(errorMessage);

  } catch (error) {
    console.error("Error editing image with Gemini API:", error);
    if (error instanceof Error) {
        throw new Error(`Failed to generate image: ${error.message}`);
    }
    throw new Error("An unknown error occurred while generating the image.");
  }
};

export const createPromptFromImage = async (base64ImageData: string, mimeType: string): Promise<string> => {
  try {
    const response = await ai.models.generateContent({
      model: 'gemini-2.5-flash',
      contents: {
        parts: [
          {
            inlineData: {
              data: base64ImageData,
              mimeType: mimeType,
            },
          },
          {
            text: "Please describe this image in a way that could be used as a prompt to edit it. Be descriptive and focus on the main subject and its environment.",
          },
        ],
      },
    });

    const blockReason = response.promptFeedback?.blockReason;
    if (blockReason) {
      throw new Error(`Prompt creation was blocked. Reason: ${blockReason}`);
    }

    const text = response.text;
    if (!text) {
      const finishReason = response.candidates?.[0]?.finishReason;
      if (finishReason && finishReason !== 'STOP') {
        throw new Error(`Prompt creation failed. Finish reason: ${finishReason}. Please try again.`);
      }
      throw new Error("The model returned an empty prompt. Please try again.");
    }

    return text;

  } catch (error) {
    console.error("Error creating prompt with Gemini API:", error);
    if (error instanceof Error) {
        throw new Error(`Failed to create prompt: ${error.message}`);
    }
    throw new Error("An unknown error occurred while creating the prompt.");
  }
};