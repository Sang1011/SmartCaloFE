import apiClient from "@services/apiClient";
import { MENU_URLS } from "./menuUrls";
export const menuApi = {
  getMenuByIdAndDayNumber: (menuId: string, dayNumber: number) => apiClient.get(MENU_URLS.GET_BY_ID_AND_DAY + `/${menuId}/day/${dayNumber}`),
  // getMenuByDailyCalo: ()
};