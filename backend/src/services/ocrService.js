import { visionModel } from "./geminiClient.js";

export const runOCR = async (file) => {
  try {
    const base64Image = file.buffer.toString("base64");

    const prompt = `You are an OCR assistant for appointment notes. 
Return ONLY the plain text you see, no explanations.`;

    const result = await visionModel.generateContent([
      {
        inlineData: {
          data: base64Image,
          mimeType: file.mimetype,
        },
      },
      prompt,
    ]);

    const response = await result.response;
    const text = response.text().trim();

    return {
      text,
      confidence: 0.9,
    };
  } catch (err) {
    console.error("OCR error:", err);
    return {
      text: "",
      confidence: 0.0,
    };
  }
};
