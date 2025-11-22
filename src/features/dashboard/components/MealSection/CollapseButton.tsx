import { ChevronDown, ChevronRight } from "lucide-react";

interface CollapseButtonProps {
  isOpen: boolean;
  onClick: () => void;
  showMacroRow?: boolean;
  nutrisi?: any;
}

export const CollapseButton = ({ isOpen, onClick, showMacroRow = false, nutrisi }: CollapseButtonProps) => (
  <button
    onClick={onClick}
    className={`w-full bg-gray-50 flex items-center ${
      showMacroRow ? 'justify-between' : 'justify-end'
    } px-4 py-3 gap-2 border-t border-gray-200 hover:bg-gray-100 transition-colors`}
  >
    {showMacroRow && (
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
    )}
    {isOpen ? (
      <ChevronDown className="text-gray-500 w-5 h-5" />
    ) : (
      <ChevronRight className="text-gray-500 w-5 h-5" />
    )}
  </button>
);