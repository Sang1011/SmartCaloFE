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
        // atob is available in the environment (based on useAppStartup.ts)
        const payload = JSON.parse(atob(token.split(".")[1]));
        return payload;
    } catch {
        return null;
    }
};

// ======================== Thunks ========================

// ✅ NEW THUNK: Hydrate user from a valid local token
export const hydrateUserThunk = createAsyncThunk(
    "auth/hydrateUser",
    async (_, { rejectWithValue, dispatch }) => {
        const accessToken = await getAccessToken();
        if (!accessToken) {
            return rejectWithValue("No access token found");
        }
        
        const payload = decodeToken(accessToken);
        if (payload && payload.userDto) {
            // Cập nhật state user dựa trên dữ liệu giải mã từ token
            dispatch(setCredentials({ userDto: payload.userDto }));
            return payload.userDto;
        }

        return rejectWithValue("Invalid token structure or missing user data in token.");
    }
);

// (Các thunks khác giữ nguyên...)

export const googleLoginThunk = createAsyncThunk(
    AUTH_URLS.GOOGLE_LOGIN,
    async ({ idToken }: LoginGoogleRequest, { rejectWithValue }) => {
        try {
            const res = await authApi.googleLogin({ idToken });
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
            console.log("res Login", res.data);
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
            console.log("RES REGISTER", res.data);
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
            console.log("res.data", res.data);
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
    async (_, { rejectWithValue }) => {
        try {
            const accessToken = await getAccessToken();
            const refreshToken = await getRefreshToken();
            console.warn("accessToken refresh",  accessToken);
            console.warn("refreshToken refresh", refreshToken);
            if (!accessToken || !refreshToken) {
                throw new Error("No tokens available");
            }

            const res = await authApi.refresh({ accessToken, refreshToken });
            return res.data as RefreshTokenResponse; 
        } catch (err: any) {
            return rejectWithValue(handleAuthError(err));
        }
    }
);

export const logoutThunk = createAsyncThunk(
    AUTH_URLS.LOGOUT,
    async (_, { rejectWithValue, dispatch }) => {
        try {
            const refreshToken = await getRefreshToken();
            
            // ✅ Chỉ call API nếu còn refreshToken
            if (refreshToken) {
                try {
                    await authApi.logout({ refreshToken });
                    console.log("✅ Logout API success");
                } catch (err: any) {
                    // ✅ Nếu API fail (token đã hết hạn) → ignore
                    console.warn("⚠️ Logout API failed (token expired), clearing local anyway");
                }
            }
            
            // ✅ Luôn cleanup local state
            dispatch(logout());
            return { success: true };
        } catch (err: any) {
            // ✅ Ensure cleanup even on error
            dispatch(logout());
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
            saveBooleanData(HAS_LOGGED_IN, false);
            state.isNewUser = undefined;
            state.user = null;
            state.loading = false;
            state.error = null;
            state.resetToken = "";
            deleteTokens();
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
            saveTokens(action.payload.accessToken, action.payload.refreshToken);
            (async () => {
                const at = await getAccessToken();
                const rt = await getRefreshToken();
                console.log("✅ Access Token:", at);
                console.log("✅ Refresh Token:", rt);
              })();
            saveBooleanData(HAS_OPENED_APP, true);
            saveBooleanData(HAS_LOGGED_IN, true);
            console.log("✅ Login success:", state.user);
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
            .addCase(
                refreshTokenThunk.fulfilled,
                (state, action: PayloadAction<RefreshTokenResponse>) => {
                    state.loading = false;
                    saveTokens(action.payload.accessToken, action.payload.refreshToken);
                    console.log("✅ Token refresh success");
                }
            )
            .addCase(refreshTokenThunk.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload as string;
                state.user = null;
                deleteTokens();
            });
            
        // ========== Hydrate User (New logic) ==========
        // Thunk này dùng để setCredentials (cập nhật state.user) nên không cần logic riêng biệt, 
        // nó sẽ kích hoạt reducer setCredentials ở trên.
        builder
            .addCase(hydrateUserThunk.pending, handlePending)
            .addCase(hydrateUserThunk.fulfilled, (state) => {
                state.loading = false; // setCredentials đã set loading = false
            })
            .addCase(hydrateUserThunk.rejected, handleRejected);

        // ========== Logout / Forgot / Verify / Reset (Giữ nguyên) ==========
        builder
            .addCase(logoutThunk.pending, handlePending)
            .addCase(logoutThunk.fulfilled, (state) => {
                state.loading = false;
            })
            .addCase(logoutThunk.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload as string;
                state.user = null;
                deleteTokens();
            });

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
                    console.log("resetToken saved:", resetToken);
                } else {
                    console.warn("API success but missing resetToken in payload:", action.payload);
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