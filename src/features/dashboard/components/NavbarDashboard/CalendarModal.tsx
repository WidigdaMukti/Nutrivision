import { CalendarHeader } from './CalendarHeader';
import { CalendarNavigation } from './CalendarNavigation';
import { CalendarGrid } from './CalendarGrid';

interface CalendarModalProps {
  calendarState: {
    tempSelectedDate: Date;
    currentMonth: Date;
  };
  onCancel: () => void;
  onToday: () => void;
  onDateSelect: (date: Date) => void;
  onConfirm: () => void;
  onPreviousMonth: () => void;
  onNextMonth: () => void;
}

export const CalendarModal = ({
  calendarState,
  onCancel,
  onToday,
  onDateSelect,
  onConfirm,
  onPreviousMonth,
  onNextMonth
}: CalendarModalProps) => (
  <div className="fixed inset-0 z-50 bg-black/50 flex items-end justify-center">
    <div className="bg-white rounded-t-2xl w-full max-w-md mx-auto max-h-[80vh] overflow-hidden">
      <CalendarHeader onCancel={onCancel} onToday={onToday} />
      
      <div className="p-4">
        <CalendarNavigation
          tempSelectedDate={calendarState.tempSelectedDate}
          onPreviousMonth={onPreviousMonth}
          onNextMonth={onNextMonth}
        />

        <CalendarGrid
          currentMonth={calendarState.currentMonth}
          tempSelectedDate={calendarState.tempSelectedDate}
          onDateSelect={onDateSelect}
        />

        <button
          onClick={onConfirm}
          className="w-full bg-teal-500 text-white py-3 rounded-xl font-semibold hover:bg-teal-600 transition-colors"
        >
          Pilih Tanggal
        </button>
      </div>
    </div>
  </div>
);