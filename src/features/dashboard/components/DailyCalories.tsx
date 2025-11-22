import { useDailyCalories } from '../hooks/useDailyCalories';
import { CaloriesHeader } from './DailyCalories/CaloriesHeader';
import { ProgressSection } from './DailyCalories/ProgressSection';
import { NutritionSection } from './DailyCalories/NutritionSection';
import { AISuggestion } from './DailyCalories/AISuggestion';
import type { DailyCaloriesProps } from '../types';

export default function DailyCalories({ userData, dailySummary, selectedDate }: DailyCaloriesProps) {
  const {
    userTarget,
    nutrisi,
    progress,
    konsumsiKalori
  } = useDailyCalories(userData, dailySummary);

  return (
    <div className="px-4 py-6">
      <CaloriesHeader tujuan={userTarget.tujuan} />
      
      <ProgressSection 
        progress={progress}
        konsumsiKalori={konsumsiKalori}
        targetKalori={userTarget.targetKalori}
      />

      <AISuggestion 
        userData={userData}
        dailySummary={dailySummary}
        selectedDate={selectedDate}
      />

      <NutritionSection nutrisi={nutrisi} />
    </div>
  );
}