import { apiClient } from "@services/apiClient";
import { WORKOUT_URLS } from "./workoutUrls";

export const workoutApi = {
  getAllWorkout: (
      programId : string,
      pageNumber: number,
      pageSize: number,
      orderBy: string,
      isAscending: boolean
    ) => {
      return apiClient.get(
        WORKOUT_URLS.GET_ALL_BY_PROGRAM_ID +
        `?ProgramId=${programId}&PageIndex=${pageNumber}&PageSize=${pageSize}&OrderBy=${orderBy}&IsAscending=${isAscending}`
      );
    },
    getWorkoutById: (id: string) => apiClient.get(WORKOUT_URLS.GET_BY_ID + `/${id}`),
};
