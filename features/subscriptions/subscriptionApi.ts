import { apiClient } from "@services/apiClient";
import { SUBCRIPTION_URLS } from "./subscriptionUrls";


export const subcriptionApi = {
  getAllSubcription: () => apiClient.get(SUBCRIPTION_URLS.GET_ALL_SUBCRIPTIONS),
};