import { supabase } from '@/lib/supabase';

// ✅ FUNCTION UTAMA - PANGGIL EDGE FUNCTION
export const getMenuSuggestion = async (request: any): Promise<string> => {
  try {
    console.log("🔄 [CLIENT] Getting menu suggestion via Supabase...");

    const response = await fetch('https://hdpwhvxkgzewnepfnicc.supabase.co/functions/v1/gemini-suggestion', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(request)
    });

    const result = await response.json();

    if (!response.ok || !result.success) {
      throw new Error(result.error || 'Gagal mendapatkan saran menu');
    }

    return JSON.stringify(result.data);

  } catch (error) {
    console.error("❌ Error getting menu suggestion:", error);
    throw error;
  }
};

// ✅ FUNCTION FORMATTING
export const formatJsonToDisplayString = (jsonString: string): string => {
  try {
    const data = JSON.parse(jsonString);
    return `SARAN:\n` +
           `• Sarapan: ${data.sarapan}\n` +
           `• Makan Siang: ${data.makan_siang}\n` +
           `• Makan Malam: ${data.makan_malam}\n` +
           `• Camilan: ${data.camilan}\n\n` +
           `Tips: ${data.tips}`;
  } catch (e) {
    console.error("Gagal mengurai/memformat respons JSON:", e);
    return jsonString; 
  }
};

// ✅ FUNCTION DATABASE - GET SAVED SUGGESTION
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

// ✅ FUNCTION DATABASE - SAVE/UPDATE SUGGESTION
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