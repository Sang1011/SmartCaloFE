export interface RequestBodyHandlePaymentNoti {
    id: number,
    gateway: string,
    transactionDate: string,
    accountNumber: string,
    content: string,
    transferAmount: number,
    referenceCode: string
}

export interface RequestBodyCreatePaymentQRUrl {
    planId: number
}

export interface CreatePaymentQRUrlResponse {
    qrImageUrl: string,
    transactionId: string
}

export interface CheckPaymentStatusReponse {
    paymentStatus: string
    accessToken: string
    refreshToken: string
}