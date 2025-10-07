import { getAccessToken } from '@stores';
import type { InternalAxiosRequestConfig } from 'axios';

export const requestInterceptor = {
  onFulfilled: async (config: InternalAxiosRequestConfig) => {
    try {
      const token = await getAccessToken();
      if (token) {
        config.headers.Authorization = `Bearer ${token}`;
      }
       const baseURL = config.baseURL || '';
      const fullURL = baseURL + (config.url || '');
      
      console.log('🔄 API CALL:', {
        method: config.method?.toUpperCase(),
        url: config.url,
        baseURL: config.baseURL,
        fullURL: fullURL,
        headers: config.headers,
        data: config.data
      });

      return config;
    } catch (error) {
      console.error('Error in request interceptor:', error);
      return config;
    }
  },
  onRejected: (error: any) => {
    return Promise.reject(error);
  },
};