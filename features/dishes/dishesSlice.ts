import { createAsyncThunk, createSlice, PayloadAction } from '@reduxjs/toolkit';
import { Dish, GetAllDishesResponse } from '../../types/dishes';
import { dishApi } from './dishesApi'; // Import API methods

/**
 * 1. Định nghĩa Kiểu dữ liệu cho State
 */
export interface DishesState {
  allDishes: Dish[]; // Dữ liệu danh sách món ăn đã được trích xuất
  selectedDish: Dish | null; // Món ăn được chọn khi gọi getDishById
  loading: boolean;
  error: string | null;
}

const initialState: DishesState = {
  allDishes: [],
  selectedDish: null,
  loading: false,
  error: null,
};

/**
 * 2. Định nghĩa Async Thunks
 */

// Async Thunk cho việc lấy tất cả món ăn
export const fetchAllDishes = createAsyncThunk<
  Dish[], // Kiểu trả về khi fulfilled (chỉ cần mảng Dish)
  void, // Kiểu đối số đầu vào (không có)
  { rejectValue: string }
>('dishes/fetchAllDishes', async (_, { rejectWithValue }) => {
  try {
    // Gọi API. Giả sử apiClient.get trả về { data: GetAllDishesResponse }
    const response = await dishApi.getAllDish();
    
    // **Sử dụng Kiểu GetAllDishesResponse để trích xuất mảng Dish**
    const data = response.data as GetAllDishesResponse; 
    
    // Trả về mảng món ăn từ trường `dishes.data`
    return data.dishes.data;
  } catch (error) {
    // Xử lý lỗi và trả về rejectWithValue
    return rejectWithValue('Failed to fetch all dishes.');
  }
});

// Async Thunk cho việc lấy món ăn theo ID
export const fetchDishById = createAsyncThunk<
  Dish, // Kiểu trả về khi fulfilled (đối tượng Dish)
  string, // Kiểu đối số đầu vào (id)
  { rejectValue: string }
>('dishes/fetchDishById', async (id, { rejectWithValue }) => {
  try {
    // Gọi API. Giả sử getDishById trả về trực tiếp đối tượng Dish
    const response = await dishApi.getDishById(id);
    return response.data as Dish; 
  } catch (error) {
    return rejectWithValue(`Failed to fetch dish with ID: ${id}.`);
  }
});

/**
 * 3. Định nghĩa Slice
 */
export const dishesSlice = createSlice({
  name: 'dishes',
  initialState,
  reducers: {
    // Reducer đồng bộ để xóa món ăn đang được chọn
    clearSelectedDish: (state) => {
      state.selectedDish = null;
    }
  },
  extraReducers: (builder) => {
    // Xử lý fetchAllDishes
    builder
      .addCase(fetchAllDishes.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchAllDishes.fulfilled, (state, action: PayloadAction<Dish[]>) => {
        state.loading = false;
        // Cập nhật mảng món ăn bằng dữ liệu trích xuất (Dish[])
        state.allDishes = action.payload; 
      })
      .addCase(fetchAllDishes.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload || 'Unknown error occurred.'; 
      })

    // Xử lý fetchDishById
      .addCase(fetchDishById.pending, (state) => {
        state.loading = true;
        state.error = null;
        state.selectedDish = null;
      })
      .addCase(fetchDishById.fulfilled, (state, action: PayloadAction<Dish>) => {
        state.loading = false;
        // Cập nhật món ăn được chọn
        state.selectedDish = action.payload; 
      })
      .addCase(fetchDishById.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload || 'Unknown error occurred.'; 
      });
  },
});

// Export actions và reducer
export const { clearSelectedDish } = dishesSlice.actions;
export default dishesSlice.reducer;