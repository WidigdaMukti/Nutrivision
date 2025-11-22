import type { FoodItem } from './types';

interface FoodListProps {
  items: FoodItem[];
}

export const FoodList = ({ items }: FoodListProps) => {
  const getSatuanNama = (foodItem: FoodItem) => {
    if (!foodItem?.satuan_makan || foodItem.satuan_makan.length === 0) {
      return "gram";
    }
    return foodItem.satuan_makan[0]?.nama || "gram";
  };

  return (
    <div className="bg-neutral-100 rounded-xl border border-[#e4e4e4] p-3">
      <h2 className="text-neutral-800 font-bold mb-2">Daftar makanan</h2>
      <div className="border-t border-[#e4e4e4] my-2" />

      {items.map((foodItem, index) => (
        <div key={foodItem.id}>
          <div className="flex justify-between text-[14px] text-neutral-800 mb-2">
            <span>{foodItem.nama_makanan}</span>
            <span className="font-bold">{foodItem.jumlah} {getSatuanNama(foodItem)}</span>
          </div>
          {index < items.length - 1 && (
            <div className="border-t border-[#e4e4e4] my-2" />
          )}
        </div>
      ))}
    </div>
  );
};