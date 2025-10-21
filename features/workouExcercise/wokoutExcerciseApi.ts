import { apiClient } from "@services/apiClient";
import { WORKOUT_EXCERCISE_URL } from "./workoutExcerciseUrls";
export const workoutExcerciseApi = {
  getAllWorkoutExcercise: (
      workoutId : string,
      pageNumber: number,
      pageSize: number,
      orderBy: string,
      isAscending: boolean
    ) => {
      return apiClient.get(
        WORKOUT_EXCERCISE_URL.GET_ALL_BY_WORKOUT_ID +
        `?WorkoutId=${workoutId}&PageIndex=${pageNumber}&PageSize=${pageSize}&OrderBy=${orderBy}&IsAscending=${isAscending}`
      );
    },
    getWorkoutExcerciseById: (id: string) => apiClient.get(WORKOUT_EXCERCISE_URL.GET_BY_ID + `/${id}`),
};
