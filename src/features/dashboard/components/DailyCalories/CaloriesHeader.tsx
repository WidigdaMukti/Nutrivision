import { getTujuanBadgeColor } from '../../utils/nutritionUtils';

interface CaloriesHeaderProps {
  tujuan: string;
}

export const CaloriesHeader = ({ tujuan }: CaloriesHeaderProps) => (
  <div className="flex justify-between items-center mb-4">
    <h2 className="text-lg font-semibold text-gray-900">Kalori Harian</h2>
    <span className={`text-xs px-3 py-1 rounded-full font-medium ${getTujuanBadgeColor(tujuan)}`}>
      {tujuan}
    </span>
  </div>
);