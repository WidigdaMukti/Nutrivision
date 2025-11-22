import { ChevronLeft, ChevronRight } from 'lucide-react';
import { formatDate } from '../../utils/dateUtils';

interface CalendarNavigationProps {
  tempSelectedDate: Date;
  onPreviousMonth: () => void;
  onNextMonth: () => void;
}

export const CalendarNavigation = ({ 
  tempSelectedDate, 
  onPreviousMonth, 
  onNextMonth 
}: CalendarNavigationProps) => (
  <div className="flex items-center justify-between mb-4">
    <p className="text-lg font-semibold text-gray-900">
      {formatDate(tempSelectedDate)}
    </p>

    <div className="flex items-center gap-2 py-3">
      <button
        onClick={onPreviousMonth}
        className="p-1 rounded-full hover:bg-gray-100 transition-colors"
      >
        <ChevronLeft className="w-6 h-6 text-gray-600" />
      </button>

      <button
        onClick={onNextMonth}
        className="p-1 rounded-full hover:bg-gray-100 transition-colors"
      >
        <ChevronRight className="w-6 h-6 text-gray-600" />
      </button>
    </div>
  </div>
);