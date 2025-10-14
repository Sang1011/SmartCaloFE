import apiClient from "@services/apiClient";
import { EXCERCISE_URLS } from "./excerciseUrls";
export const excerciseApi = {
  getAllExcercise: () => apiClient.get(EXCERCISE_URLS.GET_ALL),
  getExcerciseById: (id: string) => apiClient.get(EXCERCISE_URLS.GET_BY_ID + `/${id}`),
};