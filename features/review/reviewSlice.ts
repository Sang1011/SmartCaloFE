import { reviewApi } from "@features/review/reviewApi";
import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import {
  FailedCreateFeedbackResponse,
  FeedbackRequestBody,
  SuccessCreateAndGetBodyResponse,
} from "../../types/review";

export interface ReviewState {
  feedback?: SuccessCreateAndGetBodyResponse | null;
  loading: boolean;
  error?: string | null;
}

const initialState: ReviewState = {
  feedback: null,
  loading: false,
  error: null,
};

/**
 * 📨 Gửi feedback mới
 */
export const createFeedbackThunk = createAsyncThunk<
  SuccessCreateAndGetBodyResponse,
  FeedbackRequestBody,
  { rejectValue: FailedCreateFeedbackResponse | string }
>(
  "review/createFeedback",
  async (body, { rejectWithValue }) => {
    try {
      const response = await reviewApi.createFeedBack(body);
      return response.data as SuccessCreateAndGetBodyResponse;
    } catch (err: any) {
      const errorResponse = err.response?.data;
      if (errorResponse?.detail) return rejectWithValue(errorResponse);
      return rejectWithValue(err.message);
    }
  }
);

/**
 * 🔍 Lấy feedback hiện tại của user
 */
export const getCurrentUserFeedbackThunk = createAsyncThunk<
  SuccessCreateAndGetBodyResponse,
  void,
  { rejectValue: string }
>(
  "review/getCurrentUserFeedback",
  async (_, { rejectWithValue }) => {
    try {
      const response = await reviewApi.getCurrentUserFeedback();
      return response.data as SuccessCreateAndGetBodyResponse;
    } catch (err: any) {
      return rejectWithValue(err.response?.data?.detail || err.message);
    }
  }
);

/**
 * ❌ Xoá feedback của user hiện tại
 */
export const deleteFeedbackThunk = createAsyncThunk<
  void, // Không cần payload trả về
  void, // Không cần truyền tham số
  { rejectValue: string }
>(
  "review/deleteFeedback",
  async (_, { rejectWithValue }) => {
    try {
      await reviewApi.deleteFeedback();
      return;
    } catch (err: any) {
      return rejectWithValue(err.response?.data?.detail || err.message);
    }
  }
);


const reviewSlice = createSlice({
  name: "review",
  initialState,
  reducers: {
    resetReviewState: (state) => {
      state.feedback = null;
      state.error = null;
      state.loading = false;
    },
  },
  extraReducers: (builder) => {
    // 🧭 Create Feedback
    builder
      .addCase(createFeedbackThunk.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(createFeedbackThunk.fulfilled, (state, action) => {
        state.loading = false;
        state.feedback = action.payload;
      })
      .addCase(createFeedbackThunk.rejected, (state, action) => {
        state.loading = false;
        state.error =
          typeof action.payload === "string"
            ? action.payload
            : action.payload?.detail || "Create feedback failed";
      });

    // 🧭 Get Current User Feedback
    builder
      .addCase(getCurrentUserFeedbackThunk.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(getCurrentUserFeedbackThunk.fulfilled, (state, action) => {
        state.loading = false;
        state.feedback = action.payload;
      })
      .addCase(getCurrentUserFeedbackThunk.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload || "Failed to load feedback";
      });

    // 🧭 Delete Feedback
    builder
      .addCase(deleteFeedbackThunk.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(deleteFeedbackThunk.fulfilled, (state) => {
        state.loading = false;
        state.feedback = null; // Xoá feedback khỏi state sau khi xoá thành công
      })
      .addCase(deleteFeedbackThunk.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload || "Failed to delete feedback";
      });
  },
});

export const { resetReviewState } = reviewSlice.actions;
export default reviewSlice.reducer;
