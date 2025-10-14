import { HAS_LOGGED_IN, HAS_OPENED_APP } from "@constants/app";
import { createAsyncThunk, createSlice, PayloadAction } from "@reduxjs/toolkit";
import {
  deleteTokens,
  getAccessToken,
  getRefreshToken,
  saveBooleanData,
  saveStringData,
  saveTokens,
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
import { authApi } from "./authApi";
import { AUTH_URLS } from "./authUrls";

interface AuthState {
  loading: boolean;
  error: string | null;
  isNewUser?: boolean;
  user?: any | null;
}

const initialState: AuthState = {
  loading: false,
  error: null,
  user: null,
};

// ========== Helper function ==========
const handleAuthError = (error: any): string => {
  return error?.response?.data?.message || "Authentication failed";
};

// ========== Thunks ==========

// ✅ Google login
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

// ✅ Normal login
export const loginThunk = createAsyncThunk(
  AUTH_URLS.LOGIN,
  async ({ email, password }: LoginRequest, { rejectWithValue }) => {
    try {
      const res = await authApi.login({ email, password });
      return res.data as RegisterANDLoginResponse;
    } catch (err: any) {
      return rejectWithValue(handleAuthError(err));
    }
  }
);

// ✅ Register
export const registerThunk = createAsyncThunk(
  AUTH_URLS.REGISTER,
  async ({ email, password, name }: RegisterRequest, { rejectWithValue }) => {
    try {
      const res = await authApi.register({ email, password, name });
      return res.data as RegisterANDLoginResponse;
    } catch (err: any) {
      return rejectWithValue(handleAuthError(err));
    }
  }
);

// ✅ Forgot password
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

// ✅ Verify OTP
export const verifyOTPThunk = createAsyncThunk(
  AUTH_URLS.VERIFY_OTP,
  async ({ email, otp }: VerifyOTPRequest, { rejectWithValue }) => {
    try {
      const res = await authApi.verifyOTP({ email, otp });
      console.log(res.data);
      return res.data;
    } catch (err: any) {
      return rejectWithValue(handleAuthError(err));
    }
  }
);

// ✅ Reset password
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

// ✅ Refresh token
export const refreshTokenThunk = createAsyncThunk(
  AUTH_URLS.REFRESH_TOKEN,
  async (_, { rejectWithValue }) => {
    try {
      const accessToken = await getAccessToken();
      const refreshToken = await getRefreshToken();

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

// ✅ Logout
export const logoutThunk = createAsyncThunk(
  AUTH_URLS.LOGOUT,
  async (_, { rejectWithValue, dispatch }) => {
    try {
      const refreshToken = await getRefreshToken();
      if (refreshToken) await authApi.logout({ refreshToken });
      dispatch(logout());
      return { success: true };
    } catch (err: any) {
      dispatch(logout());
      return rejectWithValue(handleAuthError(err));
    }
  }
);

// ========== Slice ==========
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
      deleteTokens();
    },
    clearError(state) {
      state.error = null;
    },
    setCredentials(state, action: PayloadAction<{ user: any }>) {
      state.user = action.payload.user;
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
      state.error = action.payload as string;
    };

    const handleLoginFulfilled = (
      state: AuthState,
      action: PayloadAction<RegisterANDLoginResponse | LoginGoogleResponse>
    ) => {
      state.loading = false;
      state.isNewUser = action.payload.isNewUser || false;
      state.user = action.payload.userDto;
      saveTokens(action.payload.accessToken, action.payload.refreshToken);
      saveBooleanData(HAS_OPENED_APP, true);
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
        }
      )
      .addCase(refreshTokenThunk.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
        state.user = null;
        deleteTokens();
      });

    // ========== Logout ==========
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

    // ========== Forgot / Verify / Reset ==========
    builder
      .addCase(forgotPasswordThunk.pending, handlePending)
      .addCase(forgotPasswordThunk.fulfilled, (state) => {
        state.loading = false;
      })
      .addCase(forgotPasswordThunk.rejected, handleRejected);

    builder
      .addCase(verifyOTPThunk.pending, handlePending)
      .addCase(verifyOTPThunk.fulfilled, (state, action: PayloadAction<{ resetToken: string }>) => {
        state.loading = false;
        const { resetToken } = action.payload;
        saveStringData("resetToken", resetToken); 
      })
      .addCase(verifyOTPThunk.rejected, handleRejected);

    builder
      .addCase(resetPasswordThunk.pending, handlePending)
      .addCase(resetPasswordThunk.fulfilled, (state) => {
        state.loading = false;
      })
      .addCase(resetPasswordThunk.rejected, handleRejected);
  },
});

export const { logout, clearError, setCredentials } = authSlice.actions;
export default authSlice.reducer;
