import type { InternalAxiosRequestConfig } from 'axios';

export const requestInterceptor = {
  onFulfilled: (config: InternalAxiosRequestConfig) => {
    // LẤY_TOKEN_TỪ_ASYNCSTORAGE_HOẶC_REDUX
    const token = 'token_test';
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  onRejected: (error: any) => {
    return Promise.reject(error);
  },
};
