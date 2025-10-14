import { createAsyncThunk, createSlice, PayloadAction } from '@reduxjs/toolkit';
import { Exercise, GetAllExercisesResponse } from '../../types/excercise';
import { excerciseApi } from './excerciseApi'; // Import API methods

/**
 * 1. Định nghĩa Kiểu dữ liệu cho State
 */
export interface ExercisesState {
  allExercises: Exercise[]; // Danh sách tất cả bài tập
  selectedExercise: Exercise | null; // Bài tập được chọn khi gọi getExcerciseById
  loading: boolean;
  error: string | null;
}

const initialState: ExercisesState = {
  allExercises: [],
  selectedExercise: null,
  loading: false,
  error: null,
};

// ------------------------------------------------------------------

/**
 * 2. Định nghĩa Async Thunks
 */

// Async Thunk cho việc lấy tất cả bài tập
export const fetchAllExercises = createAsyncThunk<
  Exercise[], // Kiểu trả về khi fulfilled (chỉ cần mảng Exercise)
  void, // Kiểu đối số đầu vào (không có)
  { rejectValue: string }
>('excercises/fetchAllExercises', async (_, { rejectWithValue }) => {
  try {
    // Gọi API. Giả sử apiClient.get trả về { data: GetAllExercisesResponse }
    const response = await excerciseApi.getAllExcercise();
    
    // Sử dụng Kiểu GetAllExercisesResponse để trích xuất mảng Exercise
    const data = response.data as GetAllExercisesResponse; 
    
    // Trả về mảng bài tập từ trường `exercises.data`
    return data.exercises.data;
  } catch (error) {
    // Xử lý lỗi
    return rejectWithValue('Failed to fetch all exercises.');
  }
});

// Async Thunk cho việc lấy bài tập theo ID
export const fetchExerciseById = createAsyncThunk<
  Exercise, // Kiểu trả về khi fulfilled (đối tượng Exercise)
  string, // Kiểu đối số đầu vào (id)
  { rejectValue: string }
>('excercises/fetchExerciseById', async (id, { rejectWithValue }) => {
  try {
    // Gọi API. Giả sử getExcerciseById trả về trực tiếp đối tượng Exercise
    const response = await excerciseApi.getExcerciseById(id);
    return response.data as Exercise; 
  } catch (error) {
    return rejectWithValue(`Failed to fetch exercise with ID: ${id}.`);
  }
});

// ------------------------------------------------------------------

/**
 * 3. Định nghĩa Slice
 */
export const exercisesSlice = createSlice({
  name: 'excercises',
  initialState,
  reducers: {
    // Reducer đồng bộ để xóa bài tập đang được chọn
    clearSelectedExercise: (state) => {
      state.selectedExercise = null;
    }
  },
  extraReducers: (builder) => {
    // Xử lý fetchAllExercises
    builder
      .addCase(fetchAllExercises.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchAllExercises.fulfilled, (state, action: PayloadAction<Exercise[]>) => {
        state.loading = false;
        // Cập nhật mảng bài tập
        state.allExercises = action.payload; 
      })
      .addCase(fetchAllExercises.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload || 'Unknown error occurred.'; 
      })

    // Xử lý fetchExerciseById
      .addCase(fetchExerciseById.pending, (state) => {
        state.loading = true;
        state.error = null;
        state.selectedExercise = null;
      })
      .addCase(fetchExerciseById.fulfilled, (state, action: PayloadAction<Exercise>) => {
        state.loading = false;
        // Cập nhật bài tập được chọn
        state.selectedExercise = action.payload; 
      })
      .addCase(fetchExerciseById.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload || 'Unknown error occurred.'; 
      });
  },
});

// Export actions và reducer
export const { clearSelectedExercise } = exercisesSlice.actions;
export default exercisesSlice.reducer;