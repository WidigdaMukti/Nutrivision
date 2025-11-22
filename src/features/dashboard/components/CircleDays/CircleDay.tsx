import { Check } from 'lucide-react';
import type { DayData } from '../../types';

interface CircleDayProps {
  day: DayData;
  onClick: (date: Date) => void;
}

export const CircleDay = ({ day, onClick }: CircleDayProps) => {
  const getCircleStyle = (status: DayData['status'], isSelected: boolean): string => {
    let base = 'w-10 h-10 flex items-center justify-center rounded-full transition-all duration-200';

    switch (status) {
      case 'done':
        base += ' bg-teal-500 text-white';
        break;
      case 'today':
        base += ' bg-white border border-gray-300';
        break;
      case 'missed':
        base += ' bg-gray-100 text-gray-400';
        break;
      default:
        base += ' border border-gray-300 bg-white';
        break;
    }

    if (isSelected) {
      base += ' ring-2 ring-teal-400 border-teal-400';
    }

    return base;
  };

  const isToday = day.status === 'today';

  return (
    <div className="flex flex-col items-center">
      <button
        onClick={() => onClick(day.date)}
        aria-pressed={day.isSelected}
        className={getCircleStyle(day.status, day.isSelected)}
      >
        {day.status === 'done' ? (
          <Check className="w-5 h-5" />
        ) : (
          <span className={`text-sm font-medium ${
            isToday ? 'text-teal-500' : ''
          }`}>
            {day.dayNumber}
          </span>
        )}
      </button>

      <span
        className={`mt-2 text-xs font-medium ${
          isToday ? 'text-teal-500 font-semibold' : 'text-gray-500'
        }`}
      >
        {day.label}
      </span>
    </div>
  );
};