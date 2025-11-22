import { Input } from "@/components/ui/input";

interface NumericInputProps {
    label: string;
    placeholder: string;
    value: string;
    error?: string;
    isLoading: boolean;
    onChange: (value: string) => void;
}

export const NumericInput = ({
    placeholder,
    value,
    error,
    isLoading,
    onChange
}: NumericInputProps) => (
    <div>
        <Input
            type="text"
            inputMode="numeric"
            pattern="[0-9]*"
            placeholder={placeholder}
            value={value}
            onChange={(e) => onChange(e.target.value)}
            disabled={isLoading}
            className={`h-12 text-base rounded-xl ${error
                ? "border-red-500 focus-visible:ring-red-500"
                : "border-gray-300 focus-visible:ring-teal-500 focus-visible:border-teal-500"
                } ${isLoading ? "opacity-50 cursor-not-allowed" : ""}`}
        />
        {error && (
            <p className="text-red-500 text-sm mt-1">{error}</p>
        )}
    </div>
);