import apiClient from "@services/apiClient";
import { USER_URLS } from "./userUrls";


export const userApi = {
  me: () => apiClient.get(USER_URLS.ME),
};