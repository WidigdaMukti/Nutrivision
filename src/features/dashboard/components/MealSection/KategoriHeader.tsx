import { Plus } from "lucide-react";

interface KategoriHeaderProps {
  kategori: any;
  onAddClick: () => void;
}

export const KategoriHeader = ({ kategori, onAddClick }: KategoriHeaderProps) => (
  <div className="p-3 flex justify-between items-center">
    <span className="text-gray-900 font-medium text-lg">{kategori.nama}</span>
    <Plus
      className="text-teal-600 cursor-pointer w-5 h-5"
      onClick={onAddClick}
    />
  </div>
);