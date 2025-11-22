import { supabase } from '@/lib/supabase';
import type { FoodItem } from './types';
import { useNutritionService } from '@/lib/nutrition-client';

export const useFoodSubmission = () => {
  const { getNutritionForManualFood } = useNutritionService();

  // ✅ TAMBAH PARAMETER editId
  const submitToBackend = async (foodData: FoodItem[], selectedDate?: Date, kategoriId?: number, editId?: string) => {
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) throw new Error('User not authenticated');

      // ✅ JIKA EDIT MODE - UPDATE EXISTING FOOD
      if (editId && foodData.length === 1) {
        return await updateExistingFood(foodData[0], editId, kategoriId);
      }

      // ✅ CREATE MODE - EXISTING LOGIC (TETAP SAMA)
      const finalSelectedDate = selectedDate || new Date();
      const finalKategoriId = kategoriId || 4;
      const startOfDay = new Date(finalSelectedDate);
      startOfDay.setHours(0, 0, 0, 0);
      const endOfDay = new Date(finalSelectedDate);
      endOfDay.setHours(23, 59, 59, 999);

      console.log("🔍 Getting urutan for:", {
        userId: user.id,
        kategoriId: finalKategoriId,
        startDate: startOfDay.toISOString(),
        endDate: endOfDay.toISOString()
      });

      let nextUrutan = 1;
      try {
        const { data: lastFood, error: urutanError } = await supabase
          .from('makan_user')
          .select('urutan')
          .eq('user_id', user.id)
          .eq('kategori_id', finalKategoriId)
          .gte('dibuat_pada', startOfDay.toISOString())
          .lte('dibuat_pada', endOfDay.toISOString())
          .order('urutan', { ascending: false })
          .limit(1);

        if (urutanError) {
          console.warn("⚠️ Error getting urutan, using default 1:", urutanError);
        } else {
          nextUrutan = (lastFood?.[0]?.urutan || 0) + 1;
        }
      } catch (error) {
        console.warn("⚠️ Exception getting urutan, using default 1:", error);
      }

      console.log(`🔄 Using urutan ${nextUrutan} for all ${foodData.length} foods`);

      const makananToInsert = [];

      for (const foodItem of foodData) {
        const { data: existingFoods } = await supabase
          .from('makanan_master')
          .select('id, nama_makanan, nutrisi')
          .ilike('nama_makanan', foodItem.name.trim())
          .limit(1);

        let nutrisiData;

        if (existingFoods && existingFoods.length > 0) {
          nutrisiData = existingFoods[0].nutrisi;
          console.log(`✅ Makanan "${foodItem.name}" sudah ada di master`);
        } else {
          let nutritionToSave;

          if (foodItem.nutrition) {
            nutritionToSave = foodItem.nutrition;
            console.log(`📸 Using existing nutrition from image detection for "${foodItem.name}"`);
          } else {
            console.log(`🔄 Getting nutrition from Gemini for manual food: "${foodItem.name}"`);
            nutritionToSave = await getNutritionForManualFood(foodItem.name);
          }

          console.log(`💾 Saving new food "${foodItem.name}" with nutrition:`, nutritionToSave);

          const { data: newFood, error } = await supabase
            .from('makanan_master')
            .insert({
              nama_makanan: foodItem.name.trim(),
              nama_makanan_indonesia: foodItem.name.trim(),
              nutrisi: nutritionToSave
            })
            .select()
            .single();

          if (error) throw error;
          nutrisiData = newFood.nutrisi;
          console.log(`✅ Makanan "${foodItem.name}" ditambahkan ke master`);
        }

        const { data: satuan } = await supabase
          .from('satuan_makan')
          .select('id, nama')
          .eq('nama', foodItem.satuan)
          .single();

        let satuanId = satuan?.id;

        let calculatedNutrisi = null;
        if (nutrisiData && foodItem.jumlah) {
          const jumlah = parseFloat(foodItem.jumlah) || 0;
          const multiplier = jumlah / 100;

          calculatedNutrisi = {
            kalori: Math.round((nutrisiData.kalori || 0) * multiplier),
            karbo: Math.round((nutrisiData.karbo || 0) * multiplier),
            lemak: Math.round((nutrisiData.lemak || 0) * multiplier),
            protein: Math.round((nutrisiData.protein || 0) * multiplier)
          };
        }

        makananToInsert.push({
          user_id: user.id,
          satuan_id: satuanId,
          jumlah: parseFloat(foodItem.jumlah) || 0,
          nama_makanan: foodItem.name.trim(),
          nutrisi: calculatedNutrisi,
          kategori_id: finalKategoriId,
          urutan: nextUrutan,
          dibuat_pada: finalSelectedDate.toISOString()
        });
      }

      const { data: userFoods, error: insertError } = await supabase
        .from('makan_user')
        .insert(makananToInsert)
        .select(`
        id,
        nama_makanan,
        jumlah,
        nutrisi,
        kategori_id,
        satuan_makan(nama)
      `);

      if (insertError) {
        console.error("❌ Error inserting foods:", insertError);
        throw insertError;
      }

      console.log(`✅ ${userFoods?.length || 0} foods successfully saved with urutan ${nextUrutan}`);
      return { success: true, data: userFoods || [] };

    } catch (error) {
      console.error('Error submitting to Supabase:', error);
      throw error;
    }
  };

  // ✅ FUNGSI BARU UNTUK UPDATE EXISTING FOOD
  const updateExistingFood = async (foodItem: FoodItem, editId: string, kategoriId?: number) => {
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) throw new Error('User not authenticated');

      const finalKategoriId = kategoriId || 4;

      // Cari atau buat data nutrisi di makanan_master
      const { data: existingFoods } = await supabase
        .from('makanan_master')
        .select('id, nama_makanan, nutrisi')
        .ilike('nama_makanan', foodItem.name.trim())
        .limit(1);

      let nutrisiData;

      if (existingFoods && existingFoods.length > 0) {
        nutrisiData = existingFoods[0].nutrisi;
        console.log(`✅ Makanan "${foodItem.name}" sudah ada di master`);
      } else {
        let nutritionToSave;

        if (foodItem.nutrition) {
          nutritionToSave = foodItem.nutrition;
          console.log(`📸 Using existing nutrition for "${foodItem.name}"`);
        } else {
          console.log(`🔄 Getting nutrition from Gemini for manual food: "${foodItem.name}"`);
          nutritionToSave = await getNutritionForManualFood(foodItem.name);
        }

        const { data: newFood, error } = await supabase
          .from('makanan_master')
          .insert({
            nama_makanan: foodItem.name.trim(),
            nama_makanan_indonesia: foodItem.name.trim(),
            nutrisi: nutritionToSave
          })
          .select()
          .single();

        if (error) throw error;
        nutrisiData = newFood.nutrisi;
        console.log(`✅ Makanan "${foodItem.name}" ditambahkan ke master`);
      }

      // Calculate nutrition berdasarkan jumlah
      let calculatedNutrisi = null;
      if (nutrisiData && foodItem.jumlah) {
        const jumlah = parseFloat(foodItem.jumlah) || 0;
        const multiplier = jumlah / 100;

        calculatedNutrisi = {
          kalori: Math.round((nutrisiData.kalori || 0) * multiplier),
          karbo: Math.round((nutrisiData.karbo || 0) * multiplier),
          lemak: Math.round((nutrisiData.lemak || 0) * multiplier),
          protein: Math.round((nutrisiData.protein || 0) * multiplier)
        };
      }

      // Get satuan_id
      const { data: satuan } = await supabase
        .from('satuan_makan')
        .select('id, nama')
        .eq('nama', foodItem.satuan)
        .single();

      let satuanId = satuan?.id;

      // UPDATE existing food
      const { data: updatedFood, error } = await supabase
        .from('makan_user')
        .update({
          nama_makanan: foodItem.name.trim(),
          jumlah: parseFloat(foodItem.jumlah) || 0,
          nutrisi: calculatedNutrisi,
          satuan_id: satuanId,
          kategori_id: finalKategoriId,
        })
        .eq('id', editId)
        .select(`
          id,
          nama_makanan,
          jumlah,
          nutrisi,
          kategori_id,
          satuan_makan(nama)
        `);

      if (error) throw error;

      console.log(`✅ Food successfully updated:`, updatedFood);
      return { success: true, data: updatedFood || [] };

    } catch (error) {
      console.error('Error updating food:', error);
      throw error;
    }
  };

  return {
    submitToBackend
  };
};