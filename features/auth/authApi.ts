import apiClient from "@services/apiClient";
import { AUTH_URLS } from "./authUrls";

export const authApi = {
  googleLogin: (idToken: string) =>
    apiClient.post(AUTH_URLS.GOOGLE_LOGIN, { idToken }),
  logout: () => apiClient.post(AUTH_URLS.LOGOUT),
};