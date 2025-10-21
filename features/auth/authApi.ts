import { apiClient } from "@services/apiClient";
import { ForgotPasswordRequest, LoginFacebookRequest, LoginGoogleRequest, LoginRequest, LogoutRequest, RefreshTokenRequest, RegisterRequest, ResetPasswordRequest, VerifyOTPRequest } from "../../types/auth";
import { AUTH_URLS } from "./authUrls";

export const authApi = {
  googleLogin: ({ idToken }: LoginGoogleRequest) =>
    apiClient.post(AUTH_URLS.GOOGLE_LOGIN, { idToken }),
  logout: ({ refreshToken }: LogoutRequest) => apiClient.post(AUTH_URLS.LOGOUT, { refreshToken }),
  refresh: ({ accessToken, refreshToken }: RefreshTokenRequest) =>
    apiClient.post(AUTH_URLS.REFRESH_TOKEN, { accessToken, refreshToken }),
  facebookLogin: ({ accessToken }: LoginFacebookRequest) =>
    apiClient.post(AUTH_URLS.FACEBOOK_LOGIN, { accessToken }),
  verifyOTP: ({ email, otp }: VerifyOTPRequest) => apiClient.post(AUTH_URLS.VERIFY_OTP, { email, otp }),
  resetPassword: ({resetToken, newPassword} : ResetPasswordRequest) => apiClient.post(AUTH_URLS.RESET_PASS, {resetToken, newPassword}),
  forgotPassword: ({email}: ForgotPasswordRequest) => apiClient.post(AUTH_URLS.FORGOT_PASS, {email}),
  register: ({email, password, name} :RegisterRequest) => apiClient.post(AUTH_URLS.REGISTER, {email, password, name}),
  login: ({email, password}: LoginRequest) => apiClient.post(AUTH_URLS.LOGIN, {email, password})
};