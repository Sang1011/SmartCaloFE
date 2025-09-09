import axios from 'axios';
import { requestInterceptor } from './interceptors/requestInterceptor';
import { responseInterceptor } from './interceptors/responseInterceptor';
import Config from 'react-native-config';

const apiClient = axios.create({
  baseURL: Config.API_URL,
  timeout: 10000,
});

apiClient.interceptors.request.use(requestInterceptor.onFulfilled, requestInterceptor.onRejected);
apiClient.interceptors.response.use(responseInterceptor.onFulfilled, responseInterceptor.onRejected);

export default apiClient;
