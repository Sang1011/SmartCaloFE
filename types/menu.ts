export interface MealDish {
  /** UUID của bản ghi MealDish */
  id: string;
  /** UUID tham chiếu đến món ăn (Dish) */
  dishId: string;
  calories: number;
  protein: number;
  carbs: number;
  fat: number;
  fiber: number;
  sugar: number;
  imageUrl: string;
  name: string;
}

export interface Meal {
  /** UUID của bản ghi Meal */
  id: string;
  /** Loại bữa ăn (ví dụ: 'Breakfast', 'Lunch', 'Dinner') */
  mealType: string;
  /** Tổng calo của tất cả món ăn trong bữa này */
  totalCalories: number;
  mealDishes: MealDish[];
}

export interface MenuDay {
  /** UUID của bản ghi MenuDay */
  id: string;
  /** Số thứ tự ngày trong Menu (0 là ngày 1, 1 là ngày 2, ...) */
  dayNumber: number;
  meals: Meal[];
}


export interface Menu {
  id: string;
  menuName: string;
  description: string;
  imageUrl: string;
  mealsPerDay: number;
  dailyCaloriesMin: number;
  dailyCaloriesMax: number;
  menuDays: MenuDay[];
}

export interface MenuItemResponse {
  id: string,
  menuName: string,
  description: string,
  imageUrl: string,
  dailyCaloriesMin: number,
  dailyCaloriesMax: number
}

export type MealDishRequestFromAdopt = {
  dishId: string
}

export interface AdopMenuBodyRequest {
  adoptCustomMenuDto: AdoptCustomMenuDTO
}

export type AdoptCustomMenuDTO = {
  sourceMenuId: string;
  menuDays?: MenuDayFromAdopt[]
}

export type MenuDayFromAdopt = {
  dayNumber: number,
  meals: MealFromAdopt[]
}

export type MealFromAdopt = {
  mealType: string,
  isMainMeal: true,
  mealDishes: MealDishRequestFromAdopt[]
}

export type AdoptCustomMenuResponse = {
  newMenuId: string
}