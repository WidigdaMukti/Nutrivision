import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select";

interface GenderSelectProps {
    value: string;
    error?: string;
    isLoading: boolean;
    onChange: (value: string) => void;
}

export const GenderSelect = ({ value, error, isLoading, onChange }: GenderSelectProps) => (
    <div>
        <Select
            value={value}
            onValueChange={onChange}
            disabled={isLoading}
        >
            <SelectTrigger
                className={`h-12 w-full rounded-xl border bg-white px-3 text-base focus:ring-2 focus:ring-teal-500 focus:border-teal-500 focus:outline-none ${error
                    ? "border-red-500 focus-visible:ring-red-500"
                    : "border-gray-300 focus-visible:ring-teal-500 focus-visible:border-teal-500"
                    } ${isLoading ? "opacity-50 cursor-not-allowed" : ""}`}
                style={{ height: "48px", minHeight: "48px" }}
            >
                <SelectValue placeholder="Jenis Kelamin" />
            </SelectTrigger>
            <SelectContent className="bg-white rounded-xl border border-gray-200 shadow-md text-base">
                <SelectItem value="pria" className="py-3 text-base">
                    Pria
                </SelectItem>
                <SelectItem value="wanita" className="py-3 text-base">
                    Wanita
                </SelectItem>
            </SelectContent>
        </Select>
        {error && (
            <p className="text-red-500 text-sm mt-1">{error}</p>
        )}
    </div>
);