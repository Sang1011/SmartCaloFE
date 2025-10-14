import apiClient from "@services/apiClient";
import { DISHES_URLS } from "./dishesUrls";
export const dishApi = {
  getAllDish: () => apiClient.get(DISHES_URLS.GET_ALL_DISHES),
  getDishById: (id: string) => apiClient.get(DISHES_URLS.GET_BY_ID + `/${id}`),
};