import { Button } from "@/components/ui/button";

interface SaveButtonProps {
    isSaving: boolean;
    hasChanges: boolean;
    onClick: () => void;
    label?: string;
}

export const SaveButton = ({
    isSaving,
    hasChanges,
    onClick,
    label = "Simpan"
}: SaveButtonProps) => (
    <Button
        variant={hasChanges ? "default" : "outline"}
        onClick={onClick}
        disabled={!hasChanges || isSaving}
        className={`w-full h-12 text-base font-semibold rounded-xl transition-colors ${hasChanges && !isSaving
            ? "bg-teal-500 text-white hover:bg-teal-600"
            : "border-teal-500 text-teal-500 hover:bg-teal-50"
            }`}
    >
        {isSaving ? (
            <div className="flex items-center">
                <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-current mr-2"></div>
                Menyimpan...
            </div>
        ) : (
            label
        )}
    </Button>
);