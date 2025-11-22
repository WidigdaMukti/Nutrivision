import type { NutritionData } from '../../types';

interface NutritionSectionProps {
  nutrisi: NutritionData;
}

export const NutritionSection = ({ nutrisi }: NutritionSectionProps) => (
  <div className="-mx-4">
    <div className="flex items-center gap-3 overflow-x-auto px-4 py-2 border-y border-gray-200">
      <NutritionItem label="Karbo" value={nutrisi.karbo} unit="g" />
      <NutritionItem label="Lemak" value={nutrisi.lemak} unit="g" />
      <NutritionItem label="Protein" value={nutrisi.protein} unit="g" />
      <NutritionItem label="Kalori" value={nutrisi.kalori} unit="" />
    </div>
  </div>
);

interface NutritionItemProps {
  label: string;
  value: number;
  unit: string;
}

const NutritionItem = ({ label, value, unit }: NutritionItemProps) => (
  <div className="bg-gray-50 rounded-xl px-4 py-2 flex flex-col items-center justify-center w-full">
    <span className="text-sm text-gray-600">{label}</span>
    <span className="font-semibold text-gray-900">
      {value} {unit}
    </span>
  </div>
);