import { useState, useEffect } from 'react';
import { useNavigate, useLocation  } from 'react-router-dom';
import { supabase } from '@/lib/supabase';
import { foodDetection } from '@/api/gemini';
import { toast } from 'sonner';
import type { MealSectionProps, MakananByKategori, KategoriMakanan } from '../types';
import { dashboardCache } from '.././cache'; // ✅ IMPORT CACHE

export const useMealSection = ({ selectedDate }: MealSectionProps) => {
  const navigate = useNavigate();
  const location = useLocation();
  const [openSections, setOpenSections] = useState<{ [key: number]: boolean }>({
    1: true, 2: true, 3: true, 4: true
  });
  const [kategoriMakanan, setKategoriMakanan] = useState<KategoriMakanan[]>([]);
  const [makananByKategori, setMakananByKategori] = useState<MakananByKategori>({});
  const [isLoading, setIsLoading] = useState(true);
  const [isProcessingImage, setIsProcessingImage] = useState(false);
  const [selectedKategoriId, setSelectedKategoriId] = useState<number>(4);

useEffect(() => {
    if (location.state?.refreshMeals) {
      console.log("🔄 Refresh triggered from AddFood");
      clearMakananCache();
      
      // Clear state
      navigate(location.pathname, { replace: true, state: {} });
    }
  }, [location.state]);

  const loadKategoriMakanan = async () => {
    try {
      // ✅ CEK CACHE UNTUK KATEGORI (data jarang berubah)
      const cacheKey = 'kategori-makanan';
      const cached = dashboardCache.get(cacheKey);
      
      if (cached) {
        console.log("✅ Using cached kategori makanan");
        setKategoriMakanan(cached);
        return;
      }

      const { data, error } = await supabase
        .from('kategori_makan')
        .select('*')
        .order('id');

      if (error) throw error;
      
      const kategoriData = data || [];
      setKategoriMakanan(kategoriData);
      
      // ✅ SIMPAN KE CACHE
      dashboardCache.set(cacheKey, kategoriData);
    } catch (error) {
      console.error("Error loading kategori:", error);
    }
  };

  const loadMakananHariIni = async () => {
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) return;

      const startDate = new Date(selectedDate);
      startDate.setHours(0, 0, 0, 0);
      const startDateUTC = startDate.toISOString();

      const endDate = new Date(selectedDate);
      endDate.setHours(23, 59, 59, 999);
      const endDateUTC = endDate.toISOString();

      console.log("📅 Loading makanan untuk tanggal:", selectedDate.toDateString());

      // ✅ CEK CACHE UNTUK MAKANAN HARI INI
      const dateKey = selectedDate.toISOString().split('T')[0];
      const cacheKey = `makanan-${user.id}-${dateKey}`;
      const cached = dashboardCache.get(cacheKey);
      
      if (cached) {
        console.log("✅ Using cached makanan data");
        setMakananByKategori(cached);
        return;
      }

      const { data: makanan, error } = await supabase
        .from('makan_user')
        .select(`
          id,
          nama_makanan,
          jumlah,
          nutrisi,
          kategori_id,
          urutan,
          dibuat_pada,
          satuan_makan(nama),
          kategori_makan!inner(nama)
        `)
        .eq('user_id', user.id)
        .gte('dibuat_pada', startDateUTC)
        .lte('dibuat_pada', endDateUTC)
        .order('urutan')
        .order('dibuat_pada')
        .order('id');

      if (error) throw error;

      console.log("🍽️ Makanan yang ditemukan:", makanan);

      const groupedByKategori: MakananByKategori = { 1: {}, 2: {}, 3: {}, 4: {} };

      if (makanan) {
        makanan.forEach(item => {
          const kategoriId = item.kategori_id;
          const urutan = item.urutan || 1;

          if (!groupedByKategori[kategoriId]) {
            groupedByKategori[kategoriId] = {};
          }

          if (!groupedByKategori[kategoriId][urutan]) {
            groupedByKategori[kategoriId][urutan] = {
              items: [],
              totalNutrisi: { karbo: 0, lemak: 0, protein: 0, kalori: 0 }
            };
          }

          groupedByKategori[kategoriId][urutan].items.push(item);

          const nutrisi = item.nutrisi || {};
          groupedByKategori[kategoriId][urutan].totalNutrisi.karbo += nutrisi.karbo || 0;
          groupedByKategori[kategoriId][urutan].totalNutrisi.lemak += nutrisi.lemak || 0;
          groupedByKategori[kategoriId][urutan].totalNutrisi.protein += nutrisi.protein || 0;
          groupedByKategori[kategoriId][urutan].totalNutrisi.kalori += nutrisi.kalori || 0;
        });
      }

      setMakananByKategori(groupedByKategori);
      
      // ✅ SIMPAN KE CACHE
      dashboardCache.set(cacheKey, groupedByKategori);
    } catch (error) {
      console.error("Error loading makanan:", error);
    }
  };

  const loadData = async () => {
    setIsLoading(true);
    await Promise.all([loadKategoriMakanan(), loadMakananHariIni()]);
    setIsLoading(false);
  };

  const processImageWithGemini = async (file: File, kategoriId: number) => {
    setIsProcessingImage(true);

    try {
      console.log("🔄 Processing image with Gemini...");
      const result = await foodDetection(file);

      if (result.detectedFoods.length === 0) {
        toast.error("Tidak ada makanan terdeteksi");
        return;
      }

      console.log("✅ Gemini detection result:", result.detectedFoods);

      navigate("/tambah-makanan", {
        state: {
          detectedFoods: result.detectedFoods,
          selectedDate: selectedDate,
          kategoriId: kategoriId
        }
      });

    } catch (error) {
      console.error("❌ Error in food detection:", error);
      toast.error("Tidak dapat mendeteksi gambar, coba beberapa saat lagi!");
    } finally {
      setIsProcessingImage(false);
    }
  };

  // ✅ FUNCTION UNTUK CLEAR CACHE SETELAH TAMBAH/EDIT/HApus MAKANAN
  const clearMakananCache = async () => {
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) return;

    const dateKey = selectedDate.toISOString().split('T')[0];
    const cacheKey = `makanan-${user.id}-${dateKey}`;
    
    dashboardCache.clear(cacheKey);
    console.log("🗑️ Cleared makanan cache");
    
    // Reload data
    await loadMakananHariIni();
  };

  const toggleSection = (kategoriId: number) => {
    setOpenSections(prev => ({
      ...prev,
      [kategoriId]: !prev[kategoriId]
    }));
  };

  const calculateCategoryTotal = (kategoriId: number) => {
    const groups = makananByKategori[kategoriId] || {};
    const total = { karbo: 0, lemak: 0, protein: 0, kalori: 0 };

    Object.values(groups).forEach(group => {
      total.karbo += group.totalNutrisi.karbo;
      total.lemak += group.totalNutrisi.lemak;
      total.protein += group.totalNutrisi.protein;
      total.kalori += group.totalNutrisi.kalori;
    });

    return total;
  };

  const formatFoodNames = (items: any[]) => {
    return items.map(item => item.nama_makanan).join(', ');
  };

  useEffect(() => {
    loadData();
  }, [selectedDate]);

  return {
    openSections,
    kategoriMakanan,
    makananByKategori,
    isLoading,
    isProcessingImage,
    selectedKategoriId,
    setSelectedKategoriId,
    processImageWithGemini,
    toggleSection,
    calculateCategoryTotal,
    formatFoodNames,
    loadMakananHariIni,
    clearMakananCache // ✅ EXPORT FUNCTION INI
  };
};