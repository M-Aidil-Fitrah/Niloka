import { GoogleGenerativeAI } from "@google/generative-ai";

if (!process.env.GEMINI_API_KEY) {
  throw new Error("GEMINI_API_KEY tidak ditemukan di environment variables");
}

export const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);

export const geminiFlashModel = genAI.getGenerativeModel({
  model: process.env.GEMINI_MODEL || "gemini-2.0-flash",
});
