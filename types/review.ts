export interface FeedbackRequestBody {
    rating: number,
    comment: string
}

export interface FailedCreateFeedbackResponse {
        title: string,
        status: number,
        detail: "App review not found for current user.",
        instance: string,
        traceId: string
}

export interface SuccessCreateAndGetBodyResponse {
        id: string,
        userId: string,
        rating: number,
        comment: string,
        updatedAt: string
}