import { createAsyncThunk, createSlice, PayloadAction } from "@reduxjs/toolkit";
import { MenuResponse } from "../../types/menu";
import { menuApi } from "./menuApi";

// Thunk lấy menu theo ID
export const fetchMenuById = createAsyncThunk<MenuResponse, string>(
  "menu/fetchById",
  async (id, { rejectWithValue }) => {
    try {
      const response = await menuApi.getMenuById(id);
      return response.data as MenuResponse;
    } catch (error: any) {
      return rejectWithValue(
        error.response?.data?.message || "Không thể tải menu"
      );
    }
  }
);

// State ban đầu
interface MenuState {
  data: MenuResponse | null;
  loading: boolean;
  error: string | null;
}

const initialState: MenuState = {
  data: null,
  loading: false,
  error: null,
};

const menuSlice = createSlice({
  name: "menu",
  initialState,
  reducers: {
    clearMenu: (state) => {
      state.data = null;
      state.error = null;
      state.loading = false;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchMenuById.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(
        fetchMenuById.fulfilled,
        (state, action: PayloadAction<MenuResponse>) => {
          state.loading = false;
          state.data = action.payload;
        }
      )
      .addCase(fetchMenuById.rejected, (state, action) => {
        state.loading = false;
        state.error = (action.payload as string) || "Lỗi tải menu";
      });
  },
});

export const { clearMenu } = menuSlice.actions;
export default menuSlice.reducer;
