import apiClient from "@services/apiClient";
import { PROGRAMS_URLS } from "./programUrls";

export const programApi = {
  getAllProgram: (
    pageNumber: number,
    pageSize: number,
    orderBy: string,
    isAscending: boolean
  ) => {
    return apiClient.get(
      PROGRAMS_URLS.GET_ALL +
      `?PageIndex=${pageNumber}&PageSize=${pageSize}&OrderBy=${orderBy}&IsAscending=${isAscending}`
    );
  },

  getProgramById: (id: string) => apiClient.get(PROGRAMS_URLS.GET_BY_ID + `/${id}`),
};