import { GoogleGenerativeAI } from '@google/generative-ai';
import dotenv from 'dotenv';
dotenv.config();

const apiKey = process.env.GOOGLE_API_KEY;

if (!apiKey) {
  console.warn('WARNING: GOOGLE_API_KEY is not set.');
}

const genAI = new GoogleGenerativeAI(apiKey);

export const textModel = genAI.getGenerativeModel({
  model: 'gemini-1.5-flash'
});

export const visionModel = genAI.getGenerativeModel({
  model: 'gemini-1.5-flash'
});
