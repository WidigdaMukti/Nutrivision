import { ChevronRight } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { MacroRow } from './MacroRow';

interface FoodGroupProps {
  kategori: any;
  urutan: string;
  group: any;
  formatFoodNames: (items: any[]) => string;
}

export const FoodGroup = ({ kategori, urutan, group, formatFoodNames }: FoodGroupProps) => {
  const navigate = useNavigate();

  const handleClick = () => {
    if (group.items.length > 0) {
      navigate(`/detail-makanan/${group.items[0].id}`);
    }
  };

  return (
    <div
      className="px-4 py-3 border-b last:border-b-0 border-gray-200 cursor-pointer hover:bg-gray-100 transition-colors"
      onClick={handleClick}
    >
      <div className="flex justify-between items-center mb-2">
        <div className="font-medium text-gray-900">
          {kategori.nama} {urutan}
        </div>
        <div className="flex items-center gap-3 text-gray-900 font-semibold">
          {group.totalNutrisi.kalori || 0} kkal
          <ChevronRight className="w-5 h-5 text-gray-400" />
        </div>
      </div>

      <div className="text-sm text-gray-500 mb-2">
        {formatFoodNames(group.items)}
      </div>

      <MacroRow nutrisi={group.totalNutrisi} />
    </div>
  );
};