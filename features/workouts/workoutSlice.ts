import { createAsyncThunk, createSlice, PayloadAction } from '@reduxjs/toolkit';
import { WorkoutDTO, WorkoutListResponse, WorkoutReponse } from '../../types/workout';
import { workoutApi } from './workoutApi';
// --- Async Thunks ---

/**
 * Fetches the list of all workouts for a specific program.
 * Note: createAsyncThunk is often provided the types:
 * <return type, argument type, thunk API config>
 */
export const fetchWorkoutsByProgram = createAsyncThunk<
    WorkoutListResponse, // What the thunk returns (on success)
    {
        programId: string;
        pageNumber?: number;
        pageSize?: number;
        orderBy?: string;
        isAscending?: boolean;
    }, // What the thunk accepts as arguments
    { rejectValue: string } // Optional: Type for the rejected value (error message)
>(
    'workout/fetchWorkoutsByProgram',
    async (args, { rejectWithValue }) => {
        try {
            const {
                programId,
                pageNumber = 1,      // Default value applied here
                pageSize = 10,       // Example default for pageSize
                orderBy = 'Name',
                isAscending = true,
            } = args;
            const response = await workoutApi.getAllWorkout(
                programId,
                pageNumber,
                pageSize,
                orderBy,
                isAscending
            );
            return response.data.workouts as WorkoutListResponse; // Adjust based on how apiClient handles response data
        } catch (error) {
            // A common pattern to get a readable error message
            const errorMessage = (error as any)?.message || 'Failed to fetch workouts';
            return rejectWithValue(errorMessage);
        }
    }
);

/**
 * Fetches a single workout by its ID.
 */
export const fetchWorkoutById = createAsyncThunk<
    WorkoutDTO, // What the thunk returns (on success) - just the WorkoutDTO from WorkoutReponse
    string, // What the thunk accepts as arguments (id: string)
    { rejectValue: string }
>(
    'workout/fetchWorkoutById',
    async (id, { rejectWithValue }) => {
        try {
            const response = await workoutApi.getWorkoutById(id);
            console.log("response.data", response.data);
            // Assuming the API returns { workout: WorkoutDTO } as per your type
            return (response.data as WorkoutReponse).workout;
        } catch (error) {
            const errorMessage = (error as any)?.message || 'Failed to fetch workout details';
            return rejectWithValue(errorMessage);
        }
    }
);


// --- State Interface ---

export interface WorkoutState {
    workouts: WorkoutDTO[]; // List of workouts for the current program view
    currentWorkout: WorkoutDTO | null; // The single workout being viewed
    listLoading: boolean;
    detailsLoading: boolean;
    listError: string | null;
    detailsError: string | null;
}

// --- Initial State ---

const initialState: WorkoutState = {
    workouts: [],
    currentWorkout: null,
    listLoading: false,
    detailsLoading: false,
    listError: null,
    detailsError: null,
};

// --- Slice Definition ---

export const workoutSlice = createSlice({
    name: 'workout',
    initialState,
    reducers: {
        clearCurrentWorkout: (state) => {
            state.currentWorkout = null;
            state.detailsError = null;
        },
        clearWorkoutList: (state) => {
            state.workouts = [];
            state.listError = null;
        }
    },
    extraReducers: (builder) => {
        // --- Reducers for fetchWorkoutsByProgram ---
        builder
            .addCase(fetchWorkoutsByProgram.pending, (state) => {
                state.listLoading = true;
                state.listError = null;
            })
            .addCase(fetchWorkoutsByProgram.fulfilled, (state, action: PayloadAction<WorkoutListResponse>) => {
                state.listLoading = false;
                state.listError = null;
                state.workouts = action.payload.data;
            })
            .addCase(fetchWorkoutsByProgram.rejected, (state, action) => {
                state.listLoading = false;
                // action.payload contains the string we returned from rejectWithValue
                state.listError = action.payload || 'Failed to fetch workout list';
                state.workouts = [];
            })
            
        // --- Reducers for fetchWorkoutById ---
            .addCase(fetchWorkoutById.pending, (state) => {
                state.detailsLoading = true;
                state.detailsError = null;
                state.currentWorkout = null;
            })
            .addCase(fetchWorkoutById.fulfilled, (state, action: PayloadAction<WorkoutDTO>) => {
                state.detailsLoading = false;
                state.detailsError = null;
                state.currentWorkout = action.payload;
            })
            .addCase(fetchWorkoutById.rejected, (state, action) => {
                state.detailsLoading = false;
                // action.payload contains the string we returned from rejectWithValue
                state.detailsError = action.payload || 'Failed to fetch workout details';
                state.currentWorkout = null;
            });
    },
});

// Export the actions and reducer
export const { clearCurrentWorkout, clearWorkoutList } = workoutSlice.actions;

export default workoutSlice.reducer;