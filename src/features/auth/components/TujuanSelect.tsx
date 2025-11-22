import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select";

interface TujuanSelectProps {
    value: string;
    error?: string;
    isLoading: boolean;
    onChange: (value: string) => void;
}

export const TujuanSelect = ({ value, error, isLoading, onChange }: TujuanSelectProps) => (
    <div>
        <p className="text-gray-500 mb-1">Tujuan Penggunaan</p>
        <Select
            value={value}
            onValueChange={onChange}
            disabled={isLoading}
        >
            <SelectTrigger
                className={`h-12 w-full rounded-xl border bg-white px-3 text-base focus:ring-2 focus:ring-teal-500 focus:border-teal-500 focus:outline-none ${error
                    ? "border-red-500 focus-visible:ring-red-500"
                    : "border-gray-300 "
                    } ${isLoading ? "opacity-50 cursor-not-allowed" : ""}`}
                style={{ height: "48px", minHeight: "48px" }}
            >
                <SelectValue placeholder="Pilih penggunaan" />
            </SelectTrigger>
            <SelectContent className="bg-white rounded-xl border border-gray-200 shadow-md text-base">
                <SelectItem value="Menurunkan berat badan" className="py-3 text-base">
                    Menurunkan berat badan
                </SelectItem>
                <SelectItem value="Menaikkan berat badan" className="py-3 text-base">
                    Menaikkan berat badan
                </SelectItem>
                <SelectItem value="Menjaga berat badan" className="py-3 text-base">
                    Menjaga berat badan
                </SelectItem>
            </SelectContent>
        </Select>
        {error && (
            <p className="text-red-500 text-sm mt-1">{error}</p>
        )}
    </div>
);