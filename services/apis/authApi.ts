import apiClient from '../apiClient';
import { AUTH_URLS } from '../urls';

export const authApi = {
  login: (data : any) => apiClient.post(AUTH_URLS.LOGIN, data),
  register: (data : any) => apiClient.post(AUTH_URLS.REGISTER, data),
  logout: () => apiClient.post(AUTH_URLS.LOGOUT),
};