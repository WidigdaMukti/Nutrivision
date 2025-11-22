import { useFoodForm } from "../hooks/useFoodForm";
import { Navbar } from "../components/Navbar";
import { FoodItem } from "../components/FoodItem";
import { AddButton } from "../components/AddButton";
import { SubmitButton } from "../components/SubmitButton";

export default function AddFood() {
  const {
    foods,
    errors,
    isLoading,
    addEmptyFood,
    updateName,
    updateJumlah,
    updateSatuan,
    deleteFood,
    handleSubmit,
    setFoodRef,
    navigate,
  } = useFoodForm();

  return (
    <div className="min-h-screen bg-white">
      <Navbar 
        isLoading={isLoading} 
        onBack={() => navigate(-1)} 
      />

      {/* CONTENT */}
      <div className="p-4 space-y-4 pb-24">
        {foods.map((item, index) => (
          <FoodItem
            key={index}
            item={item}
            index={index}
            errors={errors}
            isLoading={isLoading}
            onUpdateName={updateName}
            onUpdateJumlah={updateJumlah}
            onUpdateSatuan={updateSatuan}
            onDelete={deleteFood}
            setFoodRef={setFoodRef}
          />
        ))}

        <AddButton 
          isLoading={isLoading} 
          onClick={addEmptyFood} 
        />
      </div>

      <SubmitButton 
        isLoading={isLoading} 
        onClick={handleSubmit} 
      />
    </div>
  );
}