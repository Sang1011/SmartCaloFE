import { createAsyncThunk, createSlice, PayloadAction } from "@reduxjs/toolkit";
import apiClient from "@services/apiClient";
import { SUBCRIPTION_URLS } from "./subscriptionUrls";

// ========== Types ==========
export interface SubcriptionPlan {
  id: number;
  planName: string;
  price: number;
  durationInDays: number;
}

interface SubcriptionState {
  subscriptionPlans: SubcriptionPlan[];
  loading: boolean;
  error: string | null;
}

// ========== Initial state ==========
const initialState: SubcriptionState = {
  subscriptionPlans: [],
  loading: false,
  error: null,
};

// ========== Helper ==========
const handleError = (error: any): string => {
  return error?.response?.data?.message || "Lỗi khi tải thông tin subscriptions";
};

// ========== Thunks ==========
export const fetchAllSubscriptions = createAsyncThunk<
  SubcriptionPlan[], // Return type
  void,              // Thunk arg type
  { rejectValue: string } // Reject type
>(
  "subscription/fetchAll",
  async (_, { rejectWithValue }) => {
    try {
      const response = await apiClient.get(SUBCRIPTION_URLS.GET_ALL_SUBCRIPTIONS);
      // Lấy mảng subscriptionPlans từ response
      return response.data.subscriptionPlans as SubcriptionPlan[];
    } catch (err: any) {
      return rejectWithValue(handleError(err));
    }
  }
);

// ========== Slice ==========
const subscriptionSlice = createSlice({
  name: "subscription",
  initialState,
  reducers: {
    clearSubscriptions(state) {
      state.subscriptionPlans = [];
      state.error = null;
      state.loading = false;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchAllSubscriptions.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(
        fetchAllSubscriptions.fulfilled,
        (state, action: PayloadAction<SubcriptionPlan[]>) => {
          state.loading = false;
          state.subscriptionPlans = action.payload;
        }
      )
      .addCase(fetchAllSubscriptions.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload || "Unknown error";
      });
  },
});

export const { clearSubscriptions } = subscriptionSlice.actions;
export default subscriptionSlice.reducer;