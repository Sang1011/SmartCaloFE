export type DishNutrition = {
    calories: number; // Tổng Calo
    protein: number; // Gram Protein
    carbs: number; // Gram Carbohydrate
    fat: number; // Gram Chất béo
    fiber: number; // Gram Chất xơ
    sugar: number; // Gram Đường
  };
  
  export type Dish = {
    id: string;
    name: string; // Tên món ăn
    category: string; // Danh mục món ăn
    description: string; // Mô tả ngắn
    instructions: string; // Hướng dẫn nấu ăn
    cookingTime: number; // Thời gian nấu (phút)
    servings: number; // Số suất ăn
    imageUrl: string; // URL hình ảnh
    ingredients: string; // Danh sách nguyên liệu (có vẻ là một chuỗi)
  } & DishNutrition; // Kế thừa thông tin dinh dưỡng
  
  export type DishPaging = {
    pageIndex: number; // Chỉ mục trang hiện tại
    pageSize: number; // Kích thước trang
    count: number; // Tổng số bản ghi (tổng số món ăn)
    data: Dish[]; // Mảng dữ liệu món ăn trên trang hiện tại
  };
  
  export type GetAllDishesResponse = {
    dishes: DishPaging;
  };