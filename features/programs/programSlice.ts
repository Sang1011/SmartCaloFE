import { createAsyncThunk, createSlice, PayloadAction } from '@reduxjs/toolkit';
import { Program, ProgramResponseApiAll } from '../../types/program';
import { programApi } from './programApi';
import { PROGRAMS_URLS } from './programUrls';

/**
 * 1. Định nghĩa Kiểu dữ liệu cho State
 */
export interface ProgramsState {
  allPrograms: Program[]; // Danh sách tất cả chương trình
  selectedProgram: Program | null; // Chương trình được chọn khi gọi getProgramById
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
type FetchAllProgramsParams = {
  pageIndex?: number;
  pageSize?: number;
  orderBy?: string;
  isAscending?: boolean;
};

export const fetchAllPrograms = createAsyncThunk<
  ProgramResponseApiAll,       // kiểu dữ liệu trả về
  FetchAllProgramsParams | undefined, // kiểu đầu vào
  { rejectValue: string }      // kiểu lỗi trả về
>(
  PROGRAMS_URLS.GET_ALL,
  async (params = {}, { rejectWithValue }) => {
    try {
      const {
        pageIndex = 1,
        pageSize = 10,
        orderBy = "CreatedAt",
        isAscending = false,
      } = params;

      const response = await programApi.getAllProgram(
        pageIndex,
        pageSize,
        orderBy,
        isAscending,
      );

      return response.data as ProgramResponseApiAll;
    } catch (error) {
      console.error("❌ Fetch all programs failed:", error);
      return rejectWithValue("Failed to fetch all programs.");
    }
  }
);

// Async Thunk cho việc lấy chương trình theo ID
export const fetchProgramById = createAsyncThunk<
  Program, // Kiểu trả về khi fulfilled (đối tượng ProgramResponse)
  string, // Kiểu đối số đầu vào (id)
  { rejectValue: string }
>('programs/fetchProgramById', async (id, { rejectWithValue }) => {
  try {
    const response = await programApi.getProgramById(id);
    return response.data.program as Program;
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
      .addCase(fetchAllPrograms.fulfilled, (state, action: PayloadAction<ProgramResponseApiAll>) => {
        state.loading = false;
        state.allPrograms = action.payload.programs.data;
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
      .addCase(fetchProgramById.fulfilled, (state, action: PayloadAction<Program>) => {
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