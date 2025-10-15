import { AxiosResponse } from 'axios';

export const responseInterceptor = {
  onFulfilled: (response: AxiosResponse) => {
    const baseURL = response.config.baseURL || '';
    const url = response.config.url || '';
    
    console.log('✅ API SUCCESS:', {
      url: url,
      baseURL: baseURL,
      fullURL: baseURL + url,
      status: response.status,
      data: response.data
    });
    return response;
  },
  onRejected: async (error: any) => {
    const config = error.config;
    const baseURL = config?.baseURL || '';
    const url = config?.url || '';
    
    console.log('❌ API ERROR:', {
      url: url,
      baseURL: baseURL,
      fullURL: baseURL + url,
      method: config?.method?.toUpperCase(),
      status: error.response?.status,
      data: error.response?.data,
      message: error.message
    });
    if (error.response?.status === 401) {
      console.warn('Token hết hạn, cần đăng nhập lại');
    }
    return Promise.reject(error);
  },
};
