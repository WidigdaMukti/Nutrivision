import { Button } from "@/components/ui/button";

interface DataDiriButtonProps {
    isLoading: boolean;
    isNewUser: boolean;
    onClick: () => void;
}

export const DataDiriButton = ({ isLoading, isNewUser, onClick }: DataDiriButtonProps) => (
    <Button
        onClick={onClick}
        disabled={isLoading}
        className="w-full h-12 text-base text-white font-semibold bg-teal-500 rounded-xl hover:bg-teal-600 disabled:opacity-50 disabled:cursor-not-allowed"
    >
        {isLoading ? (
            <div className="flex items-center">
                <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                Menyimpan...
            </div>
        ) : isNewUser ? (
            "Selesaikan Pendaftaran"
        ) : (
            "Perbarui Data"
        )}
    </Button>
);