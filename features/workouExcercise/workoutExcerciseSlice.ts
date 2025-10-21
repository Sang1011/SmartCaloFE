import { createAsyncThunk, createSlice, PayloadAction } from '@reduxjs/toolkit';
import { WorkoutExcerciseDTO, WorkoutExcerciseListReponse, WorkoutExcerciseReponse } from '../../types/workoutExcercise';
import { workoutExcerciseApi } from './wokoutExcerciseApi';
// --- Async Thunks ---

/**
 * Fetches the list of all workoutexcercise for a specific program.
 * Note: createAsyncThunk is often provided the types:
 * <return type, argument type, thunk API config>
 */
export const fetchWorkoutsExcericeByWorkout = createAsyncThunk<
    WorkoutExcerciseListReponse, // What the thunk returns (on success)
    {
        workoutId: string;
        pageNumber?: number;
        pageSize?: number;
        orderBy?: string;
        isAscending?: boolean;
    }, // What the thunk accepts as arguments
    { rejectValue: string } // Optional: Type for the rejected value (error message)
>(
    'workout-excercise/fetchWorkoutsExcericeByWorkout',
    async (args, { rejectWithValue }) => {
        try {
            const {
                workoutId,
                pageNumber = 1,      // Default value applied here
                pageSize = 10,       // Example default for pageSize
                orderBy = 'CreatedAt',
                isAscending = false,
            } = args;

            const response = await workoutExcerciseApi.getAllWorkoutExcercise(
                workoutId,
                pageNumber,
                pageSize,
                orderBy,
                isAscending
            );
            return response.data.exercises as WorkoutExcerciseListReponse; // Adjust based on how apiClient handles response data
        } catch (error) {
            // A common pattern to get a readable error message
            const errorMessage = (error as any)?.message || 'Failed to fetch workoutExcercises';
            return rejectWithValue(errorMessage);
        }
    }
);

/**
 * Fetches a single workout by its ID.
 */
export const fetchWorkoutExcericeById = createAsyncThunk<
WorkoutExcerciseDTO, // What the thunk returns (on success) - just the WorkoutDTO from WorkoutReponse
    string, // What the thunk accepts as arguments (id: string)
    { rejectValue: string }
>(
    'workout-excercise/fetchWorkoutExcericseById',
    async (id, { rejectWithValue }) => {
        try {
            const response = await workoutExcerciseApi.getWorkoutExcerciseById(id);
            // Assuming the API returns { workout: WorkoutDTO } as per your type
            return (response.data as WorkoutExcerciseReponse).excercise;
        } catch (error) {
            const errorMessage = (error as any)?.message || 'Failed to fetch workoutExcercises details';
            return rejectWithValue(errorMessage);
        }
    }
);


// --- State Interface ---

export interface WorkoutState {
    workoutExcercise: WorkoutExcerciseDTO[]; // List of workoutexcercise for the current program view
    currentWorkoutExcercise: WorkoutExcerciseDTO | null; // The single workout being viewed
    listLoading: boolean;
    detailsLoading: boolean;
    listError: string | null;
    detailsError: string | null;
}

// --- Initial State ---

const initialState: WorkoutState = {
    workoutExcercise: [],
    currentWorkoutExcercise: null,
    listLoading: false,
    detailsLoading: false,
    listError: null,
    detailsError: null,
};

// --- Slice Definition ---

export const workoutExcerciseSlice = createSlice({
    name: 'workout-excercise',
    initialState,
    reducers: {
        clearCurrentWorkoutExcercise: (state) => {
            state.currentWorkoutExcercise = null;
            state.detailsError = null;
        },
        clearWorkoutExcerciseList: (state) => {
            state.workoutExcercise = [];
            state.listError = null;
        }
    },
    extraReducers: (builder) => {
        // --- Reducers for fetchWorkoutsExcericeByWorkout ---
        builder
            .addCase(fetchWorkoutsExcericeByWorkout.pending, (state) => {
                state.listLoading = true;
                state.listError = null;
            })
            .addCase(fetchWorkoutsExcericeByWorkout.fulfilled, (state, action: PayloadAction<WorkoutExcerciseListReponse>) => {
                state.listLoading = false;
                state.listError = null;
                state.workoutExcercise = action.payload.data;
            })
            .addCase(fetchWorkoutsExcericeByWorkout.rejected, (state, action) => {
                state.listLoading = false;
                // action.payload contains the string we returned from rejectWithValue
                state.listError = action.payload || 'Failed to fetch workout list';
                state.workoutExcercise = [];
            })
            
        // --- Reducers for fetchWorkoutExcericeById ---
            .addCase(fetchWorkoutExcericeById.pending, (state) => {
                state.detailsLoading = true;
                state.detailsError = null;
                state.currentWorkoutExcercise = null;
            })
            .addCase(fetchWorkoutExcericeById.fulfilled, (state, action: PayloadAction<WorkoutExcerciseDTO>) => {
                state.detailsLoading = false;
                state.detailsError = null;
                state.currentWorkoutExcercise = action.payload;
            })
            .addCase(fetchWorkoutExcericeById.rejected, (state, action) => {
                state.detailsLoading = false;
                // action.payload contains the string we returned from rejectWithValue
                state.detailsError = action.payload || 'Failed to fetch workout details';
                state.currentWorkoutExcercise = null;
            });
    },
});

// Export the actions and reducer
export const { clearCurrentWorkoutExcercise, clearWorkoutExcerciseList } = workoutExcerciseSlice.actions;

export default workoutExcerciseSlice.reducer;