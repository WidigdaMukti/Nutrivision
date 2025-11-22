import { ArrowLeft, Trash2 } from "lucide-react";

interface FoodDetailNavbarProps {
  onBack: () => void;
  onDelete: () => void;
}

export const FoodDetailNavbar = ({ onBack, onDelete }: FoodDetailNavbarProps) => (
  <div className="flex items-center justify-between px-4 py-4 bg-white border-b border-gray-200">
    <button onClick={onBack} className="flex items-center gap-2">
      <ArrowLeft className="w-5 h-5 text-gray-700" />
    </button>
    <h1 className="text-lg font-bold text-gray-900">Detail Makanan</h1>
    <button onClick={onDelete}>
      <Trash2 className="w-6 h-6 text-red-500 hover:text-red-600" />
    </button>
  </div>
);