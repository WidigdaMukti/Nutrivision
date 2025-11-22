import { GoogleGenAI, Type } from "@google/genai";
// Menggunakan instance Supabase Singleton Anda
import { supabase } from '@/lib/supabase';

const ai = new GoogleGenAI({
  apiKey: import.meta.env.VITE_GEMINI_API_KEY
});

// Interface untuk data input
export interface SuggestionRequest {
  tujuan: string;
  // Menggunakan sisaKalori untuk menampung TARGET KALORI HARIAN
  sisaKalori: number; 
  makananHariIni?: any;
  selectedDate: string;
}

// Interface untuk hasil JSON yang disederhanakan
export interface MenuSuggestionResult {
  sarapan: string;
  makan_siang: string;
  makan_malam: string;
  camilan: string;
  tips: string;
}

// =======================================================================
// === FUNGSI UTAMA: INTERAKSI GEMINI (Mengembalikan JSON string MURNI) ===
// =======================================================================

/**
 * Meminta saran menu dari Gemini AI. Mengembalikan JSON string MURNI.
 */
export const getMenuSuggestion = async (request: SuggestionRequest): Promise<string> => {
  try {
    console.log("🔄 Getting AI menu suggestion...");

    const apiKey = import.meta.env.VITE_GEMINI_API_KEY;
    if (!apiKey) {
      throw new Error("API key Gemini tidak ditemukan");
    }

    // PROMPT DIsederhanakan: Fokus pada menu dan menghilangkan output yang tidak perlu
    const prompt = `Anda adalah ahli gizi yang membuat rencana menu harian seimbang yang fokus pada makanan Indonesia. 
    Buat saran menu untuk mencapai **Tujuan: ${request.tujuan}** (dengan Target Kalori Harian ≈ ${request.sisaKalori} kkal).
    Menu harian sebelumnya (untuk referensi): ${JSON.stringify(request.makananHariIni || {}, null, 2)}.
    Buat saran menu (sarapan, makan siang, makan malam, camilan) dalam format JSON. 
    Pastikan total kalori berada dalam batasan target harian.
    Kembalikan HANYA objek JSON dengan field: sarapan, makan_siang, makan_malam, camilan, tips. Jangan sertakan total_kalori_perkiraan atau tujuan sebagai field JSON.`;

    console.log("📤 Sending optimized suggestion request to Gemini...");
    
    const timeoutPromise = new Promise<never>((_, reject) => 
      setTimeout(() => reject(new Error("Timeout: Gemini tidak merespons")), 20000)
    );

    const apiPromise = ai.models.generateContent({
      model: "gemini-2.5-flash",
      contents: [{ text: prompt }],
      config: {
        maxOutputTokens: 2048, 
        temperature: 0.3, 
        responseMimeType: "application/json", 
        // JSON Schema disederhanakan
        responseSchema: {
            type: Type.OBJECT,
            properties: {
                sarapan: { 
                    type: Type.STRING, 
                    description: "2 pilihan singkat menu Sarapan Indonesia dan estimasi kalorinya, contoh: Bubur ayam / Omelet sayur ≈350 kcal" 
                },
                makan_siang: { 
                    type: Type.STRING, 
                    description: "2 pilihan singkat menu Makan Siang Indonesia dan estimasi kalorinya, contoh: Ayam bakar + nasi merah / Ikan pepes + lalapan ≈450 kcal" 
                },
                makan_malam: { 
                    type: Type.STRING, 
                    description: "2 pilihan singkat menu Makan Malam Indonesia dan estimasi kalorinya, contoh: Sup ikan kakap / Tumis tempe tahu ≈350 kcal" 
                },
                camilan: { 
                    type: Type.STRING, 
                    description: "2 pilihan singkat camilan Indonesia dan estimasi kalorinya, contoh: Buah potong / Tahu rebus ≈150 kcal" 
                },
                tips: { 
                    type: Type.STRING, 
                    description: "1 tips praktis dan relevan dengan tujuan kalori. Contoh: Pastikan minum air putih minimal 8 gelas sehari." 
                },
            }
        }
      }
    });

    const response = await Promise.race([apiPromise, timeoutPromise]);
    
    console.log("✅ Gemini suggestion call successful");
    
    const responseText = response.text;
    
    if (!responseText || !responseText.trim().startsWith('{')) {
        const finishReason = response.candidates?.[0]?.finishReason || 'UNKNOWN_REASON';
        console.error(`❌ Response structure details: ${JSON.stringify(response, null, 2)}. Finish Reason: ${finishReason}`);
        throw new Error(`Gemini mengembalikan response kosong atau tidak valid (Finish Reason: ${finishReason}).`);
    }

    return responseText;

  } catch (error) {
    console.error("❌ Error in Gemini menu suggestion:", error);
    throw error;
  }
};

// =======================================================================
// === FUNGSI UTILITAS SUPABASE & FORMATTING ===
// =======================================================================

/**
 * Mengubah object JSON mentah menjadi string format yang mudah dibaca oleh komponen React.
 */
export const formatJsonToDisplayString = (jsonString: string): string => {
  try {
    const data: MenuSuggestionResult = JSON.parse(jsonString);
    
    // Format yang disederhanakan: Hanya menu dan tips
    return `SARAN:\n` +
           `• Sarapan: ${data.sarapan}\n` +
           `• Makan Siang: ${data.makan_siang}\n` +
           `• Makan Malam: ${data.makan_malam}\n` +
           `• Camilan: ${data.camilan}\n\n` +
           `Tips: ${data.tips}`; // Tips di baris terakhir untuk styling khusus di React

  } catch (e) {
    console.error("Gagal mengurai/memformat respons JSON:", e);
    return jsonString; 
  }
};

/**
 * Mendapatkan saran menu yang PALING TERBARU (terakhir dibuat) dari database.
 */
export const getSavedMenuSuggestion = async (userId: string): Promise<string | null> => {
    try {
        console.log(`🔍 Checking database for LATEST menu suggestion for user ${userId}...`);
        
        const { data } = await supabase 
            .from('saran_makan')
            .select('saran_json')
            .eq('user_id', userId) 
            .order('created_at', { ascending: false }) 
            .limit(1); 

        if (data && data.length > 0 && data[0].saran_json) {
            console.log('✅ Found latest saved suggestion from database.');
            return JSON.stringify(data[0].saran_json); 
        }

        return null; 
        
    } catch (error) {
        console.error('Error fetching latest menu from Supabase:', error);
        return null;
    }
};

/**
 * Menyimpan atau memperbarui saran menu ke database menggunakan UPSERT.
 */
export const saveOrUpdateMenuSuggestion = async (
  userId: string,
  dateString: string,
  saranJsonString: string
): Promise<void> => {
    try {
        console.log('🔄 Saving/Updating new suggestion to database...');
        
        const saranJson = JSON.parse(saranJsonString);
        
        const { error } = await supabase 
            .from('saran_makan')
            .upsert({
                user_id: userId,
                tanggal: dateString, 
                saran_json: saranJson,
            }, { onConflict: 'user_id, tanggal' }); 

        if (error) {
            console.error('Supabase upsert error:', error);
            throw new Error(error.message);
        }

        console.log('✅ Suggestion successfully saved/updated in database.');
        
    } catch (error) {
        console.error('Error saving menu:', error);
        throw error;
    }
};


// Fallback function (Tidak berubah)
export const getFallbackSuggestion = (tujuan: string, sisaKalori: number): string => {
  console.log("🔄 Using fallback suggestion");

  let calorieEstimate = Math.min(1600, sisaKalori);
  
  if (tujuan === 'Menurunkan berat badan') {
    calorieEstimate = Math.min(1200, sisaKalori);
  } else if (tujuan === 'Menaikkan berat badan') {
    calorieEstimate = Math.min(2000, sisaKalori);
  }

  return `SARAN UNTUK ${tujuan.toUpperCase()}:\n\n` +
    `• Sarapan: Oatmeal + buah ≈${Math.round(calorieEstimate * 0.25)} kcal\n` +
    `• Makan Siang: Nasi + sayur + protein ≈${Math.round(calorieEstimate * 0.35)} kcal\n` +
    `• Makan Malam: Ikan/ayam + tumis sayur ≈${Math.round(calorieEstimate * 0.3)} kcal\n` +
    `• Camilan: Buah/kacang ≈${Math.round(calorieEstimate * 0.1)} kcal\n\n` +
    `Tips: Konsisten dengan porsi makan\n\n` +
    `Total: ≈${calorieEstimate} kcal | Sisa: ${sisaKalori} kcal`;
};