import { useState, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { supabase } from "@/lib/supabase";
import type { FoodGroup } from '../components/types';

export const useFoodDetail = () => {
  const navigate = useNavigate();
  const { id } = useParams();
  const [foodGroup, setFoodGroup] = useState<FoodGroup | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [showDeleteModal, setShowDeleteModal] = useState(false);

  const loadFoodGroup = async () => {
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) throw new Error("User not authenticated");

      const { data: clickedFood, error } = await supabase
        .from('makan_user')
        .select(`
          id,
          nama_makanan,
          jumlah,
          nutrisi,
          dibuat_pada,
          urutan,
          kategori_id,
          user_id,
          satuan_makan(nama)
        `)
        .eq('id', id)
        .eq('user_id', user.id)
        .single();

      if (error) throw error;

      const foodDate = new Date(clickedFood.dibuat_pada);
      const startOfDay = new Date(foodDate);
      startOfDay.setHours(0, 0, 0, 0);
      const endOfDay = new Date(foodDate);
      endOfDay.setHours(23, 59, 59, 999);

      const { data: allFoodsInGroup, error: groupError } = await supabase
        .from('makan_user')
        .select(`
          id,
          nama_makanan,
          jumlah,
          nutrisi,
          dibuat_pada,
          urutan,
          kategori_id,
          user_id,
          satuan_makan(nama)
        `)
        .eq('urutan', clickedFood.urutan)
        .eq('kategori_id', clickedFood.kategori_id)
        .eq('user_id', user.id)
        .gte('dibuat_pada', startOfDay.toISOString())
        .lte('dibuat_pada', endOfDay.toISOString())
        .order('id');

      if (groupError) throw groupError;

      const totalNutrisi = {
        kalori: 0,
        karbo: 0,
        lemak: 0,
        protein: 0
      };

      allFoodsInGroup?.forEach(food => {
        const nutrisi = food.nutrisi || {};
        totalNutrisi.kalori += nutrisi.kalori || 0;
        totalNutrisi.karbo += nutrisi.karbo || 0;
        totalNutrisi.lemak += nutrisi.lemak || 0;
        totalNutrisi.protein += nutrisi.protein || 0;
      });

      setFoodGroup({
        items: allFoodsInGroup || [],
        totalNutrisi
      });

    } catch (error) {
      console.error("Error loading food group:", error);
    } finally {
      setIsLoading(false);
    }
  };

  const confirmDelete = async () => {
    try {
      if (!foodGroup) return;

      const { error } = await supabase
        .from('makan_user')
        .delete()
        .in('id', foodGroup.items.map(item => item.id));

      if (error) throw error;

      window.dispatchEvent(new CustomEvent('clearMealsCache'));

      setShowDeleteModal(false);
      navigate(-1);
    } catch (error) {
      console.error("Error deleting food group:", error);
      alert("Gagal menghapus makanan.");
    }
  };

  useEffect(() => {
    loadFoodGroup();
  }, [id]);

  return {
    foodGroup,
    isLoading,
    showDeleteModal,
    setShowDeleteModal,
    confirmDelete,
    navigate
  };
};