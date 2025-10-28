import { apiClient } from "@services/apiClient";
import { CreateEntryLogRequestBody } from "../../types/tracking";
import { TRACKING_URLS } from "./trackingUrls";

export const trackingApi = {
    trackingDailyLog : (date: string, mealType?: number) => {
        let url = mealType ? TRACKING_URLS.GET_DAILY_LOG + `?date=${date}&mealType=${mealType}` : TRACKING_URLS.GET_DAILY_LOG + `?date=${date}`;
        return apiClient.get(url)
    },
    deleteLogEntry : (entryId: string) => apiClient.delete(TRACKING_URLS.DELETE_LOG_ENTRY + `/${entryId}`),
    createLogEntry : (body: CreateEntryLogRequestBody) => apiClient.post(TRACKING_URLS.CREATE_LOG_ENTRY, body)
}