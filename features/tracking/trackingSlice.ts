import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import {
    CreateEntryLogRequestBody,
    CreateLogEntryReponse,
    GetDailyLogResponse,
} from "../../types/tracking";
import { trackingApi } from "./trackingApi";

interface TrackingState {
    dailyLog: GetDailyLogResponse | null; // Log cho màn hình chính (hôm nay)
    weeklyLogs: Record<string, GetDailyLogResponse>; // Log cho cả tuần {date: log}
    loading: boolean;
    weeklyLoading: boolean;
    error: string | null;
}

const initialState: TrackingState = {
    dailyLog: null,
    weeklyLogs: {},
    loading: false,
    weeklyLoading: false,
    error: null,
};

// === Thunks ===
export const getDailyLogThunk = createAsyncThunk<
    GetDailyLogResponse,
    { date: string; mealType?: number },
    { rejectValue: string }
>(
    "tracking/getDailyLog",
    async ({ date, mealType }, { rejectWithValue }) => {
        try {
            const response = mealType
                ? await trackingApi.trackingDailyLog(date, mealType)
                : await trackingApi.trackingDailyLog(date);
            return response.data as GetDailyLogResponse;
        } catch (error: any) {
            return rejectWithValue(
                error?.response?.data?.message || "Lỗi tải nhật ký ngày"
            );
        }
    }
);

// Thunk mới: fetch multiple days cho tuần
export const getWeeklyLogsThunk = createAsyncThunk<
    Record<string, GetDailyLogResponse>,
    string[], // array of ISO date strings
    { rejectValue: string }
>("tracking/getWeeklyLogs", async (dates, { rejectWithValue }) => {
    try {
        const promises = dates.map(date => trackingApi.trackingDailyLog(date));
        const responses = await Promise.all(promises);

        // Tạo object {date: log}
        const weeklyLogs: Record<string, GetDailyLogResponse> = {};
        responses.forEach((response, index) => {
            const dateKey = dates[index].split('T')[0]; // Lấy phần YYYY-MM-DD
            weeklyLogs[dateKey] = response.data as GetDailyLogResponse;
        });
        return weeklyLogs;
    } catch (error: any) {
        return rejectWithValue(error?.response?.data?.message || "Lỗi tải nhật ký tuần");
    }
});

export const deleteLogEntriesBatchThunk = createAsyncThunk<
    void, // Không cần trả về GetDailyLogResponse, sẽ fetch lại sau
    { logEntryIds: string[], date: string, mealType: number },
    { rejectValue: string }
>("tracking/deleteLogEntriesBatch", async ({ logEntryIds, date, mealType }, { dispatch, rejectWithValue }) => {
    try {
        const deletePromises = logEntryIds.map(id =>
            dispatch(deleteLogEntryThunk(id)).unwrap()
        );
        await Promise.all(deletePromises);
        await dispatch(getDailyLogThunk({ date: date, mealType: mealType })).unwrap();
    } catch (error: any) {
        return rejectWithValue(error?.message || "Lỗi xóa hàng loạt log món ăn");
    }
});

export const createLogEntryThunk = createAsyncThunk<
    CreateLogEntryReponse,
    { body: CreateEntryLogRequestBody },
    { rejectValue: string }
>("tracking/createLogEntry", async ({ body }, { rejectWithValue }) => {
    try {
        const response = await trackingApi.createLogEntry(body);
        return response.data as CreateLogEntryReponse;
    } catch (error: any) {
        return rejectWithValue(error?.response?.data?.message || "Lỗi tạo log món ăn");
    }
});

export const deleteLogEntryThunk = createAsyncThunk<
    GetDailyLogResponse,
    string,
    { rejectValue: string }
>("tracking/deleteLogEntry", async (entryId, { rejectWithValue }) => {
    try {
        const response = await trackingApi.deleteLogEntry(entryId);
        return response.data as GetDailyLogResponse;
    } catch (error: any) {
        return rejectWithValue(error?.response?.data?.message || "Lỗi xóa log món ăn");
    }
});

// === Slice ===
const trackingSlice = createSlice({
    name: "tracking",
    initialState,
    reducers: {
        clearTrackingError(state) {
            state.error = null;
        },
    },
    extraReducers: (builder) => {
        builder
            // --- getDailyLogThunk ---
            .addCase(getDailyLogThunk.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(getDailyLogThunk.fulfilled, (state, action) => {
                state.loading = false;
                state.dailyLog = action.payload;
            })
            .addCase(getDailyLogThunk.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload || "Không thể tải nhật ký ngày";
            })

            // --- getWeeklyLogsThunk ---
            .addCase(getWeeklyLogsThunk.pending, (state) => {
                state.weeklyLoading = true;
                state.error = null;
            })
            .addCase(getWeeklyLogsThunk.fulfilled, (state, action) => {
                state.weeklyLoading = false;
                state.weeklyLogs = action.payload;
            })
            .addCase(getWeeklyLogsThunk.rejected, (state, action) => {
                state.weeklyLoading = false;
                state.error = action.payload || "Không thể tải nhật ký tuần";
            })

            // --- createLogEntryThunk ---
            .addCase(createLogEntryThunk.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(createLogEntryThunk.fulfilled, (state, action) => {
                state.loading = false;
            })
            .addCase(createLogEntryThunk.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload || "Không thể tạo log món ăn";
            })

            // --- deleteLogEntryThunk ---
            .addCase(deleteLogEntryThunk.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(deleteLogEntryThunk.fulfilled, (state, action) => {
                state.loading = false;
                state.dailyLog = action.payload;
            })
            .addCase(deleteLogEntryThunk.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload || "Không thể xóa log món ăn";
            })

            // --- deleteLogEntriesBatchThunk ---
            .addCase(deleteLogEntriesBatchThunk.pending, (state) => {
                state.loading = true; // Sử dụng chung loading
                state.error = null;
            })
            .addCase(deleteLogEntriesBatchThunk.fulfilled, (state) => {
                state.loading = false;
                // dailyLog đã được cập nhật bởi getDailyLogThunk
            })
            .addCase(deleteLogEntriesBatchThunk.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload || "Lỗi xóa hàng loạt món ăn";
            });
    },
});

export const { clearTrackingError } = trackingSlice.actions;
export default trackingSlice.reducer;