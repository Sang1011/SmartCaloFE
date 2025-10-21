// Response gốc
export interface PredictResponse {
    dishes: Dish[];
  }
  
  export interface Dish {
    id: string;                     // uuid
    name: string;                   // tên món
    category: string;               // ví dụ: "Rice Dish"
    description?: string;           // mô tả (có thể thiếu)
    instructions?: string;          // cách làm / hướng dẫn
    cookingTime?: number;           // phút
    servings?: number;              // số phần
    imageUrl?: string;              // url ảnh (chuỗi rỗng nếu không có)
    ingredients: string | string[]; // giữ string như JSON, hoặc có thể là mảng string
    nutritionInfo?: NutritionInfo;  // thông tin dinh dưỡng (có thể thiếu)
    confidence?: number;            // xác suất / confidence score
    matched?: boolean;              // có match hay không
  }
  
  export interface NutritionInfo {
    calories?: number;
    protein?: number; // gram
    carbs?: number;   // gram
    fat?: number;     // gram
    fiber?: number;   // gram
    sugar?: number;   // gram
  }
  