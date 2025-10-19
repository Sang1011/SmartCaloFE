import axios from 'axios';
import { Config } from '../config/config';
import { requestInterceptor } from './interceptors/requestInterceptor';
import { responseInterceptor } from './interceptors/responseInterceptor';

const apiClient = axios.create({
  baseURL: Config.API_URL + "api",
  timeout: 10000,
});

apiClient.interceptors.request.use(requestInterceptor.onFulfilled, requestInterceptor.onRejected);
apiClient.interceptors.response.use(responseInterceptor.onFulfilled, responseInterceptor.onRejected);

export default apiClient;
