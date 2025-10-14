import { createAsyncThunk, createSlice, PayloadAction } from "@reduxjs/toolkit";
import { getAccessToken, saveStringData } from "@stores";
import { userApi } from "./userApi";
import { USER_URLS } from "./userUrls";

// ========== Types ==========
export interface UserDto {
  id: string;
  email: string;
  name: string;
  avatarUrl: string;
  birthday: string;
  weight: number;
  height: number;
  gender: string;
  activityLevel: string;
  dailyCaloGoal: number;
  currentPlanId: number;
  currentSubscriptionExpiresAt: string;
  roles: string[];
}

interface UserState {
  user: UserDto | null;
  loading: boolean;
  error: string | null;
}

// ========== Initial state ==========
const initialState: UserState = {
  user: null,
  loading: false,
  error: null,
};

// ========== Helper ==========
const handleError = (error: any): string => {
  return error?.response?.data?.message || "Lỗi khi tải thông tin người dùng";
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
      return res.data as UserDto;
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
    updateUser(state, action: PayloadAction<UserDto>) {
      state.user = action.payload;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchCurrentUserThunk.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(
        fetchCurrentUserThunk.fulfilled,
        (state, action: PayloadAction<UserDto>) => {
          state.loading = false;
          state.user = action.payload;
          // Optionally lưu tên hoặc ID nếu cần
          saveStringData("userId", action.payload.id);
        }
      )
      .addCase(fetchCurrentUserThunk.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
        state.user = null;
      });
  },
});

export const { clearUser, updateUser } = userSlice.actions;
export default userSlice.reducer;
