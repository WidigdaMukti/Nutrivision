import { useFoodDetail } from "../hooks/useFoodDetail";
import { FoodDetailNavbar } from "../components/FoodDetailNavbar";
import { FoodList } from "../components/FoodList";
import { NutritionStats } from "../components/NutritionStats";
import { NutritionInfo } from "../components/NutritionInfo";
import { DeleteModal } from "../components/DeleteModal";
import { EditButton } from "../components/EditButton";

export default function FoodDetail() {
  const {
    foodGroup,
    isLoading,
    showDeleteModal,
    setShowDeleteModal,
    confirmDelete,
    navigate
  } = useFoodDetail();

  if (isLoading) {
    return (
      <div className="min-h-screen bg-white flex items-center justify-center">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-teal-500"></div>
      </div>
    );
  }

  if (!foodGroup || foodGroup.items.length === 0) {
    return (
      <div className="min-h-screen bg-white flex items-center justify-center">
        <p className="text-gray-500">Data makanan tidak ditemukan.</p>
      </div>
    );
  }

  const firstFood = foodGroup.items[0];

  return (
    <div className="min-h-screen bg-white pb-24">
      <FoodDetailNavbar 
        onBack={() => navigate(-1)}
        onDelete={() => setShowDeleteModal(true)}
      />

      {/* Content */}
      <div className="flex flex-col gap-4 mt-3 px-3">
        <FoodList items={foodGroup.items} />
        
        <div className="border-t border-[#e4e4e4]" />
        
        <NutritionStats totalNutrisi={foodGroup.totalNutrisi} />
        
        <div className="border-t border-[#e4e4e4]" />
        
        <NutritionInfo totalNutrisi={foodGroup.totalNutrisi} />
      </div>

      <DeleteModal
        isOpen={showDeleteModal}
        itemCount={foodGroup.items.length}
        onClose={() => setShowDeleteModal(false)}
        onConfirm={confirmDelete}
      />

      <EditButton onClick={() => navigate(`/edit-makanan/${firstFood.id}`)} />
    </div>
  );
}