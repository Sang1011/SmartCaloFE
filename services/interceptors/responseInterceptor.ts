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

// ✅ Helper: Force logout - chỉ gọi khi thực sự cần
const forceLogout = async (reason: string) => {
  console.warn(`🔒 Force logout: ${reason}`);
  
  isRefreshing = false;
  processQueue(new Error("Session expired"), null);
  
  await deleteTokens();
  
  // ✅ Navigate trực tiếp, KHÔNG emit event
  navigateCustom("/login");
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
    });
  
    return response;
  },
  
  onRejected: async (error: any) => {
    const originalRequest = error.config;
    const url = originalRequest?.url || "";

    console.warn("❌ API ERROR:", {
      url,
      status: error.response?.status,
      message: error.message,
    });

    // 🔥 CASE 1: Refresh token endpoint bị lỗi → RefreshToken hết hạn
    if (url.includes("/auth/refresh")) {
      console.warn("🔒 Refresh token expired → Force logout");
      await forceLogout("Refresh token expired (30 days)");
      return Promise.reject(error);
    }

    // 🔥 CASE 2: Logout endpoint bị lỗi → Ignore, vì đã logout rồi
    if (url.includes("/auth/logout")) {
      console.log("ℹ️ Logout API failed (expected if token expired)");
      return Promise.reject(error);
    }

    // 🔥 CASE 3: 401 Unauthorized → Refresh AccessToken (10 phút)
    if (error.response?.status === 401 && !originalRequest._retry) {
      originalRequest._retry = true;

      // ✅ Nếu đang refresh → đưa vào queue
      if (isRefreshing) {
        console.log("⏳ Request queued, waiting for token refresh...");
        return new Promise((resolve, reject) => {
          failedQueue.push({ resolve, reject });
        })
          .then((token) => {
            originalRequest.headers["Authorization"] = `Bearer ${token}`;
            return axios(originalRequest);
          })
          .catch((err) => {
            // Queue reject → đã logout rồi
            return Promise.reject(err);
          });
      }

      // ✅ Bắt đầu refresh AccessToken
      isRefreshing = true;
      console.log("🔄 AccessToken expired (10 min) → Refreshing...");

      try {
        const accessToken = await getAccessToken();
        const refreshToken = await getRefreshToken();
        
        if (!accessToken || !refreshToken) {
          throw new Error("No tokens available");
        }

        console.log("🔑 Calling refresh API...");
        const res = await authApi.refresh({ accessToken, refreshToken });
        const data = res.data as RefreshTokenResponse;

        if (!data.accessToken || !data.refreshToken) {
          throw new Error("Invalid refresh response");
        }

        // ✅ Lưu token mới (AccessToken mới + RefreshToken mới hoặc giữ nguyên)
        await saveTokens(data.accessToken, data.refreshToken);
        console.log("✅ Token refreshed successfully");
        
        // Process queue với token mới
        processQueue(null, data.accessToken);

        // Retry original request
        originalRequest.headers["Authorization"] = `Bearer ${data.accessToken}`;
        return axios(originalRequest);
        
      } catch (err: any) {
        console.warn("❌ Refresh token failed:", err.message);
        processQueue(err, null);
        
        // ✅ Chỉ logout khi refresh THỰC SỰ fail (RefreshToken hết hạn 30 ngày)
        await forceLogout("Refresh token failed");
        
        return Promise.reject(err);
      } finally {
        isRefreshing = false;
      }
    }

    // 🔥 CASE 4: Các lỗi khác
    return Promise.reject(error);
  },
};