export interface FoodNutrition {
  kalori: number;
  karbo: number;
  lemak: number;
  protein: number;
}

export interface FoodItem {
  name: string;
  jumlah: string;
  satuan: string;
  nutrition?: FoodNutrition;
}

export interface FoodErrors {
  [key: number]: {
    name?: boolean;
    jumlah?: boolean;
  };
}

export interface LocationState {
  detectedFoods?: FoodDetectionWithNutrition[];
  selectedDate?: Date;
  kategoriId?: number;
}

// Interface untuk food detection dari Gemini
export interface FoodDetectionWithNutrition {
  name: string;
  nutrition: FoodNutrition;
}