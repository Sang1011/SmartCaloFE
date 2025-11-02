import { createAsyncThunk, createSlice, PayloadAction } from "@reduxjs/toolkit";
import {
  AdopMenuBodyRequest,
  AdoptCustomMenuResponse,
  MenuDay,
  MenuItemResponse,
} from "../../types/menu";
import { menuApi } from "./menuApi";

interface MenuState {
  listData: MenuItemResponse[] | null;
  menuByUserId: MenuItemResponse | null;
  data: MenuDay | null;
  adoptedMenu: AdoptCustomMenuResponse | null;
  loading: boolean;
  error: string | null;
  editedMenuDays: Record<number, MenuDay>; // ✅ dùng object thay vì Map
  hasUnsavedChanges: boolean;
}

const initialState: MenuState = {
  menuByUserId: null,
  data: null,
  listData: [],
  adoptedMenu: null,
  loading: false,
  error: null,
  editedMenuDays: {},
  hasUnsavedChanges: false,
};

// ==================== ASYNC THUNKS ====================

export const fetchMenuByIdAndDay = createAsyncThunk<
  MenuDay,
  { menuId: string; dayNumber: number },
  { rejectValue: string }
>("menu/fetchByIdAndDay", async ({ menuId, dayNumber }, { rejectWithValue }) => {
  try {
    const res = await menuApi.getMenuByIdAndDayNumber(menuId, dayNumber);
    return res.data.menuDayDto as MenuDay;
  } catch (err: any) {
    console.warn("❌ Lỗi fetchMenuByIdAndDay:", err);
    return rejectWithValue(err.response?.data?.message || "Không thể tải menu");
  }
});

export const fetchMenuByDailyCalo = createAsyncThunk<
  MenuItemResponse[],
  { dailyCalo: number },
  { rejectValue: string }
>("menu/fetchByDailyCalo", async ({ dailyCalo }, { rejectWithValue }) => {
  try {
    const res = await menuApi.getMenuByDailyCalo(dailyCalo);
    return res.data as MenuItemResponse[];
  } catch (err: any) {
    console.warn("❌ Lỗi fetchMenuByDailyCalo:", err);
    return rejectWithValue(
      err.response?.data?.message || "Không thể tải menu theo calo"
    );
  }
});

export const fetchMenuByUserId = createAsyncThunk<
  MenuItemResponse,
  { userId: string },
  { rejectValue: string }
>("menu/fetchByUserId", async ({ userId }, { rejectWithValue }) => {
  try {
    const res = await menuApi.getMenuByUserId(userId);
    return res.data.menuSummaryDto as MenuItemResponse;
  } catch (err: any) {
    // console.warn("❌ Lỗi fetchMenuByUserId:", err);
    return rejectWithValue(
      err.response?.data?.message || "Không thể tải menu theo userId"
    );
  }
});

export const adoptCustomMenu = createAsyncThunk<
  AdoptCustomMenuResponse,
  AdopMenuBodyRequest,
  { rejectValue: string }
>("menu/adoptCustomMenu", async (body, { rejectWithValue }) => {
  try {
    const res = await menuApi.adoptCustomMenu(body);
    return res.data;
  } catch (err: any) {
    console.warn("❌ Lỗi adoptCustomMenu:", err);
    return rejectWithValue(
      err.response?.data?.message || "Không thể áp dụng menu tuỳ chỉnh"
    );
  }
});

// ==================== SLICE ====================

const menuSlice = createSlice({
  name: "menu",
  initialState,
  reducers: {
    clearMenu: (state) => {
      state.data = null;
      state.adoptedMenu = null;
      state.error = null;
      state.loading = false;
      state.editedMenuDays = {}; // ✅ reset về object trống
      state.hasUnsavedChanges = false;
    },

    // ✅ Lưu thay đổi của một ngày cụ thể
    saveEditedDay: (
      state,
      action: PayloadAction<{ dayNumber: number; menuDay: MenuDay }>
    ) => {
      const { dayNumber, menuDay } = action.payload;
      state.editedMenuDays[dayNumber] = menuDay; // ✅ object assign
      state.hasUnsavedChanges = true;
    },

    // ✅ Lấy dữ liệu đã chỉnh sửa của một ngày (nếu có)
    loadEditedDay: (state, action: PayloadAction<number>) => {
      const dayNumber = action.payload;
      const editedDay = state.editedMenuDays[dayNumber];
      if (editedDay) {
        state.data = editedDay;
      }
    },

    // ✅ Xóa tất cả thay đổi chưa lưu
    discardChanges: (state) => {
      state.editedMenuDays = {};
      state.hasUnsavedChanges = false;
    },

    // ✅ Đánh dấu là đã lưu thành công
    markChangesSaved: (state) => {
      state.hasUnsavedChanges = false;
    },
  },

  extraReducers: (builder) => {
    // --- fetchMenuByUserId ---
    builder
      .addCase(fetchMenuByUserId.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchMenuByUserId.fulfilled, (state, action) => {
        state.loading = false;
        state.menuByUserId = action.payload;
      })
      .addCase(fetchMenuByUserId.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload || "Không thể tải menu";
      });

    // --- fetchMenuByIdAndDay ---
    builder
      .addCase(fetchMenuByIdAndDay.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchMenuByIdAndDay.fulfilled, (state, action) => {
        state.loading = false;
        const editedDay = state.editedMenuDays[action.payload.dayNumber];
        state.data = editedDay || action.payload;
      })
      .addCase(fetchMenuByIdAndDay.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload || "Không thể tải menu";
      });

    // --- fetchMenuByDailyCalo ---
    builder
      .addCase(fetchMenuByDailyCalo.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchMenuByDailyCalo.fulfilled, (state, action) => {
        state.loading = false;
        state.listData = action.payload;
      })
      .addCase(fetchMenuByDailyCalo.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload || "Không thể tải menu theo calo";
      });

    // --- adoptCustomMenu ---
    builder
      .addCase(adoptCustomMenu.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(adoptCustomMenu.fulfilled, (state, action) => {
        state.loading = false;
        state.adoptedMenu = action.payload;
        state.editedMenuDays = {}; // ✅ clear object
        state.hasUnsavedChanges = false;
      })
      .addCase(adoptCustomMenu.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload || "Không thể áp dụng menu tuỳ chỉnh";
      });
  },
});

export const {
  clearMenu,
  saveEditedDay,
  loadEditedDay,
  discardChanges,
  markChangesSaved,
} = menuSlice.actions;

export default menuSlice.reducer;
