import { GoogleGenAI, Type } from "@google/genai";

const ai = new GoogleGenAI({
  apiKey: import.meta.env.VITE_GEMINI_API_KEY
});

export const useNutritionService = () => {
  const getNutritionFromGemini = async (foodName: string) => {
    try {
      const prompt = `Provide nutrition facts for "${foodName}" in JSON format:
        {
            "kalori": number,
            "karbo": number, 
            "lemak": number,
            "protein": number
        }
        Return ONLY JSON. Values are per 100 grams.`;

      const response = await ai.models.generateContent({
        model: "gemini-2.5-flash",
        contents: [{ text: prompt }],
        config: {
          responseMimeType: "application/json",
          responseSchema: {
            type: Type.OBJECT,
            properties: {
              kalori: { type: Type.NUMBER },
              karbo: { type: Type.NUMBER },
              lemak: { type: Type.NUMBER },
              protein: { type: Type.NUMBER }
            }
          }
        }
      });

      const responseText = response.text;
      if (!responseText) {
        console.error(`❌ Gemini returned empty response for "${foodName}"`);
        throw new Error("Empty response from Gemini");
      }

      console.log(`📝 Gemini nutrition response for "${foodName}":`, responseText);

      const nutritionData = JSON.parse(responseText);

      return {
        kalori: nutritionData.kalori || 0,
        karbo: nutritionData.karbo || 0,
        lemak: nutritionData.lemak || 0,
        protein: nutritionData.protein || 0
      };

    } catch (error) {
      console.error(`❌ Gagal dapatkan nutrisi untuk "${foodName}" dari Gemini:`, error);
      return getFallbackNutrition(foodName);
    }
  };

  const getFallbackNutrition = (foodName: string) => {
    const commonFoods: { [key: string]: any } = {
      "nasi putih": { kalori: 130, karbo: 28, lemak: 0.3, protein: 2.7 },
      "nasi goreng": { kalori: 200, karbo: 30, lemak: 7, protein: 6 },
      "ayam goreng": { kalori: 250, karbo: 10, lemak: 15, protein: 20 },
      "tempe goreng": { kalori: 150, karbo: 8, lemak: 7, protein: 12 },
      "tahu goreng": { kalori: 120, karbo: 3, lemak: 7, protein: 10 },
      "sayur bayam": { kalori: 23, karbo: 3.6, lemak: 0.4, protein: 2.9 },
      "burger": { kalori: 295, karbo: 30, lemak: 12, protein: 15 },
      "pizza": { kalori: 266, karbo: 33, lemak: 10, protein: 11 },
      "french fries": { kalori: 312, karbo: 41, lemak: 15, protein: 3.4 },
      "sushi": { kalori: 150, karbo: 28, lemak: 2, protein: 6 },
      "ramen": { kalori: 200, karbo: 30, lemak: 7, protein: 10 },
      "default": { kalori: 0, karbo: 0, lemak: 0, protein: 0 }
    };

    const lowerFoodName = foodName.toLowerCase();
    for (const [key, nutrition] of Object.entries(commonFoods)) {
      if (lowerFoodName.includes(key.toLowerCase())) {
        return nutrition;
      }
    }

    return commonFoods.default;
  };

  const getNutritionForManualFood = async (foodName: string) => {
    if (!foodName.trim()) {
      return {
        kalori: 0,
        karbo: 0,
        lemak: 0,
        protein: 0
      };
    }

    try {
      console.log(`🔄 Getting nutrition for manual food: "${foodName}"`);
      return await getNutritionFromGemini(foodName);
    } catch (error) {
      console.error(`❌ Failed to get nutrition for "${foodName}":`, error);
      return getFallbackNutrition(foodName);
    }
  };

  return {
    getNutritionForManualFood,
    getNutritionFromGemini,
    getFallbackNutrition
  };
};