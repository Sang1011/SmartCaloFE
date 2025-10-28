import { apiClient } from "@services/apiClient";
import { FeedbackRequestBody } from "../../types/review";
import { REVIEW_URL } from "./reviewUrls";

export const reviewApi = {
    createFeedBack: (body: FeedbackRequestBody) => apiClient.post(REVIEW_URL.CREATE_FEEDBACK, body),
    getCurrentUserFeedback: () => apiClient.get(REVIEW_URL.GET_CURRENT_USER_FEEDBACK),
    deleteFeedback: () => apiClient.delete(REVIEW_URL.DELETE_FEEDBACK)
}