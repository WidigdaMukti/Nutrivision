import { X } from 'lucide-react';

interface CalendarHeaderProps {
  onCancel: () => void;
  onToday: () => void;
}

export const CalendarHeader = ({ onCancel, onToday }: CalendarHeaderProps) => (
  <div className="flex items-center justify-between p-4 border-b border-gray-200">
    <button onClick={onCancel} className="p-2">
      <X className="w-6 h-6" />
    </button>
    <h3 className="text-lg font-semibold text-gray-900">Pilih Tanggal</h3>
    <button
      onClick={onToday}
      className="text-teal-600 font-medium text-base"
    >
      Hari Ini
    </button>
  </div>
);