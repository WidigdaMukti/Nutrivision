import { Input } from "@/components/ui/input";
import { Lock, Eye, EyeOff } from "lucide-react";

interface ConfirmPasswordInputProps {
    value: string;
    error?: string;
    isLoading: boolean;
    showPassword: boolean;
    onChange: (value: string) => void;
    onKeyPress: (e: React.KeyboardEvent) => void;
    onToggleVisibility: () => void;
}

export const ConfirmPasswordInput = ({
    value,
    error,
    isLoading,
    showPassword,
    onChange,
    onKeyPress,
    onToggleVisibility
}: ConfirmPasswordInputProps) => (
    <div className="flex flex-col">
        <div className="relative flex items-center">
            <Lock className="absolute left-4 h-5 w-5 text-gray-400 pointer-events-none" />
            <Input
                type={showPassword ? "text" : "password"}
                placeholder="Ulangi Katasandi"
                value={value}
                onChange={(e) => onChange(e.target.value)}
                onKeyPress={onKeyPress}
                disabled={isLoading}
                className={`pl-12 pr-12 h-12 text-base rounded-xl transition-colors ${error
                    ? "border-red-500 focus-visible:ring-red-500"
                    : "border-gray-300 focus-visible:ring-teal-500 focus-visible:border-teal-500"
                    } ${isLoading ? "opacity-50 cursor-not-allowed" : ""}`}
            />
            <button
                type="button"
                onClick={onToggleVisibility}
                disabled={isLoading}
                className="absolute right-4 text-gray-400 hover:text-gray-600 disabled:opacity-50"
            >
                {showPassword ? (
                    <EyeOff className="h-5 w-5" />
                ) : (
                    <Eye className="h-5 w-5" />
                )}
            </button>
        </div>
        {error && (
            <p className="text-sm text-red-500 mt-1">{error}</p>
        )}
    </div>
);