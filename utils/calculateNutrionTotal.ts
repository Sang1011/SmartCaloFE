import { Meal } from "../types/menu";

/**
 * Tính tổng Carbs, Protein và Fat của toàn bộ list Meal
 */
export const calculateTotalNutrition = (meals: Meal[]) => {
  return meals.reduce(
    (totals, meal) => {
      meal.mealDishes.forEach((dish) => {
        totals.carbs += dish.carbs || 0;
        totals.protein += dish.protein || 0;
        totals.fat += dish.fat || 0;
      });
      return totals;
    },
    { carbs: 0, protein: 0, fat: 0 }
  );
};
