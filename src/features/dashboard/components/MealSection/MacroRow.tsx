import type { NutritionData } from '../../types';

interface MacroRowProps {
  nutrisi: NutritionData;
}

export const MacroRow = ({ nutrisi }: MacroRowProps) => (
  <div className="w-full flex items-center text-sm text-gray-900">
    <div className="flex-1 flex items-center justify-center py-1 relative">
      <span className="text-gray-600 mr-1">Karbo</span>
      <span className="font-semibold">{nutrisi?.karbo || 0} g</span>
      <div className="absolute right-0 top-1/2 -translate-y-1/2 w-px h-4 bg-gray-300" />
    </div>
    <div className="flex-1 flex items-center justify-center py-1 relative">
      <span className="text-gray-600 mr-1">Lemak</span>
      <span className="font-semibold">{nutrisi?.lemak || 0} g</span>
      <div className="absolute right-0 top-1/2 -translate-y-1/2 w-px h-4 bg-gray-300" />
    </div>
    <div className="flex-1 flex items-center justify-center py-1">
      <span className="text-gray-600 mr-1">Protein</span>
      <span className="font-semibold">{nutrisi?.protein || 0} g</span>
    </div>
  </div>
);