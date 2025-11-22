import type { FoodItem, FoodErrors } from './types';

export const useFoodOperations = () => {
  const addEmptyFood = (foods: FoodItem[], setFoods: (foods: FoodItem[]) => void) => {
    setFoods([...foods, { name: "", jumlah: "", satuan: "gram" }]);
  };

  const updateName = (
    value: string, 
    index: number, 
    foods: FoodItem[], 
    setFoods: (foods: FoodItem[]) => void,
    errors: FoodErrors,
    setErrors: (errors: FoodErrors) => void
  ) => {
    setFoods(foods.map((item, i) => i === index ? { ...item, name: value } : item));
    
    if (errors[index]?.name) {
      setErrors({
        ...errors,
        [index]: { ...errors[index], name: false }
      });
    }
  };

  const updateJumlah = (
    value: string, 
    index: number, 
    foods: FoodItem[], 
    setFoods: (foods: FoodItem[]) => void,
    errors: FoodErrors,
    setErrors: (errors: FoodErrors) => void
  ) => {
    const numericValue = value.replace(/[^0-9]/g, "");
    setFoods(foods.map((item, i) => i === index ? { ...item, jumlah: numericValue } : item));
    
    if (errors[index]?.jumlah) {
      setErrors({
        ...errors,
        [index]: { ...errors[index], jumlah: false }
      });
    }
  };

  const updateSatuan = (
    value: string, 
    index: number, 
    foods: FoodItem[], 
    setFoods: (foods: FoodItem[]) => void
  ) => {
    setFoods(foods.map((item, i) => i === index ? { ...item, satuan: value } : item));
  };

  const deleteFood = (
    index: number, 
    foods: FoodItem[], 
    setFoods: (foods: FoodItem[]) => void,
    errors: FoodErrors,
    setErrors: (errors: FoodErrors) => void
  ) => {
    if (foods.length === 1) {
      setFoods([{ name: "", jumlah: "", satuan: "gram" }]);
      setErrors({});
      return;
    }

    setFoods(foods.filter((_, i) => i !== index));
    
    const newErrors = { ...errors };
    delete newErrors[index];
    setErrors(newErrors);
  };

  return {
    addEmptyFood,
    updateName,
    updateJumlah,
    updateSatuan,
    deleteFood
  };
};