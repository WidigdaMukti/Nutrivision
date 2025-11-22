import { Button } from "@/components/ui/button";
import { ArrowRight } from "lucide-react";

interface LoginButtonProps {
    isLoading: boolean;
    onClick: () => void;
}

export const LoginButton = ({ isLoading, onClick }: LoginButtonProps) => (
    <Button
        onClick={onClick}
        disabled={isLoading}
        className="w-full h-12 text-base text-neutral-50 font-medium bg-teal-500 rounded-xl hover:bg-teal-600 disabled:opacity-50 disabled:cursor-not-allowed"
    >
        {isLoading ? (
            <div className="flex items-center">
                <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                Memproses...
            </div>
        ) : (
            <>
                Masuk
                <ArrowRight className="h-5 w-5 ml-2" />
            </>
        )}
    </Button>
);