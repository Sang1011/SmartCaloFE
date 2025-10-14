import { createAsyncThunk, createSlice, PayloadAction } from '@reduxjs/toolkit';
import { ProgramResponse, ProgramResponseList } from '../../types/program';
import { programApi } from './programApi'; // Import API methods

/**
 * 1. Định nghĩa Kiểu dữ liệu cho State
 */
export interface ProgramsState {
  allPrograms: ProgramResponse[]; // Danh sách tất cả chương trình
  selectedProgram: ProgramResponse | null; // Chương trình được chọn khi gọi getProgramById
  loading: boolean;
  error: string | null;
}

const initialState: ProgramsState = {
  allPrograms: [],
  selectedProgram: null,
  loading: false,
  error: null,
};

// ------------------------------------------------------------------

/**
 * 2. Định nghĩa Async Thunks
 */

// Async Thunk cho việc lấy tất cả chương trình
export const fetchAllPrograms = createAsyncThunk<
  ProgramResponse[], // Kiểu trả về khi fulfilled (mảng ProgramResponse)
  void, // Kiểu đối số đầu vào (không có)
  { rejectValue: string }
>('programs/fetchAllPrograms', async (_, { rejectWithValue }) => {
  try {
    // Gọi API. Giả sử getAllProgram trả về trực tiếp mảng ProgramResponse
    const response = await programApi.getAllProgram();
    
    // Sử dụng Kiểu ProgramResponseList (mảng ProgramResponse)
    return response.data as ProgramResponseList;
  } catch (error) {
    // Xử lý lỗi
    return rejectWithValue('Failed to fetch all programs.');
  }
});

// Async Thunk cho việc lấy chương trình theo ID
export const fetchProgramById = createAsyncThunk<
  ProgramResponse, // Kiểu trả về khi fulfilled (đối tượng ProgramResponse)
  string, // Kiểu đối số đầu vào (id)
  { rejectValue: string }
>('programs/fetchProgramById', async (id, { rejectWithValue }) => {
  try {
    // Gọi API. Giả sử getProgramById trả về trực tiếp đối tượng ProgramResponse
    const response = await programApi.getProgramById(id);
    return response.data as ProgramResponse; 
  } catch (error) {
    return rejectWithValue(`Failed to fetch program with ID: ${id}.`);
  }
});

// ------------------------------------------------------------------

/**
 * 3. Định nghĩa Slice
 */
export const programsSlice = createSlice({
  name: 'programs',
  initialState,
  reducers: {
    // Reducer đồng bộ để xóa chương trình đang được chọn
    clearSelectedProgram: (state) => {
      state.selectedProgram = null;
    }
  },
  extraReducers: (builder) => {
    // Xử lý fetchAllPrograms
    builder
      .addCase(fetchAllPrograms.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchAllPrograms.fulfilled, (state, action: PayloadAction<ProgramResponse[]>) => {
        state.loading = false;
        // Cập nhật mảng chương trình
        state.allPrograms = action.payload; 
      })
      .addCase(fetchAllPrograms.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload || 'Unknown error occurred.'; 
      })

    // Xử lý fetchProgramById
      .addCase(fetchProgramById.pending, (state) => {
        state.loading = true;
        state.error = null;
        state.selectedProgram = null;
      })
      .addCase(fetchProgramById.fulfilled, (state, action: PayloadAction<ProgramResponse>) => {
        state.loading = false;
        // Cập nhật chương trình được chọn
        state.selectedProgram = action.payload; 
      })
      .addCase(fetchProgramById.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload || 'Unknown error occurred.'; 
      });
  },
});

// Export actions và reducer
export const { clearSelectedProgram } = programsSlice.actions;
export default programsSlice.reducer;