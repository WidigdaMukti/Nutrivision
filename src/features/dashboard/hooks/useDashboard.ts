import { useState, useEffect, useCallback } from 'react';
import { supabase } from '@/lib/supabase';
import type { UserData, DailySummary } from '../types';

export const useDashboard = () => {
  const [selectedDate, setSelectedDate] = useState(new Date());
  const [userData, setUserData] = useState<UserData | null>(null);
  const [dailySummary, setDailySummary] = useState<DailySummary | null>(null);

  const loadUserData = useCallback(async () => {
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) return;

      const { data: profile } = await supabase
        .from('profile_users')
        .select('*')
        .eq('user_id', user.id)
        .single();

      const { data: tujuan } = await supabase
        .from('tujuan')
        .select('nama')
        .eq('id', profile?.tujuan_id)
        .single();

      setUserData({
        ...profile,
        tujuan: tujuan?.nama || 'Menjaga berat badan',
        target_kalori: profile?.target_kalori_harian || 2000
      });
    } catch (error) {
      console.error('Error loading user data:', error);
    }
  }, []);

  const loadDailySummary = useCallback(async (date: Date) => {
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) return;

      const dateStr = date.toISOString().split('T')[0];
      console.log("📊 Loading daily summary untuk:", dateStr);

      const { data: makanan } = await supabase
        .from('makan_user')
        .select(`
          *,
          kategori_makan!inner(nama),
          satuan_makan(nama)
        `)
        .eq('user_id', user.id)
        .gte('dibuat_pada', `${dateStr}T00:00:00`)
        .lte('dibuat_pada', `${dateStr}T23:59:59`);

      console.log("🍽️ Makanan untuk daily summary:", makanan);

      if (makanan) {
        const summary: DailySummary = {
          totalKalori: 0,
          totalKarbo: 0,
          totalLemak: 0,
          totalProtein: 0
        };

        makanan.forEach(makanan => {
          const nutrisi = makanan.nutrisi;
          if (nutrisi) {
            summary.totalKalori += nutrisi.kalori || 0;
            summary.totalKarbo += nutrisi.karbo || 0;
            summary.totalLemak += nutrisi.lemak || 0;
            summary.totalProtein += nutrisi.protein || 0;
          }
        });

        setDailySummary(summary);
      } else {
        setDailySummary({
          totalKalori: 0,
          totalKarbo: 0,
          totalLemak: 0,
          totalProtein: 0
        });
      }
    } catch (error) {
      console.error('Error loading daily summary:', error);
      setDailySummary({
        totalKalori: 0,
        totalKarbo: 0,
        totalLemak: 0,
        totalProtein: 0
      });
    }
  }, []);

  const handleDateChange = useCallback((date: Date) => {
    const normalizedDate = new Date(date.getFullYear(), date.getMonth(), date.getDate());
    setSelectedDate(normalizedDate);
  }, []);

  useEffect(() => {
    console.log("🔄 SelectedDate berubah:", selectedDate.toISOString().split('T')[0]);
  }, [selectedDate]);

  useEffect(() => {
    loadUserData();
  }, [loadUserData]);

  useEffect(() => {
    loadDailySummary(selectedDate);
  }, [selectedDate, loadDailySummary]);

  return {
    selectedDate,
    userData,
    dailySummary,
    handleDateChange
  };
};