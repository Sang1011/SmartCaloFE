import axios from 'axios';
import { Config } from '../config/config';
import { requestInterceptor } from './interceptors/requestInterceptor';
import { responseInterceptor } from './interceptors/responseInterceptor';

export const apiClient = axios.create({
  baseURL: Config.API_URL + "api",
  timeout: 80000,
});

export const apiClientFoodPrediction = axios.create({
  baseURL: Config.API_PREDICTION_AI_URL,
  timeout: 80000,
});

apiClient.interceptors.request.use(requestInterceptor.onFulfilled, requestInterceptor.onRejected);
apiClient.interceptors.response.use(responseInterceptor.onFulfilled, responseInterceptor.onRejected);
apiClientFoodPrediction.interceptors.request.use(requestInterceptor.onFulfilled, requestInterceptor.onRejected);
apiClientFoodPrediction.interceptors.response.use(responseInterceptor.onFulfilled, responseInterceptor.onRejected);

