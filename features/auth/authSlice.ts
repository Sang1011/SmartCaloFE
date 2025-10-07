import { createSlice, createAsyncThunk, PayloadAction } from "@reduxjs/toolkit";
import { authApi } from "./authApi";
import { deleteTokens, saveBooleanData, saveTokens, getAccessToken, getRefreshToken } from "@stores";
import { AUTH_URLS } from "./authUrls";
import { HAS_LOGGED_IN, HAS_OPENED_APP } from "@constants/app";
import {
  loginFacebookRequest,
  loginGoogleRequest,
  LoginResponse,
  RefreshTokenResponse,
} from "../../types/auth";

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

// Generic error handler
const handleAuthError = (error: any): string => {
  return error.response?.data?.message || "Authentication failed";
};

// Async thunks
export const googleLoginThunk = createAsyncThunk(
  AUTH_URLS.GOOGLE_LOGIN,
  async ({ idToken }: loginGoogleRequest, { rejectWithValue }) => {
    try {
      const res = await authApi.googleLogin({ idToken });
      return res.data;
    } catch (err: any) {
      return rejectWithValue(handleAuthError(err));
    }
  }
);

export const facebookLoginThunk = createAsyncThunk(
  AUTH_URLS.FACEBOOK_LOGIN,
  async ({ accessToken }: loginFacebookRequest, { rejectWithValue }) => {
    try {
      const res = await authApi.facebookLogin({ accessToken });
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
      
      if (!accessToken || !refreshToken) {
        throw new Error('No tokens available');
      }

      const res = await authApi.refresh({ accessToken, refreshToken });
      return res.data;
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
      
      if (refreshToken) {
        await authApi.logout({ refreshToken });
      }
      
      dispatch(logout());
      return { success: true };
    } catch (err: any) {
      dispatch(logout());
      return rejectWithValue(handleAuthError(err));
    }
  }
);

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

    const handleLoginFulfilled = (state: AuthState, action: PayloadAction<LoginResponse>) => {
      state.loading = false;
      state.isNewUser = action.payload.isNewUser;
      state.user = action.payload.userDto;
      console.log('Login successful, user:', state.user);
      saveBooleanData(HAS_OPENED_APP, true);
      saveTokens(action.payload.accessToken, action.payload.refreshToken);
    };

    const handleRejected = (state: AuthState, action: any) => {
      state.loading = false;
      state.error = action.payload as string;
    };

    builder
      .addCase(googleLoginThunk.pending, handlePending)
      .addCase(googleLoginThunk.fulfilled, handleLoginFulfilled)
      .addCase(googleLoginThunk.rejected, handleRejected);

    builder
      .addCase(facebookLoginThunk.pending, handlePending)
      .addCase(facebookLoginThunk.fulfilled, handleLoginFulfilled)
      .addCase(facebookLoginThunk.rejected, handleRejected);

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
  },
});

export const { logout, clearError, setCredentials } = authSlice.actions;
export default authSlice.reducer;