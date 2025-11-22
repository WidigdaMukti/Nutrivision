import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select";

interface AktivitasSelectProps {
    value: string;
    error?: string;
    isLoading: boolean;
    onChange: (value: string) => void;
}

export const AktivitasSelect = ({ value, error, isLoading, onChange }: AktivitasSelectProps) => (
    <div>
        <p className="text-gray-500 mb-1">Level Aktivitas Harian</p>
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
                <SelectValue placeholder="Pilih level aktivitas" />
            </SelectTrigger>
            <SelectContent className="bg-white rounded-xl border border-gray-200 shadow-md text-base">
                <SelectItem value="Minim olahraga (kantor, jarang olahraga)" className="py-3 text-base">
                    Minim olahraga (kantor, jarang olahraga)
                </SelectItem>
                <SelectItem value="Olahraga ringan (1-3x/minggu)" className="py-3 text-base">
                    Olahraga ringan (1-3x/minggu)
                </SelectItem>
                <SelectItem value="Olahraga sedang (3-5x/minggu)" className="py-3 text-base">
                    Olahraga sedang (3-5x/minggu)
                </SelectItem>
                <SelectItem value="Olahraga berat (6-7x/minggu)" className="py-3 text-base">
                    Olahraga berat (6-7x/minggu)
                </SelectItem>
                <SelectItem value="Sangat aktif (atlet, pekerja fisik)" className="py-3 text-base">
                    Sangat aktif (atlet, pekerja fisik)
                </SelectItem>
            </SelectContent>
        </Select>
        {error && (
            <p className="text-red-500 text-sm mt-1">{error}</p>
        )}
    </div>
);