import { X } from "lucide-react";

interface DeleteModalProps {
  isOpen: boolean;
  itemCount: number;
  onClose: () => void;
  onConfirm: () => void;
}

export const DeleteModal = ({ isOpen, itemCount, onClose, onConfirm }: DeleteModalProps) => {
  if (!isOpen) return null;

  return (
    <>
      {/* Overlay */}
      <div
        className="fixed inset-0 bg-black/50 z-50 animate-in fade-in-0"
        onClick={onClose}
      />

      {/* Bottom Sheet */}
      <div className="fixed bottom-0 left-0 right-0 z-50 bg-white rounded-t-2xl px-4 py-6 animate-in slide-in-from-bottom duration-300">
        <div className="flex justify-between items-center mb-4">
          <h3 className="text-lg font-bold text-gray-900">Hapus Makanan</h3>
          <button
            onClick={onClose}
            className="p-1 rounded-full hover:bg-gray-100"
          >
            <X className="w-5 h-5 text-gray-500" />
          </button>
        </div>

        <p className="text-gray-600 mb-6">
          Apakah Anda yakin ingin menghapus {itemCount} makanan ini?
          Tindakan ini tidak dapat dibatalkan.
        </p>

        <div className="flex gap-3">
          <button
            onClick={onClose}
            className="flex-1 py-3 border border-teal-500 text-teal-500 font-semibold rounded-xl hover:bg-teal-50 transition-colors"
          >
            Batal
          </button>
          <button
            onClick={onConfirm}
            className="flex-1 py-3 bg-red-500 text-white font-semibold rounded-xl hover:bg-red-600 transition-colors"
          >
            Hapus
          </button>
        </div>
      </div>
    </>
  );
};