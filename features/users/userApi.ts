import { apiClient } from "@services/apiClient";
import { UpdateProfileDto } from "../../types/me";
import { USER_URLS } from "./userUrls";


export const userApi = {
  me: () => apiClient.get(USER_URLS.ME),
  updateProfile: (body: UpdateProfileDto) => apiClient.put(USER_URLS.UPDATE_PROFILE, body)
};