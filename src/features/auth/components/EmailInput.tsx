import { Input } from "@/components/ui/input";
import { Mail } from "lucide-react";

interface EmailInputProps {
    value: string;
    error?: string;
    isLoading: boolean;
    onChange: (value: string) => void;
    onKeyPress: (e: React.KeyboardEvent) => void;
}

export const EmailInput = ({
    value,
    error,
    isLoading,
    onChange,
    onKeyPress
}: EmailInputProps) => (
    <div className="flex flex-col">
        <div className="relative flex items-center">
            <Mail className="absolute left-4 h-5 w-5 text-gray-400 pointer-events-none" />
            <Input
                id="email"
                type="email"
                placeholder="Masukan Email"
                value={value}
                onChange={(e) => onChange(e.target.value)}
                onKeyPress={onKeyPress}
                disabled={isLoading}
                className={`pl-12 h-12 text-base rounded-xl transition-colors ${error
                    ? 'border-red-500 focus-visible:ring-red-500'
                    : 'border-gray-300 focus-visible:ring-teal-500 focus-visible:border-teal-500'
                    } ${isLoading ? 'opacity-50 cursor-not-allowed' : ''}`}
            />
        </div>
        {error && (
            <p className="text-red-500 text-sm mt-1">{error}</p>
        )}
    </div>
);