import CircleDays from './components/CircleDays';
import NavbarDashboard from './components/NavbarDashboard';
import DailyCalories from './components/DailyCalories';
import MealSection from './components/MealSection';
import { useDashboard } from './hooks/useDashboard';

export default function Dashboard() {
  const {
    selectedDate,
    userData,
    dailySummary,
    handleDateChange
  } = useDashboard();

  return (
    <div>
      <NavbarDashboard
        onDateSelect={handleDateChange}
        selectedDate={selectedDate}
      />
      <CircleDays 
        onDateChange={handleDateChange} 
        selectedDate={selectedDate} 
      />
      <DailyCalories
        userData={userData}
        dailySummary={dailySummary}
        selectedDate={selectedDate}
      />
      <MealSection selectedDate={selectedDate} />
    </div>
  );
}