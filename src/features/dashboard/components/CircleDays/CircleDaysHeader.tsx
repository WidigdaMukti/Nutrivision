import { getTitleText } from '../../utils/dateUtils';

interface CircleDaysHeaderProps {
  selectedDate: Date;
  onTodayClick: () => void;
}

export const CircleDaysHeader = ({ selectedDate, onTodayClick }: CircleDaysHeaderProps) => {

  return (
    <div className="flex justify-between items-center mb-4">
      <h2 className="text-lg font-semibold text-gray-900">
        {getTitleText(selectedDate)}
      </h2>
      
      {selectedDate.toDateString() !== new Date().toDateString() && (
        <button 
          onClick={onTodayClick}
          className="text-teal-600 font-medium text-base hover:text-teal-700 transition-colors"
        >
          Hari Ini
        </button>
      )}
    </div>
  );
};