import { useCircleDays } from '../hooks/useCircleDays';
import { CircleDaysHeader } from '../components/CircleDays/CircleDaysHeader';
import { CircleDay } from '../components/CircleDays/CircleDay';
import type { CircleDaysProps } from '../types';

export default function CircleDays({ onDateChange, selectedDate }: CircleDaysProps) {
  const { days } = useCircleDays(selectedDate);

  const handleToday = () => {
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    onDateChange(today);
  };

  const handleDayClick = (date: Date) => {
    onDateChange(date);
  };

  const selectedDay = days.find(day => day.isSelected);

  return (
    <div className="bg-white pt-20 pb-4 px-4 border-b border-gray-200">
      <CircleDaysHeader 
        selectedDate={selectedDay?.date || selectedDate} 
        onTodayClick={handleToday} 
      />

      <div className="flex justify-between items-center">
        {days.map((day) => (
          <CircleDay
            key={`${day.fullLabel}-${day.dayNumber}`}
            day={day}
            onClick={handleDayClick}
          />
        ))}
      </div>
    </div>
  );
}