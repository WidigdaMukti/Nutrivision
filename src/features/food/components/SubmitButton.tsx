import { Button } from "@/components/ui/button";
import { Loader2 } from "lucide-react";

interface SubmitButtonProps {
    isLoading: boolean;
    onClick: () => void;
}

export const SubmitButton = ({ isLoading, onClick }: SubmitButtonProps) => (
    <div className="fixed bottom-0 left-0 right-0 z-50 bg-white border-t border-gray-200 p-4">
        <Button
            onClick={onClick}
            disabled={isLoading}
            className="w-full h-12 text-base font-semibold rounded-xl bg-teal-500 text-white hover:bg-teal-600 disabled:opacity-50 disabled:cursor-not-allowed"
        >
            {isLoading ? (
                <div className="flex items-center gap-2">
                    <Loader2 className="w-4 h-4 animate-spin" />
                    Menyimpan...
                </div>
            ) : (
                "Tambah Makanan"
            )}
        </Button>
    </div>
);