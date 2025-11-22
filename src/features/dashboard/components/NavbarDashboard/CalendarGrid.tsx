import { getDaysInMonth } from '../../utils/dateUtils';

interface CalendarGridProps {
  currentMonth: Date;
  tempSelectedDate: Date;
  onDateSelect: (date: Date) => void;
}

export const CalendarGrid = ({ currentMonth, tempSelectedDate, onDateSelect }: CalendarGridProps) => {
  const days = getDaysInMonth(currentMonth);

  return (
    <div className="grid grid-cols-7 gap-2 mb-4">
      {['Minggu', 'Senin', 'Selasa', 'Rabu', 'Kamis', 'Jumat', 'Sabtu'].map((day) => (
        <div key={`header-${day}`} className="text-center text-sm text-gray-500 font-medium py-2">
          {day.charAt(0)}
        </div>
      ))}

      {days.map((date, index) => {
        if (!date) {
          return (
            <div
              key={`empty-${index}`}
              className="w-10 h-10"
            />
          );
        }

        const isSelected = date.toDateString() === tempSelectedDate.toDateString();
        const isToday = date.toDateString() === new Date().toDateString();

        return (
          <button
            key={`${date.getFullYear()}-${date.getMonth()}-${date.getDate()}`}
            onClick={() => onDateSelect(date)}
            className={`w-10 h-10 rounded-full flex items-center justify-center text-sm font-medium transition-colors ${
              isSelected
                ? 'bg-teal-500 text-white'
                : isToday
                  ? 'bg-teal-100 text-teal-700 border border-teal-300'
                  : 'text-gray-700 hover:bg-gray-100'
            }`}
          >
            {date.getDate()}
          </button>
        );
      })}
    </div>
  );
};