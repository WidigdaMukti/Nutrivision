import { Button } from "@/components/ui/button";

interface AddButtonProps {
    isLoading: boolean;
    onClick: () => void;
}

export const AddButton = ({ isLoading, onClick }: AddButtonProps) => (
    <Button
        variant="outline"
        onClick={onClick}
        disabled={isLoading}
        className={`w-full h-12 text-base font-semibold rounded-xl border-teal-500 text-teal-500 hover:bg-teal-50 ${isLoading ? 'opacity-50 cursor-not-allowed' : ''
            }`}
    >
        + Tambah
    </Button>
);