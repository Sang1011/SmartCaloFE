import { createAsyncThunk, createSlice, PayloadAction } from "@reduxjs/toolkit";
import { getAccessToken } from "@stores";
import { AllStatsResponse, UpdateProfileDto, UserDTO, UserStatsDto } from "../../types/me";
import { userApi } from "./userApi";
import { USER_URLS } from "./userUrls";

// ========== State ==========
interface UserState {
  user: UserDTO | null;
  loading: boolean;
  error: string | null;
  allStats: UserStatsDto[] | null
}

// ========== Initial State ==========
const initialState: UserState = {
  user: null,
  loading: false,
  error: null,
  allStats: null
};

// ========== Helper ==========
const handleError = (error: any): string => {
  return error?.response?.data?.message || "Đã xảy ra lỗi, vui lòng thử lại";
};

// ========== Thunks ==========

// ✅ Lấy thông tin người dùng hiện tại
export const fetchCurrentUserThunk = createAsyncThunk(
  USER_URLS.ME,
  async (_, { rejectWithValue }) => {
    try {
      const token = await getAccessToken();
      if (!token) throw new Error("Không có token, vui lòng đăng nhập lại");

      const res = await userApi.me();
      console.log
      return res.data.userProfileDto as UserDTO;
    } catch (err: any) {
      return rejectWithValue(handleError(err));
    }
  }
);

export const getAllStatsThunk = createAsyncThunk(
  USER_URLS.All_HISTORY_STATS,
  async (_, { rejectWithValue }) => {
    try {
      const token = await getAccessToken();
      if (!token) throw new Error("Không có token, vui lòng đăng nhập lại");

      const res = await userApi.allHistoryStats();
      console.log("📊 AllStats API response:", res.data);

      return res.data as AllStatsResponse;
    } catch (err: any) {
      console.warn("❌ getAllStatsThunk error:", err);
      return rejectWithValue(handleError(err));
    }
  }
);

// ✅ Cập nhật thông tin hồ sơ người dùng
export const updateProfileThunk = createAsyncThunk(
  USER_URLS.UPDATE_PROFILE + "/update",
  async (body: UpdateProfileDto, { rejectWithValue }) => {
    try {
      const token = await getAccessToken();
      console.log("UpdateProfileDto BODY", body);
      if (!token) throw new Error("Không có token, vui lòng đăng nhập lại");

      const res = await userApi.updateProfile(body);
      return res.data;
    } catch (err: any) {
      return rejectWithValue(handleError(err));
    }
  }
);

// ❌ Xóa tài khoản người dùng
export const deleteAccountThunk = createAsyncThunk(
  USER_URLS.DELETE_ACCOUNT + "/delete",
  async (userId: string, { rejectWithValue }) => {
    try {
      const token = await getAccessToken();
      if (!token) throw new Error("Không có token, vui lòng đăng nhập lại");

      await userApi.deleteAccount(userId);
      return userId; // Trả về userId vừa bị xóa (đề phòng cần dùng)
    } catch (err: any) {
      return rejectWithValue(handleError(err));
    }
  }
);

// ========== Slice ==========
const userSlice = createSlice({
  name: "user",
  initialState,
  reducers: {
    clearUser(state) {
      state.user = null;
      state.error = null;
      state.loading = false;
    },
    updateUser(state, action: PayloadAction<UserDTO>) {
      state.user = action.payload;
    },
  },
  extraReducers: (builder) => {
    // --- Fetch current user ---
    builder
      .addCase(fetchCurrentUserThunk.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(
        fetchCurrentUserThunk.fulfilled,
        (state, action: PayloadAction<UserDTO>) => {
          state.loading = false;
          state.user = action.payload;
        }
      )
      .addCase(fetchCurrentUserThunk.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
        state.user = null;
      });

    // --- Update profile ---
    builder
      .addCase(updateProfileThunk.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(
        updateProfileThunk.fulfilled,
        (state, action: PayloadAction<{ userDto: UserDTO }>) => {
          state.loading = false;
          state.user = action.payload.userDto;
          console.log("updatedUser", state.user);
        }
      )
      .addCase(updateProfileThunk.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      });

    // --- Get all stats history ---
    builder
      .addCase(getAllStatsThunk.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(
        getAllStatsThunk.fulfilled,
        (state, action: PayloadAction<AllStatsResponse>) => {
          state.loading = false;
          state.allStats = action.payload.userStats
          console.log("✅ Loaded all stats:", action.payload.userStats);
        }
      )
      .addCase(getAllStatsThunk.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      });

    // --- Delete account ---
    builder
      .addCase(deleteAccountThunk.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(deleteAccountThunk.fulfilled, (state) => {
        state.loading = false;
        state.user = null; // Sau khi xóa tài khoản, clear user info
      })
      .addCase(deleteAccountThunk.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      });
  },
});

export const { clearUser, updateUser } = userSlice.actions;
export default userSlice.reducer;
