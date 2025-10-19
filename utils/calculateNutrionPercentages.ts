import { Dish } from "../types/dishes";


/**
 * 🧮 Hàm tính tỷ lệ phần trăm năng lượng từ protein, carbs và fat.
 * @param dish - đối tượng món ăn chứa thông tin dinh dưỡng
 * @returns object { protein, carbs, fat, totalCaloriesCalc }
 */
export const calculateNutritionPercentages = (dish: Dish) => {
    if (!dish) return { protein: 0, carbs: 0, fat: 0, totalCaloriesCalc: 0 };
  
    const { protein = 0, carbs = 0, fat = 0, fiber = 0, sugar = 0 } = dish;
  
    // 🔹 Năng lượng ước tính
    const calFromProtein = protein * 4;
    const calFromCarbs = carbs * 4;  // sugar đã nằm trong carbs
    const calFromFat = fat * 9;
    const calFromFiber = fiber * 2;
  
    const totalCaloriesCalc = calFromProtein + calFromCarbs + calFromFat + calFromFiber;
  
    if (totalCaloriesCalc === 0)
      return { protein: 0, carbs: 0, fat: 0, totalCaloriesCalc: 0 };
  
    // 🔹 Tỷ lệ %
    const percentProtein = +(calFromProtein / totalCaloriesCalc * 100).toFixed(1);
    const percentCarbs = +(calFromCarbs / totalCaloriesCalc * 100).toFixed(1);
    const percentFat = +(calFromFat / totalCaloriesCalc * 100).toFixed(1);
  
    return {
      protein: percentProtein,
      carbs: percentCarbs,
      fat: percentFat,
      fiber,
      sugar,
      totalCaloriesCalc: Math.round(totalCaloriesCalc),
    };
  };
  
  export function calculateDailyMacroTargets(
    tdee: number,
    gender: "male" | "female",
    age: number,
    goal: "maintain" | "loseWeight" | "gainWeight" | "gainMuscle" = "maintain"
  ) {
    // 1. Điều chỉnh theo mục tiêu
    let targetCalories = tdee;
    if (goal === "loseWeight") targetCalories *= 0.85;
    if (goal === "gainWeight") targetCalories *= 1.15;
  
    // 2. Tỷ lệ chính (có thể thay đổi theo mục tiêu)
    const ratio = { carbs: 0.5, protein: 0.25, fat: 0.25 };
  
    // 3. Tính 3 chất sinh năng lượng
    const carbs = Math.round((targetCalories * ratio.carbs) / 4);
    const protein = Math.round((targetCalories * ratio.protein) / 4);
    const fat = Math.round((targetCalories * ratio.fat) / 9);
  
    // 4. Tính thêm fiber (theo khuyến nghị WHO)
    let fiber;
    if (gender === "male") {
      fiber = age > 50 ? 28 : 30; // đơn giản hóa
    } else {
      fiber = age > 50 ? 22 : 25;
    }
  
    // 5. Tính sugar (theo WHO ≤10% calories)
    const sugarCalories = targetCalories * 0.1;
    const sugar = Math.round(sugarCalories / 4);
  
    return {
      calories: Math.round(targetCalories),
      carbs,
      protein,
      fat,
      fiber,
      sugar,
    };
  }
  