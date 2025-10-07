import apiClient from "@services/apiClient";
import { AUTH_URLS } from "./authUrls";
import { loginFacebookRequest, loginGoogleRequest, logoutRequest, RefreshTokenRequest } from "../../types/auth";

export const authApi = {
  googleLogin: ({ idToken }: loginGoogleRequest) =>
    apiClient.post(AUTH_URLS.GOOGLE_LOGIN, { idToken }),
  logout: ({ refreshToken }: logoutRequest) => apiClient.post(AUTH_URLS.LOGOUT, { refreshToken }),
  refresh: ({ accessToken, refreshToken }: RefreshTokenRequest) =>
    apiClient.post(AUTH_URLS.REFRESH_TOKEN, { accessToken, refreshToken }),
  facebookLogin: ({ accessToken }: loginFacebookRequest) =>
    apiClient.post(AUTH_URLS.FACEBOOK_LOGIN, { accessToken }),
};