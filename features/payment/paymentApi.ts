import { apiClient } from "@services/apiClient";
import { RequestBodyCreatePaymentQRUrl, RequestBodyHandlePaymentNoti } from "../../types/payment";
import { PAYMENT_URLS } from "./paymentUrls";

export const paymentApi = {
    handleNotiFromSepay: (body : RequestBodyHandlePaymentNoti) => apiClient.post(PAYMENT_URLS.HANDLE_INCOMMING_PAYMENT_NOTI_FROM_SEPAY, body),
    createPaymentQRUrl: (body : RequestBodyCreatePaymentQRUrl) => apiClient.post(PAYMENT_URLS.CREATE_QR_URL, body),
    checkPaymentStatus: (transactionId : string) => apiClient.get(PAYMENT_URLS.GET_PAYMENT_BY_TRANSACTON_ID + `/${transactionId}/status`)
}