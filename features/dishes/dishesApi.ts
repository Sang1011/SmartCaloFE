import apiClient from "@services/apiClient";
import { DISHES_URLS } from "./dishesUrls";
export const dishApi = {
  getAllDish: (pageIndex: number, pageSize: number) => {
    return apiClient.get(DISHES_URLS.GET_ALL_DISHES + `?PageIndex=${pageIndex}&PageSize=${pageSize}`)
  },
  getDishById: (id: string) => apiClient.get(DISHES_URLS.GET_BY_ID + `/${id}`),
};