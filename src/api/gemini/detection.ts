import { GoogleGenAI, Type } from "@google/genai";
import { fileToBase64, parseGeminiNutritionResponse } from './utils';
import type { GeminiDetectionResult } from './types';

const ai = new GoogleGenAI({
  apiKey: import.meta.env.VITE_GEMINI_API_KEY
});

export const detectFoodWithGemini = async (imageFile: File): Promise<GeminiDetectionResult> => {
  try {
    console.log("🔄 Starting Gemini food detection with nutrition...");
    
    const apiKey = import.meta.env.VITE_GEMINI_API_KEY;
    if (!apiKey) {
      throw new Error("API key Gemini tidak ditemukan");
    }

    const base64Data = await fileToBase64(imageFile);
    console.log("📸 Image converted to base64");

    const prompt = `Analisa gambar makanan ini dan identifikasi item makanan spesifik dengan fakta nutrisinya.
Kembalikan HANYA array JSON dengan struktur persis seperti ini:

[
  {
    "name": "nama makanan spesifik dalam BAHASA INDONESIA",
    "nutrition": {
      "kalori": angka,
      "karbo": angka,
      "lemak": angka, 
      "protein": angka
    }
  }
]

ATURAN PENTING:
1. Nama makanan HARUS dalam BAHASA INDONESIA
2. Nilai nutrisi adalah PER 100 GRAM untuk makanan, PER 100 ML untuk minuman
3. Kembalikan HANYA array JSON yang valid, tanpa teks lain

Contoh response yang benar:
[
  {
    "name": "telur rebus",
    "nutrition": {
      "kalori": 155,
      "karbo": 1.1,
      "lemak": 11,
      "protein": 13
    }
  }
]`;

    const contents = [
      {
        inlineData: {
          mimeType: imageFile.type,
          data: base64Data,
        },
      },
      { text: prompt },
    ];

    console.log("📤 Sending to Gemini...");
    
    const timeoutPromise = new Promise<never>((_, reject) => 
      setTimeout(() => reject(new Error("Timeout: Gemini tidak merespons dalam 30 detik")), 30000)
    );

    const apiPromise = ai.models.generateContent({
      model: "gemini-2.5-flash",
      contents: contents,
      config: {
        responseMimeType: "application/json",
        responseSchema: {
          type: Type.ARRAY,
          items: {
            type: Type.OBJECT,
            properties: {
              name: { type: Type.STRING },
              nutrition: {
                type: Type.OBJECT,
                properties: {
                  kalori: { type: Type.NUMBER },
                  karbo: { type: Type.NUMBER },
                  lemak: { type: Type.NUMBER },
                  protein: { type: Type.NUMBER }
                }
              }
            }
          }
        }
      }
    });

    const response = await Promise.race([apiPromise, timeoutPromise]);
    
    console.log("✅ Gemini API call successful");
    
    const responseText = response.text;
    if (!responseText) {
      throw new Error("Gemini mengembalikan response kosong");
    }

    const detectedFoods = parseGeminiNutritionResponse(responseText);
    console.log("🍽️ Detected foods with nutrition:", detectedFoods);

    return {
      detectedFoods,
      rawResponse: response
    };

  } catch (error) {
    console.error("❌ Error in Gemini food detection:", error);
    throw error;
  }
};

// TAMBAHKAN INI - export foodDetection
export const foodDetection = detectFoodWithGemini;