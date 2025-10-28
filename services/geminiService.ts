import { GoogleGenAI, Modality } from "@google/genai";
import type { Profession } from '../types';

const getProfessionPrompt = (profession: Profession): string => {
  return `You are an expert, professional photo editor. Your task is to take the provided image of a person and transform it to look like they are a ${profession}.

Key requirements:
1.  **Face Integrity**: Do NOT alter the person's face, facial expression, or head. The person's head should look exactly as it does in the original photo.
2.  **Clothing Transformation**: Change the person's clothing to a realistic, professional uniform or attire suitable for a ${profession}.
3.  **Seamless Integration**: The person's head and new clothing must be perfectly integrated into a new background. Pay close attention to edges, lighting, and shadows to make it look natural.
4.  **Background Context**: The background must be instantly recognizable and appropriate for a ${profession}. For example, for a 'Scientist', a modern laboratory; for a 'Doctor', a hospital room.
5.  **High Quality**: The final image must be of high resolution and quality, free of artifacts.

Do not add any text, watermarks, or other elements to the image. Just replace the background and change the clothes.`;
};

export const generateProfessionalImage = async (
  base64ImageData: string,
  profession: Profession
): Promise<string> => {
  if (!process.env.API_KEY) {
    throw new Error("API_KEY is not configured.");
  }

  const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
  
  const imagePart = {
    inlineData: {
      data: base64ImageData,
      mimeType: "image/jpeg",
    },
  };

  const textPart = {
    text: getProfessionPrompt(profession),
  };

  try {
    const response = await ai.models.generateContent({
      model: 'gemini-2.5-flash-image',
      contents: {
        parts: [imagePart, textPart],
      },
      config: {
        responseModalities: [Modality.IMAGE],
      },
    });

    for (const part of response.candidates[0].content.parts) {
      if (part.inlineData) {
        return part.inlineData.data;
      }
    }
    
    throw new Error("No image data found in the response from Gemini API.");

  } catch (error) {
    console.error("Error calling Gemini API:", error);
    throw new Error("Failed to generate the image. The AI may have refused the request due to safety settings. Please try a different photo.");
  }
};
