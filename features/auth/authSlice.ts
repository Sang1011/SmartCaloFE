import { createSlice, createAsyncThunk, PayloadAction } from "@reduxjs/toolkit";
import { authApi } from "./authApi";
import { deleteToken, saveBooleanData, saveToken } from "@stores";
import { AUTH_URLS } from "./authUrls";
import { HAS_OPENED_APP } from "@constants/app";

interface AuthState {
  isLoggedIn: boolean;
  accessToken: string | null;
  loading: boolean;
  error: string | null;
  isNewUser?: boolean;
}

const initialState: AuthState = {
  isLoggedIn: false,
  accessToken: null,
  loading: false,
  error: null,
};

export const googleLoginThunk = createAsyncThunk(AUTH_URLS.GOOGLE_LOGIN,
  async (idToken: string, { rejectWithValue }) => {
    try {
      const res = await authApi.googleLogin(idToken);
      console.log("Google login response:", res.data);
      const { accessToken, refreshToken, isNewUser } = res.data;
      return { accessToken, refreshToken, isNewUser };
    } catch (err: any) {
      return rejectWithValue(err.response?.data?.message || "Login failed");
    }
  }
);

const authSlice = createSlice({
  name: "auth",
  initialState,
  reducers: {
    logout(state) {
      state.isLoggedIn = false;
      state.accessToken = null;
      state.isNewUser = undefined;
      deleteToken(); 
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(googleLoginThunk.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(
        googleLoginThunk.fulfilled,
        (
          state,
          action: PayloadAction<{
            accessToken: string;
            refreshToken: string;
            isNewUser: boolean;
          }>
        ) => {
          state.loading = false;
          state.isLoggedIn = true;
          state.accessToken = action.payload.accessToken;
          state.isNewUser = action.payload.isNewUser;
          saveBooleanData(HAS_OPENED_APP, true);
          saveToken(action.payload.refreshToken);
        }
      )
      .addCase(googleLoginThunk.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      });
  },
});

export const { logout } = authSlice.actions;
export default authSlice.reducer;
