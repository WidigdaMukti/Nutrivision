export const fileToBase64 = (file: File): Promise<string> => {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.readAsDataURL(file);
    reader.onload = () => {
      const base64 = reader.result as string;
      const base64Data = base64.split(',')[1];
      resolve(base64Data);
    };
    reader.onerror = error => reject(error);
  });
};

export const parseGeminiNutritionResponse = (text: string) => {
  if (!text) {
    throw new Error("Tidak ada response dari Gemini");
  }

  console.log("📝 Raw Gemini response:", text);

  try {
    const parsed = JSON.parse(text.trim());
    
    if (Array.isArray(parsed)) {
      const foods = parsed
        .filter((item: any) => 
          item.name && 
          typeof item.name === 'string' && 
          item.name.trim().length > 0 &&
          item.nutrition &&
          typeof item.nutrition === 'object'
        )
        .map((item: any) => ({
          name: item.name.trim(),
          nutrition: {
            kalori: Math.max(0, item.nutrition.kalori || 0),
            karbo: Math.max(0, item.nutrition.karbo || 0),
            lemak: Math.max(0, item.nutrition.lemak || 0),
            protein: Math.max(0, item.nutrition.protein || 0)
          }
        }))
        .slice(0, 5);

      if (foods.length === 0) {
        throw new Error("Tidak ada makanan yang terdeteksi dalam gambar");
      }

      return foods;
    }
    
    throw new Error("Format response tidak valid");
  } catch (error) {
    console.error("❌ Error parsing nutrition response:", error);
    throw new Error("Gagal memproses response dari Gemini");
  }
};