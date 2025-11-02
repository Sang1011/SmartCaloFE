import { HAS_LOGGED_IN, HAS_OPENED_APP } from "@constants/app";
import { createAsyncThunk, createSlice, PayloadAction } from "@reduxjs/toolkit";
import {
    deleteTokens,
    getAccessToken,
    getRefreshToken,
    saveBooleanData,
    saveTokens
} from "@stores";
import {
    ForgotPasswordRequest,
    LoginGoogleRequest,
    LoginGoogleResponse,
    LoginRequest,
    RefreshTokenResponse,
    RegisterANDLoginResponse,
    RegisterRequest,
    ResetPasswordRequest,
    VerifyOTPRequest,
} from "../../types/auth";
import { UserDTOLogin } from "../../types/me";
import { authApi } from "./authApi";
import { AUTH_URLS } from "./authUrls";

interface AuthState {
    loading: boolean;
    error: string | null;
    isNewUser?: boolean;
    user?: UserDTOLogin | null;
    resetToken: string;
}

const initialState: AuthState = {
    loading: false,
    error: null,
    user: null,
    resetToken: "",
};

// ======================== Helper function ========================

const handleAuthError = (error: any): string => {
    return error?.response?.data?.message || error.message || "Authentication failed";
};

const decodeToken = (token: string) => {
    try {
        let payloadBase64 = token.split(".")[1]; 

        if (!payloadBase64) {
            return null; 
        }
        
        payloadBase64 = payloadBase64.replace(/-/g, '+').replace(/_/g, '/');
        
        while (payloadBase64.length % 4) {
            payloadBase64 += '=';
        }

        const payloadString = atob(payloadBase64);
        const payload = JSON.parse(payloadString);
        
        return payload;
        
    } catch {
        return null; 
    }
};

// ===

export const googleLoginThunk = createAsyncThunk(
    AUTH_URLS.GOOGLE_LOGIN,
    async ({ idToken }: LoginGoogleRequest, { rejectWithValue }) => {
        try {
            const res = await authApi.googleLogin({ idToken });
            
            // ✅ AWAIT async storage operations
            await saveTokens(res.data.accessToken, res.data.refreshToken);
            await saveBooleanData(HAS_OPENED_APP, true);
            await saveBooleanData(HAS_LOGGED_IN, true);
            
            console.log("✅ Google login + storage saved");
            return res.data as LoginGoogleResponse;
        } catch (err: any) {
            return rejectWithValue(handleAuthError(err));
        }
    }
);

export const loginThunk = createAsyncThunk(
    AUTH_URLS.LOGIN,
    async ({ email, password }: LoginRequest, { rejectWithValue }) => {
        try {
            const res = await authApi.login({ email, password });
            
            // ✅ AWAIT async storage operations
            await saveTokens(res.data.accessToken, res.data.refreshToken);
            await saveBooleanData(HAS_OPENED_APP, true);
            await saveBooleanData(HAS_LOGGED_IN, true);
            
            console.log("✅ Login + storage saved");
            return res.data as RegisterANDLoginResponse;
        } catch (err: any) {
            return rejectWithValue(handleAuthError(err));
        }
    }
);

export const registerThunk = createAsyncThunk(
    AUTH_URLS.REGISTER,
    async ({ email, password, name }: RegisterRequest, { rejectWithValue }) => {
        try {
            const res = await authApi.register({ email, password, name });
            
            // ✅ AWAIT async storage operations
            await saveTokens(res.data.accessToken, res.data.refreshToken);
            await saveBooleanData(HAS_OPENED_APP, true);
            await saveBooleanData(HAS_LOGGED_IN, true);
            
            console.log("✅ Register + storage saved");
            return res.data as RegisterANDLoginResponse;
        } catch (err: any) {
            return rejectWithValue(handleAuthError(err));
        }
    }
);

export const forgotPasswordThunk = createAsyncThunk(
    AUTH_URLS.FORGOT_PASS,
    async ({ email }: ForgotPasswordRequest, { rejectWithValue }) => {
        try {
            const res = await authApi.forgotPassword({ email });
            return res.data;
        } catch (err: any) {
            return rejectWithValue(handleAuthError(err));
        }
    }
);

export const verifyOTPThunk = createAsyncThunk(
    AUTH_URLS.VERIFY_OTP,
    async ({ email, otp }: VerifyOTPRequest, { rejectWithValue }) => {
        try {
            const res = await authApi.verifyOTP({ email, otp });
            return res.data;
        } catch (err: any) {
            return rejectWithValue(handleAuthError(err));
        }
    }
);

export const resetPasswordThunk = createAsyncThunk(
    AUTH_URLS.RESET_PASS,
    async ({ resetToken, newPassword }: ResetPasswordRequest, { rejectWithValue }) => {
        try {
            const res = await authApi.resetPassword({ resetToken, newPassword });
            return res.data;
        } catch (err: any) {
            return rejectWithValue(handleAuthError(err));
        }
    }
);

export const refreshTokenThunk = createAsyncThunk(
    AUTH_URLS.REFRESH_TOKEN,
    async (_, { rejectWithValue, dispatch }) => {
        try {
            const accessToken = await getAccessToken();
            const refreshToken = await getRefreshToken();
            
            if (!accessToken || !refreshToken) {
                throw new Error("No tokens available");
            }

            const res = await authApi.refresh({ accessToken, refreshToken });
            
            // ✅ Save new tokens
            await saveTokens(res.data.accessToken, res.data.refreshToken);
            
            // ✅ Hydrate user from new token
            const payload = decodeToken(res.data.accessToken);
            if (payload?.userDto) {
                dispatch(setCredentials({ userDto: payload.userDto }));
            }
            
            console.log("✅ Token refreshed + user hydrated");
            return res.data as RefreshTokenResponse;
        } catch (err: any) {
            return rejectWithValue(handleAuthError(err));
        }
    }
);

export const logoutThunk = createAsyncThunk(
    AUTH_URLS.LOGOUT,
    async (_, { rejectWithValue }) => {
        try {
            const refreshToken = await getRefreshToken();
            
            if (refreshToken) {
                try {
                    await authApi.logout({ refreshToken });
                    console.log("✅ Logout API success");
                } catch (err: any) {
                    console.warn("⚠️ Logout API failed, clearing local anyway");
                }
            }
            
            // ✅ AWAIT cleanup operations
            await deleteTokens();
            await saveBooleanData(HAS_LOGGED_IN, false);
            
            console.log("✅ Local storage cleared");
            return { success: true };
        } catch (err: any) {
            return rejectWithValue(handleAuthError(err));
        }
    }
);

// ======================== Slice ========================

const authSlice = createSlice({
    name: "auth",
    initialState,
    reducers: {
        logout(state) {
            // ✅ Chỉ clear Redux state, storage được handle ở logoutThunk
            state.isNewUser = undefined;
            state.user = null;
            state.loading = false;
            state.error = null;
            state.resetToken = "";
        },
        clearError(state) {
            state.error = null;
        },
        setCredentials(state, action: PayloadAction<{ userDto: UserDTOLogin }>) {
            state.user = action.payload.userDto;
            state.loading = false;
            state.error = null;
        },
    },
    extraReducers: (builder) => {
        const handlePending = (state: AuthState) => {
            state.loading = true;
            state.error = null;
        };

        const handleRejected = (state: AuthState, action: any) => {
            state.loading = false;
            state.error = (action.payload as string) || "An unknown error occurred";
        };

        const handleLoginFulfilled = (
            state: AuthState,
            action: PayloadAction<RegisterANDLoginResponse | LoginGoogleResponse>
        ) => {
            state.loading = false;
            state.isNewUser = action.payload.isNewUser || false;
            state.user = action.payload.userDto;
            // ✅ Storage đã được save trong thunk, không cần làm gì ở đây
        };

        // ========== Google / Normal / Register ==========
        builder
            .addCase(googleLoginThunk.pending, handlePending)
            .addCase(googleLoginThunk.fulfilled, handleLoginFulfilled)
            .addCase(googleLoginThunk.rejected, handleRejected);

        builder
            .addCase(loginThunk.pending, handlePending)
            .addCase(loginThunk.fulfilled, handleLoginFulfilled)
            .addCase(loginThunk.rejected, handleRejected);

        builder
            .addCase(registerThunk.pending, handlePending)
            .addCase(registerThunk.fulfilled, handleLoginFulfilled)
            .addCase(registerThunk.rejected, handleRejected);

        // ========== Refresh token ==========
        builder
            .addCase(refreshTokenThunk.pending, handlePending)
            .addCase(refreshTokenThunk.fulfilled, (state) => {
                state.loading = false;
                // Token + user đã được save trong thunk
            })
            .addCase(refreshTokenThunk.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload as string;
                state.user = null;
                // deleteTokens sẽ được gọi trong useAppStartup nếu refresh fail
            });
            
        // ========== Logout ==========
        builder
            .addCase(logoutThunk.pending, handlePending)
            .addCase(logoutThunk.fulfilled, (state) => {
                state.loading = false;
                // Cleanup Redux state
                state.user = null;
                state.isNewUser = undefined;
                state.resetToken = "";
            })
            .addCase(logoutThunk.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload as string;
                state.user = null;
            });

        // ========== Forgot / Verify / Reset ==========
        builder
            .addCase(forgotPasswordThunk.pending, handlePending)
            .addCase(forgotPasswordThunk.fulfilled, (state) => {
                state.loading = false;
                state.resetToken = ""; 
            })
            .addCase(forgotPasswordThunk.rejected, handleRejected);

        builder
            .addCase(verifyOTPThunk.pending, handlePending)
            .addCase(verifyOTPThunk.fulfilled, (state, action: PayloadAction<any>) => {
                state.loading = false;
                const resetToken = action.payload?.resetToken;
                if (resetToken) {
                    state.resetToken = resetToken;
                } else {
                    state.error = "Xác thực thành công, nhưng không nhận được mã thiết lập lại mật khẩu.";
                }
            })
            .addCase(verifyOTPThunk.rejected, handleRejected);

        builder
            .addCase(resetPasswordThunk.pending, handlePending)
            .addCase(resetPasswordThunk.fulfilled, (state) => {
                state.loading = false;
                state.resetToken = "";
            })
            .addCase(resetPasswordThunk.rejected, handleRejected);
    },
});

export const { logout, clearError, setCredentials } = authSlice.actions;
export default authSlice.reducer;