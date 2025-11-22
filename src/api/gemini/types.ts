export interface FoodNutrition {
  kalori: number;
  karbo: number;
  lemak: number;
  protein: number;
}

export interface FoodDetectionWithNutrition {
  name: string;
  nutrition: FoodNutrition;
}

export interface GeminiDetectionResult {
  detectedFoods: FoodDetectionWithNutrition[];
  rawResponse?: any;
}