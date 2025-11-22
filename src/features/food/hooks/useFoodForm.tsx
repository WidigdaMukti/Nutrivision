import { useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { toast } from 'sonner';
import type { FoodItem, FoodErrors, LocationState } from './types';
import { useFoodValidation } from './useFoodValidation';
import { useFoodOperations } from './useFoodOperations';
import { useFoodSubmission } from './useFoodSubmission';

export function useFoodForm() {
  const navigate = useNavigate();
  const location = useLocation();
  const state = location.state as LocationState;

  const [foods, setFoods] = useState<FoodItem[]>(() => {
    if (state?.detectedFoods && state.detectedFoods.length > 0) {
      return state.detectedFoods.map((food) => ({
        name: food.name,
        jumlah: "",
        satuan: "gram",
        nutrition: food.nutrition
      }));
    }
    return [{ name: "", jumlah: "", satuan: "gram" }];
  });

  const [errors, setErrors] = useState<FoodErrors>({});
  const [isLoading, setIsLoading] = useState(false);

  const { validateForm, setFoodRef, foodRefs } = useFoodValidation();
  const { 
    addEmptyFood, 
    updateName, 
    updateJumlah, 
    updateSatuan, 
    deleteFood 
  } = useFoodOperations();
  const { submitToBackend } = useFoodSubmission();

  const handleAddEmptyFood = () => addEmptyFood(foods, setFoods);

  const handleUpdateName = (value: string, index: number) => 
    updateName(value, index, foods, setFoods, errors, setErrors);

  const handleUpdateJumlah = (value: string, index: number) => 
    updateJumlah(value, index, foods, setFoods, errors, setErrors);

  const handleUpdateSatuan = (value: string, index: number) => 
    updateSatuan(value, index, foods, setFoods);

  const handleDeleteFood = (index: number) => 
    deleteFood(index, foods, setFoods, errors, setErrors);

  const handleValidateForm = () => {
    const { isValid, errors: validationErrors } = validateForm(foods);
    setErrors(validationErrors);
    return isValid;
  };

  const handleSubmit = async () => {
    const isValid = handleValidateForm();

    if (isValid) {
      setIsLoading(true);

      try {
        const result = await submitToBackend(
          foods, 
          state?.selectedDate, 
          state?.kategoriId
        );
        console.log("✅ Data berhasil disimpan:", result);
        window.dispatchEvent(new Event('refreshMeals'));
        navigate('/dashboard');
      } catch (error) {
        console.error("❌ Error submitting data:", error);
        toast.error("Gagal menyimpan makanan");
      } finally {
        setIsLoading(false);
      }
    }
  };

  return {
    foods,
    errors,
    isLoading,
    addEmptyFood: handleAddEmptyFood,
    updateName: handleUpdateName,
    updateJumlah: handleUpdateJumlah,
    updateSatuan: handleUpdateSatuan,
    deleteFood: handleDeleteFood,
    validateForm: handleValidateForm,
    handleSubmit,
    foodRefs,
    setFoodRef,
    navigate,
  };
}