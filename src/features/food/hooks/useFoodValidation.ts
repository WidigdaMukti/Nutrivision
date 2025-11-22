import { useRef } from 'react';
import type { FoodItem, FoodErrors } from './types';

export const useFoodValidation = () => {
  const foodRefs = useRef<(HTMLDivElement | null)[]>([]);

  const validateForm = (foods: FoodItem[]) => {
    const newErrors: FoodErrors = {};
    let hasError = false;
    let firstErrorIndex: number | null = null;

    foods.forEach((food, index) => {
      const itemErrors: { name?: boolean; jumlah?: boolean } = {};

      if (!food.name || !food.name.trim()) {
        itemErrors.name = true;
        hasError = true;
        if (firstErrorIndex === null) firstErrorIndex = index;
      }

      if (!food.jumlah || !food.jumlah.trim()) {
        itemErrors.jumlah = true;
        hasError = true;
        if (firstErrorIndex === null) firstErrorIndex = index;
      }

      if (Object.keys(itemErrors).length > 0) {
        newErrors[index] = itemErrors;
      }
    });

    if (firstErrorIndex !== null && foodRefs.current[firstErrorIndex]) {
      setTimeout(() => {
        foodRefs.current[firstErrorIndex!]?.scrollIntoView({
          behavior: 'smooth',
          block: 'center'
        });
      }, 100);
    }

    return { isValid: !hasError, errors: newErrors };
  };

  const setFoodRef = (el: HTMLDivElement | null, index: number) => {
    foodRefs.current[index] = el;
  };

  return {
    validateForm,
    setFoodRef,
    foodRefs
  };
};