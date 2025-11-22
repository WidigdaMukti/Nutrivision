import { useRef } from "react";
import { useMealSection } from '../hooks/useMealSection';
import { KategoriHeader } from '../components/MealSection/KategoriHeader'
import { FoodGroup } from '../components/MealSection/FoodGroup';
import { CollapseButton } from '../components/MealSection/CollapseButton';
import { LoadingState } from '../components/MealSection/LoadingState';
import { ProcessingState } from '../components/MealSection/ProcessingState';
import type { MealSectionProps } from '../types';

export default function MealSection({ selectedDate }: MealSectionProps) {
  const cameraRef = useRef<HTMLInputElement>(null);
  
  const {
    openSections,
    kategoriMakanan,
    makananByKategori,
    isLoading,
    isProcessingImage,
    selectedKategoriId,
    setSelectedKategoriId,
    processImageWithGemini,
    toggleSection,
    calculateCategoryTotal,
    formatFoodNames
  } = useMealSection({ selectedDate });

  const handleImageCapture = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (cameraRef.current) {
      cameraRef.current.value = '';
    }

    await processImageWithGemini(file, selectedKategoriId);
  };

  const defaultKategori = [
    { id: 1, nama: "Makan Pagi" },
    { id: 2, nama: "Makan Siang" },
    { id: 3, nama: "Makan Malam" },
    { id: 4, nama: "Lainnya" }
  ];

  const kategoriToRender = kategoriMakanan.length > 0 ? kategoriMakanan : defaultKategori;

  if (isLoading) return <LoadingState />;
  if (isProcessingImage) return <ProcessingState />;

  return (
    <div className="px-4 mb-6 space-y-4">
      <input
        ref={cameraRef}
        type="file"
        accept="image/*"
        capture="environment"
        className="hidden"
        onChange={handleImageCapture}
      />

      {kategoriToRender.map(kategori => {
        const groups = makananByKategori[kategori.id] || {};
        const isOpen = openSections[kategori.id] ?? true;
        const categoryTotal = calculateCategoryTotal(kategori.id);
        const hasMakanan = Object.keys(groups).length > 0;

        return (
          <div key={kategori.id} className="border border-gray-200 rounded-2xl overflow-hidden">
            <KategoriHeader
              kategori={kategori}
              onAddClick={() => {
                setSelectedKategoriId(kategori.id);
                cameraRef.current?.click();
              }}
            />

            {hasMakanan && (
              isOpen ? (
                <>
                  <div className="bg-gray-50 border-t border-gray-200">
                    {Object.entries(groups).map(([urutan, group]) => (
                      <FoodGroup
                        key={urutan}
                        kategori={kategori}
                        urutan={urutan}
                        group={group}
                        formatFoodNames={formatFoodNames}
                      />
                    ))}
                  </div>

                  <CollapseButton
                    isOpen={isOpen}
                    onClick={() => toggleSection(kategori.id)}
                  />
                </>
              ) : (
                <CollapseButton
                  isOpen={isOpen}
                  onClick={() => toggleSection(kategori.id)}
                  showMacroRow={true}
                  nutrisi={categoryTotal}
                />
              )
            )}
          </div>
        );
      })}
    </div>
  );
}