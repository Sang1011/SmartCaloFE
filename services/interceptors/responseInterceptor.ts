import { AxiosResponse } from 'axios';

export const responseInterceptor = {
  onFulfilled: (response: AxiosResponse) => {
    return response.data;
  },
  onRejected: async (error: any) => {
    if (error.response?.status === 401) {
      console.warn('Token hết hạn, cần đăng nhập lại');
    }
    return Promise.reject(error);
  },
};
