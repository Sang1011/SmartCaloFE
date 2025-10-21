import { apiClient } from "@services/apiClient";
import { AdopMenuBodyRequest } from "../../types/menu";
import { MENU_URLS } from "./menuUrls";
export const menuApi = {
  getMenuByIdAndDayNumber: (menuId: string, dayNumber: number) => apiClient.get(MENU_URLS.GET_BY_ID_AND_DAY + `/${menuId}/day/${dayNumber}`),
  getMenuByDailyCalo: (dailyCalo: number) => apiClient.get(MENU_URLS.GET_MENU_BY_DAILYCALO + `?dailyCalo=${dailyCalo}`),
  adoptCustomMenu: (body: AdopMenuBodyRequest) => apiClient.post(MENU_URLS.ADOPT_CUSTOM_MENU, body),
  getMenuByUserId: (userId: string) => apiClient.get(MENU_URLS.GET_MENU_BY_USER_ID + `/${userId}`)
};