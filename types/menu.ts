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
  /** UUID của bản ghi Menu */
  id: string;
  menuName: string;
  description: string;
  imageUrl: string;
  /** Số bữa ăn trong một ngày (ví dụ: 3) */
  mealsPerDay: number;
  /** Giới hạn calo tối thiểu/ngày */
  dailyCaloriesMin: number;
  /** Giới hạn calo tối đa/ngày */
  dailyCaloriesMax: number;
  menuDays: MenuDay[];
}

/** Cấu trúc response body hoàn chỉnh */
export interface MenuResponse {
  menu: Menu;
}

export type MealDishResponseFromAdopt = {
  dishId: string
}

export interface AdopMenuBodyRequest {
  adoptCustomMenuDto: AdoptCustomMenuDTO
}

export type AdoptCustomMenuDTO = {
  sourceMenuId: string;
  menuDays: MenuDayFromAdopt[]
}

export type MenuDayFromAdopt = {
  dayNumber: number,
  meals: MealFromAdopt[]
}

export type MealFromAdopt = {
  mealType: string,
  isMainMeal: true,
  mealDishes: MealDishResponseFromAdopt[]
}