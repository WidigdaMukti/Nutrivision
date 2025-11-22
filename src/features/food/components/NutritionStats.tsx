interface NutritionStatsProps {
  totalNutrisi: {
    kalori: number;
    karbo: number;
    lemak: number;
    protein: number;
  };
}

export const NutritionStats = ({ totalNutrisi }: NutritionStatsProps) => (
  <div className="flex gap-3">
    <div className="flex-1 bg-neutral-100 rounded-lg px-0 py-1 text-center">
      <p className="text-[12px] text-neutral-600">Karbo</p>
      <p className="text-base text-neutral-800 font-bold">{totalNutrisi.karbo} g</p>
    </div>
    <div className="flex-1 bg-neutral-100 rounded-lg px-0 py-1 text-center">
      <p className="text-[12px] text-neutral-600">Lemak</p>
      <p className="text-base text-neutral-800 font-bold">{totalNutrisi.lemak} g</p>
    </div>
    <div className="flex-1 bg-neutral-100 rounded-lg px-0 py-1 text-center">
      <p className="text-[12px] text-neutral-600">Protein</p>
      <p className="text-base text-neutral-800 font-bold">{totalNutrisi.protein} g</p>
    </div>
    <div className="flex-1 bg-neutral-100 rounded-lg px-0 py-1 text-center">
      <p className="text-[12px] text-neutral-600">Kalori</p>
      <p className="text-base text-neutral-800 font-bold">{totalNutrisi.kalori}</p>
    </div>
  </div>
);