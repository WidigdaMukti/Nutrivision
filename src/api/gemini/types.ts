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
}

export interface SuggestionRequest {
  tujuan: string;
  sisaKalori: number; 
  makananHariIni?: any;
  selectedDate: string;
}

export interface MenuSuggestionResult {
  sarapan: string;
  makan_siang: string;
  makan_malam: string;
  camilan: string;
  tips: string;
}