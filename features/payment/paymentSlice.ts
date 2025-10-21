import { createAsyncThunk, createSlice, PayloadAction } from '@reduxjs/toolkit';
import { CheckPaymentStatusReponse, CreatePaymentQRUrlResponse, RequestBodyCreatePaymentQRUrl } from '../../types/payment';
import { paymentApi } from './paymentApi';

// --- Async Thunks ---

/**
 * Tạo URL QR thanh toán.
 */
export const fetchPaymentQRUrl = createAsyncThunk<
    CreatePaymentQRUrlResponse, // Return type on success
    RequestBodyCreatePaymentQRUrl, // Argument type (planId)
    { rejectValue: string } // Type for the rejected value (error message)
>(
    'payment/fetchPaymentQRUrl',
    async (body, { rejectWithValue }) => {
        try {
            const response = await paymentApi.createPaymentQRUrl(body);
            console.log("REPONSE.DATA", response.data);
            return response.data as CreatePaymentQRUrlResponse;
        } catch (error) {
            const errorMessage = (error as any)?.message || 'Failed to create payment QR URL.';
            return rejectWithValue(errorMessage);
        }
    }
);

/**
 * Kiểm tra trạng thái thanh toán bằng transactionId.
 */
export const fetchPaymentStatus = createAsyncThunk<
    CheckPaymentStatusReponse, // Return type on success
    string, // Argument type (transactionId)
    { rejectValue: string }
>(
    'payment/fetchPaymentStatus',
    async (transactionId, { rejectWithValue }) => {
        try {
            const response = await paymentApi.checkPaymentStatus(transactionId);
            return response.data as CheckPaymentStatusReponse;
        } catch (error) {
            const errorMessage = (error as any)?.message || 'Failed to check payment status.';
            return rejectWithValue(errorMessage);
        }
    }
);


// --- State Interface ---

export interface PaymentState {
    qrImageUrl: string | null;
    transactionId: string | null;
    paymentStatus: string | null; // e.g., 'PENDING', 'PAID', 'FAILED'
    
    qrLoading: boolean;
    statusLoading: boolean;
    
    qrError: string | null;
    statusError: string | null;
}

// --- Initial State ---

const initialState: PaymentState = {
    qrImageUrl: null,
    transactionId: null,
    paymentStatus: null,
    
    qrLoading: false,
    statusLoading: false,
    
    qrError: null,
    statusError: null,
};

// --- Slice Definition ---

export const paymentSlice = createSlice({
    name: 'payment',
    initialState,
    reducers: {
        // Reducer để xóa thông tin thanh toán khi người dùng rời màn hình
        clearPaymentInfo: (state) => {
            state.qrImageUrl = null;
            state.transactionId = null;
            state.paymentStatus = null;
            state.qrError = null;
            state.statusError = null;
        },
    },
    extraReducers: (builder) => {
        // --- Reducers for fetchPaymentQRUrl ---
        builder
            .addCase(fetchPaymentQRUrl.pending, (state) => {
                state.qrLoading = true;
                state.qrError = null;
                // Clear previous status if starting a new payment flow
                state.paymentStatus = null; 
            })
            .addCase(fetchPaymentQRUrl.fulfilled, (state, action: PayloadAction<CreatePaymentQRUrlResponse>) => {
                state.qrLoading = false;
                state.qrImageUrl = action.payload.qrImageUrl;
                state.transactionId = action.payload.transactionId;
            })
            .addCase(fetchPaymentQRUrl.rejected, (state, action) => {
                state.qrLoading = false;
                state.qrError = action.payload || 'Unknown error while generating QR.';
                state.qrImageUrl = null;
                state.transactionId = null;
            })
            
        // --- Reducers for fetchPaymentStatus ---
            .addCase(fetchPaymentStatus.pending, (state) => {
                state.statusLoading = true;
                state.statusError = null;
            })
            .addCase(fetchPaymentStatus.fulfilled, (state, action: PayloadAction<CheckPaymentStatusReponse>) => {
                state.statusLoading = false;
                state.paymentStatus = action.payload.paymentStatus;
            })
            .addCase(fetchPaymentStatus.rejected, (state, action) => {
                state.statusLoading = false;
                state.statusError = action.payload || 'Unknown error while checking status.';
            });
    },
});

// Export actions and reducer
export const { clearPaymentInfo } = paymentSlice.actions;

export default paymentSlice.reducer;