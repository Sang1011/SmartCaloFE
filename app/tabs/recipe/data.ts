// Định nghĩa các Interface cho dữ liệu
export interface NutritionFact {
  label: string;
  amount: string;
  color: string;
}

export interface Dish {
  id: number;
  name: string;
  calories: string;
  carb: string;
  protein: string;
  fat: string;
  image: any;
}

export interface Meal {
  time: string;
  calories: string;
  dishes: Dish[];
}

export interface RecipeDetailData {
  id: number;
  headerImage: any;
  title: string;
  description: string;
  totalWeeklyCalories: string;
  nutritionSummary: NutritionFact[];
  meals: Meal[];
}

// Đường dẫn ảnh header - dùng làm placeholder
const HEADER_IMAGE_PATH = require("../../../assets/images/recipeDetail/recipe_header.png");
// Đường dẫn ảnh dish mẫu
const DISH_IMAGE_1 = require("../../../assets/images/recipeDetail/dish_egg.png");
const DISH_IMAGE_2 = require("../../../assets/images/recipeDetail/dish_sandwich.png");
const DISH_IMAGE_3 = require("../../../assets/images/recipeDetail/dish_chicken.png");

// Dữ liệu mẫu 1 (Eat Clean)
const recipeData1: RecipeDetailData = {
  id: 1,
  headerImage: HEADER_IMAGE_PATH,
  title: "Eat Clean: Văn phòng bận rộn",
  description: "Thực đơn 7 ngày",
  totalWeeklyCalories: "1,150 calo",
  nutritionSummary: [
    { label: "Protein", amount: "650g", color: "#43633E" }, // Xanh lá đậm
    { label: "Carb", amount: "700g", color: "#4B98B7" }, // Xanh dương
    { label: "Fat", amount: "300g", color: "#8E743F" }, // Nâu vàng
  ],
  meals: [
    {
      time: "Buổi sáng",
      calories: "350 calo",
      dishes: [
        {
          id: 101,
          name: "Yến mạch hạt óc chó",
          calories: "Calo: 350",
          carb: "40g Carb",
          protein: "15g Protein",
          fat: "10g Fat",
          image: DISH_IMAGE_1,
        },
      ],
    },
    {
      time: "Buổi trưa",
      calories: "500 calo",
      dishes: [
        {
          id: 102,
          name: "Salad ức gà và rau củ",
          calories: "Calo: 500",
          carb: "30g Carb",
          protein: "45g Protein",
          fat: "15g Fat",
          image: DISH_IMAGE_3,
        },
      ],
    },
  ],
};

// Dữ liệu mẫu 2 (Gymer cường độ cao)
const recipeData2: RecipeDetailData = {
  id: 2,
  headerImage: HEADER_IMAGE_PATH,
  title: "Meal plan chuẩn gym: Tăng cơ, Giảm mỡ",
  description: "Thực đơn 5 ngày",
  totalWeeklyCalories: "1,290 calo",

  nutritionSummary: [
    { label: "Protein", amount: "903g", color: "#43633E" },
    { label: "Carb", amount: "1,358g", color: "#4B98B7" },
    { label: "Chất béo", amount: "434g", color: "#8E743F" },
  ],

  meals: [
    {
      time: "Buổi sáng",
      calories: "240 calo",
      dishes: [
        {
          id: 201,
          name: "Trứng ốp la",
          calories: "Calo: 84",
          carb: "0.9g Carb",
          protein: "6.4g Protein",
          fat: "6.2g Fat",
          image: DISH_IMAGE_1,
        },
        {
          id: 202,
          name: "Bánh mì Sandwich",
          calories: "Calo: 166",
          carb: "25.5g Carb",
          protein: "5g Protein",
          fat: "2.5g Fat",
          image: DISH_IMAGE_2,
        },
      ],
    },
    {
      time: "Buổi trưa",
      calories: "432 calo",
      dishes: [
        {
          id: 203,
          name: "Cơm gạo lứt đỏ & Gà kho sả",
          calories: "Calo: 432",
          carb: "43.6g Carb",
          protein: "28.2g Protein",
          fat: "11.2g Fat",
          image: DISH_IMAGE_3,
        },
      ],
    },
  ],
};

const allRecipeDetailData: RecipeDetailData[] = [recipeData1, recipeData2];

/**
 * Hàm tìm kiếm dữ liệu công thức dựa trên ID.
 */
export const findRecipeDetailData = (
  id: number
): RecipeDetailData | undefined => {
  return allRecipeDetailData.find((recipe) => recipe.id === id);
};
