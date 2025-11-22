import { useState, useEffect } from 'react';
import type { UserTarget, NutritionData } from '../types';

export const useDailyCalories = (userData: any, dailySummary: any) => {
  const [userTarget, setUserTarget] = useState<UserTarget>({
    targetKalori: 2000,
    tujuan: 'Menjaga berat badan'
  });

  useEffect(() => {
    if (userData) {
      setUserTarget({
        targetKalori: userData.target_kalori_harian || 2000,
        tujuan: userData.tujuan || 'Menjaga berat badan'
      });
    }
  }, [userData]);

  const konsumsiKalori = dailySummary?.totalKalori || 0;
  const progress = Math.min((konsumsiKalori / userTarget.targetKalori) * 100, 100);

  const nutrisi: NutritionData = {
    karbo: dailySummary?.totalKarbo || 0,
    lemak: dailySummary?.totalLemak || 0,
    protein: dailySummary?.totalProtein || 0,
    kalori: konsumsiKalori,
  };

  return {
    userTarget,
    nutrisi,
    progress,
    konsumsiKalori
  };
};