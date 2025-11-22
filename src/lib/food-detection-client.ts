export const foodDetection = async (imageFile: File) => {
  try {
    console.log("🔄 [CLIENT] Starting food detection via Supabase...");

    const formData = new FormData();
    formData.append('image', imageFile);

    // ✅ PANGGIL EDGE FUNCTION
    const response = await fetch('https://hdpwhvxkgzewnepfnicc.supabase.co/functions/v1/gemini-detection', {
      method: 'POST',
      body: formData
    });

    const result = await response.json();

    if (!response.ok || !result.success) {
      throw new Error(result.error || 'Gagal mendeteksi makanan');
    }

    return {
      detectedFoods: result.detectedFoods,
      rawResponse: result
    };

  } catch (error) {
    console.error("❌ Error detecting food:", error);
    throw error;
  }
};