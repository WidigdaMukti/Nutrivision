interface EditButtonProps {
  onClick: () => void;
}

export const EditButton = ({ onClick }: EditButtonProps) => (
  <div className="fixed bottom-0 left-0 right-0 z-40 bg-white border-t border-gray-200 p-4">
    <button
      onClick={onClick}
      className="w-full py-3 bg-teal-500 text-white font-semibold rounded-xl hover:bg-teal-600 transition-colors"
    >
      Ubah
    </button>
  </div>
);