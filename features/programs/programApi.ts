import apiClient from "@services/apiClient";
import { PROGRAMS_URLS } from "./programUrls";

export const programApi = {
  getAllProgram: () => apiClient.get(PROGRAMS_URLS.GET_ALL),
  getProgramById: (id: string) => apiClient.get(PROGRAMS_URLS.GET_BY_ID + `/${id}`),
};