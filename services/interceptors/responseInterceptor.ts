import { authApi } from "@features/auth";
import { deleteTokens, getAccessToken, getRefreshToken, saveTokens } from "@stores";
import { navigateCustom } from "@utils/navigation";
import axios, { AxiosResponse } from "axios";
import { RefreshTokenResponse } from "../../types/auth";

let isRefreshing = false;
let failedQueue: any[] = [];

const processQueue = (error: any, token: string | null = null) => {
  failedQueue.forEach((prom) => {
    if (error) prom.reject(error);
    else prom.resolve(token);
  });
  failedQueue = [];
};

export const responseInterceptor = {
  onFulfilled: (response: AxiosResponse) => {
    const baseURL = response.config.baseURL || "";
    const url = response.config.url || "";

    console.log("✅ API SUCCESS:", {
      url: url,
      baseURL: baseURL,
      fullURL: baseURL + url,
      status: response.status,
      data: response.data,
    });

    return response;
  },

  onRejected: async (error: any) => {
    const originalRequest = error.config;
    const baseURL = originalRequest?.baseURL || "";
    const url = originalRequest?.url || "";

    // 🧱 Nếu lỗi nằm ở route refresh => không retry nữa
    if (url.includes("/auth/refresh")) {
      console.warn("🔒 Refresh token đã hết hạn hoặc không hợp lệ -> logout");
      await deleteTokens(); // xoá token
      navigateCustom("/login");
      return Promise.reject(error);
    }

    console.log("❌ API ERROR:", {
      url: url,
      baseURL: baseURL,
      fullURL: baseURL + url,
      method: originalRequest?.method?.toUpperCase(),
      status: error.response?.status,
      data: error.response?.data,
      message: error.message,
    });

    if (error.response?.status === 401 && !originalRequest._retry) {
      // 🔁 tránh lặp vô hạn
      originalRequest._retry = true;

      if (isRefreshing) {
        // ⏳ Nếu đang refresh, đợi token mới
        return new Promise((resolve, reject) => {
          failedQueue.push({ resolve, reject });
        })
          .then((token) => {
            originalRequest.headers["Authorization"] = `Bearer ${token}`;
            return axios(originalRequest);
          })
          .catch((err) => Promise.reject(err));
      }

      isRefreshing = true;

      try {
        const accessToken = await getAccessToken();
        const refreshToken = await getRefreshToken();
        if (!accessToken || !refreshToken) throw new Error("No token available");

        // 🔄 Gọi API refresh token
        const res = await authApi.refresh({ accessToken, refreshToken });
        const data = res.data as RefreshTokenResponse;

        // 💾 Lưu token mới
        await saveTokens(data.accessToken, data.refreshToken);

        // ✅ Gửi lại các request bị treo
        processQueue(null, data.accessToken);

        // 🔁 Retry request cũ
        originalRequest.headers["Authorization"] = `Bearer ${data.accessToken}`;
        return axios(originalRequest);
      } catch (err) {
        processQueue(err, null);
        return Promise.reject(err);
      } finally {
        isRefreshing = false;
      }
    }

    return Promise.reject(error);
  },
};
