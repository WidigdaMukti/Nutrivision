import { ArrowLeft } from "lucide-react";

interface NavbarProps {
  isLoading: boolean;
  onBack: () => void;
}

export const Navbar = ({ isLoading, onBack }: NavbarProps) => (
  <div className="flex items-center justify-between px-4 py-4 border-b border-gray-200 bg-white">
    <button
      onClick={onBack}
      className="flex items-center gap-2"
      disabled={isLoading}
    >
      <ArrowLeft className="w-5 h-5 text-gray-700" />
      <h1 className="text-lg font-bold text-gray-900">Tambah Makanan</h1>
    </button>
  </div>
);