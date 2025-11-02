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

    if (response.candidates && response.candidates.length > 0) {
        for (const part of response.candidates[0].content.parts) {
            if (part.inlineData) {
                const base64ImageBytes: string = part.inlineData.data;
                const imageMimeType: string = part.inlineData.mimeType;
                return `data:${imageMimeType};base64,${base64ImageBytes}`;
            }
        }
    }
    
    throw new Error("No image data found in the API response.");

  } catch (error) {
    console.error("Error editing image with Gemini API:", error);
    if (error instanceof Error) {
        throw new Error(`Failed to generate image: ${error.message}`);
    }
    throw new Error("An unknown error occurred while generating the image.");
  }
};
