interface NutritionInfoProps {
  totalNutrisi: {
    kalori: number;
    karbo: number;
    lemak: number;
    protein: number;
  };
}

export const NutritionInfo = ({ totalNutrisi }: NutritionInfoProps) => (
  <div className="bg-neutral-100 rounded-xl border border-[#e4e4e4] p-3">
    <h2 className="text-neutral-800 font-bold mb-2">Informasi Gizi</h2>
    <div className="border-t border-[#e4e4e4] my-2" />

    {/* Energi */}
    <div className="flex justify-between text-[14px] text-neutral-800 mb-2">
      <span>Energi</span>
      <span className="font-bold">{totalNutrisi.kalori} kj</span>
    </div>
    <div className="border-t border-[#e4e4e4] my-2" />

    {/* Lemak */}
    <div className="space-y-2 mb-2">
      <div className="flex justify-between text-[14px] text-neutral-800">
        <span>Lemak</span>
        <span className="font-bold">{totalNutrisi.lemak} g</span>
      </div>
      <div className="flex justify-between text-[14px] text-neutral-800 pl-4">
        <span>Lemak Jenuh</span>
        <span className="font-bold">0 g</span>
      </div>
      <div className="flex justify-between text-[14px] text-neutral-800 pl-4">
        <span>Lemak tak Jenuh Ganda</span>
        <span className="font-bold">0 g</span>
      </div>
      <div className="flex justify-between text-[14px] text-neutral-800 pl-4">
        <span>Lemak tak Jenuh Tunggal</span>
        <span className="font-bold">0 g</span>
      </div>
    </div>
    <div className="border-t border-[#e4e4e4] my-2" />

    {/* Kolesterol */}
    <div className="flex justify-between text-[14px] text-neutral-800 mb-2">
      <span>Kolesterol</span>
      <span className="font-bold">0 g</span>
    </div>
    <div className="border-t border-[#e4e4e4] my-2" />

    {/* Protein */}
    <div className="flex justify-between text-[14px] text-neutral-800 mb-2">
      <span>Protein</span>
      <span className="font-bold">{totalNutrisi.protein} g</span>
    </div>
    <div className="border-t border-[#e4e4e4] my-2" />

    {/* Karbohidrat */}
    <div className="space-y-2">
      <div className="flex justify-between text-[14px] text-neutral-800">
        <span>Karbohidrat</span>
        <span className="font-bold">{totalNutrisi.karbo} g</span>
      </div>
      <div className="flex justify-between text-[14px] text-neutral-800 pl-4">
        <span>Serat</span>
        <span className="font-bold">0 g</span>
      </div>
      <div className="flex justify-between text-[14px] text-neutral-800 pl-4">
        <span>Gula</span>
        <span className="font-bold">0 g</span>
      </div>
    </div>
  </div>
);