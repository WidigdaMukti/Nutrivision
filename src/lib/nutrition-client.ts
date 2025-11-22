export const useNutritionService = () => {
  const getNutritionFromGemini = async (foodName: string) => {
    try {
      console.log(`🔄 [CLIENT] Getting nutrition for: "${foodName}"`);

      const response = await fetch('https://hdpwhvxkgzewnepfnicc.supabase.co/functions/v1/gemini-nutrition', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ foodName })
      });

      const result = await response.json();

      if (!response.ok || !result.success) {
        throw new Error(result.error || 'Gagal mendapatkan nutrisi');
      }

      console.log(`✅ [CLIENT] Nutrition data received:`, result.nutrition);
      return result.nutrition;

    } catch (error) {
      console.error(`❌ Gagal dapatkan nutrisi untuk "${foodName}":`, error);
      throw error; // ✅ LANGSUNG THROW ERROR, biar component handle
    }
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
      throw error; // ✅ LANGSUNG THROW, tidak pakai fallback
    }
  };

  return {
    getNutritionForManualFood,
    getNutritionFromGemini
  };
};