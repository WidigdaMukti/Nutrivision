import { Input } from "@/components/ui/input";
import {
    Select,
    SelectTrigger,
    SelectContent,
    SelectItem,
    SelectValue,
} from "@/components/ui/select";
import { Trash2 } from "lucide-react";
import type { FoodItem as FoodItemType } from '../hooks/types'; // ✅ RENAME IMPORT

interface FoodItemProps {
    item: FoodItemType; // ✅ GUNAKAN TYPE YANG SUDAH DI-RENAME
    index: number;
    errors: any;
    isLoading: boolean;
    onUpdateName: (value: string, index: number) => void;
    onUpdateJumlah: (value: string, index: number) => void;
    onUpdateSatuan: (value: string, index: number) => void;
    onDelete: (index: number) => void;
    setFoodRef: (el: HTMLDivElement | null, index: number) => void;
}

export const FoodItem = ({ // ✅ KOMPONEN FoodItem
    item,
    index,
    errors,
    isLoading,
    onUpdateName,
    onUpdateJumlah,
    onUpdateSatuan,
    onDelete,
    setFoodRef
}: FoodItemProps) => (
    <div
        ref={(el) => setFoodRef(el, index)}
        className={`border rounded-2xl p-4 space-y-3 relative ${(errors[index]?.name || errors[index]?.jumlah)
            ? 'border-red-500'
            : 'border-gray-200'
            } ${isLoading ? 'opacity-50' : ''}`}
    >
        <div className="flex justify-between items-start">
            {/* Input nama makanan */}
            <div className="inline-block min-w-0">
                <input
                    placeholder="Nama makanan"
                    value={item.name}
                    onChange={(e) => onUpdateName(e.target.value, index)}
                    disabled={isLoading}
                    className={`border-0 border-b px-0 focus:outline-none focus:border-b-2 bg-transparent text-base min-w-[120px] ${errors[index]?.name
                        ? 'border-red-500 focus:border-red-500'
                        : 'border-gray-300 focus:border-teal-500'
                        } ${isLoading ? 'cursor-not-allowed' : ''}`}
                    style={{
                        width: item.name ? `${Math.max(item.name.length * 8, 120)}px` : '120px'
                    }}
                />
            </div>

            <Trash2
                className={`w-5 h-5 cursor-pointer ml-3 mt-1 shrink-0 ${isLoading ? 'text-gray-300 cursor-not-allowed' : 'text-gray-500 hover:text-red-500'
                    }`}
                onClick={() => !isLoading && onDelete(index)}
            />
        </div>

        {/* jumlah + gram/porsi */}
        <div className="flex gap-2">
            <div className="flex-1">
                <Input
                    placeholder="Masukkan jumlah"
                    value={item.jumlah}
                    onChange={(e) => onUpdateJumlah(e.target.value, index)}
                    inputMode="numeric"
                    disabled={isLoading}
                    style={{ height: "48px", minHeight: "48px" }}
                    className={`text-base rounded-xl focus-visible:ring-2 focus-visible:border-teal-500 ${errors[index]?.jumlah
                        ? 'border-red-500 focus-visible:ring-red-500'
                        : 'border-gray-300 focus-visible:ring-teal-500'
                        } ${isLoading ? 'cursor-not-allowed' : ''}`}
                />
            </div>

            <Select
                value={item.satuan}
                onValueChange={(value) => onUpdateSatuan(value, index)}
                disabled={isLoading}
            >
                <SelectTrigger
                    className={`w-28 rounded-xl border-gray-300 focus:ring-2 focus:ring-teal-500 focus:border-teal-500 focus:outline-none text-base ${errors[index]?.jumlah ? 'border-red-500' : 'border-gray-300'
                        } ${isLoading ? 'cursor-not-allowed' : ''}`}
                    style={{ height: "48px", minHeight: "48px" }}
                >
                    <SelectValue placeholder="Gram" />
                </SelectTrigger>
                <SelectContent className="bg-white rounded-xl border border-gray-200 shadow-md">
                    <SelectItem value="gram" className="text-base">Gram (g)</SelectItem>
                    <SelectItem value="ml" className="text-base">Mililiter (ml)</SelectItem>
                </SelectContent>
            </Select>
        </div>

        {/* Tampilkan error messages */}
        {(errors[index]?.name || errors[index]?.jumlah) && (
            <div className="text-red-500 text-sm mt-1">
                {errors[index]?.name && "Nama makanan harus diisi"}
                {errors[index]?.name && errors[index]?.jumlah && " • "}
                {errors[index]?.jumlah && "Jumlah harus diisi"}
            </div>
        )}
    </div>
);