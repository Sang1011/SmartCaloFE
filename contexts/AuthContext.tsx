import { Config } from "@config/config";
import { googleLoginThunk, logoutThunk } from "@features/auth";
import { fetchCurrentUserThunk } from "@features/users";
import { useAppDispatch, useAppSelector } from "@redux/hooks";
import { deleteTokens, getAccessToken, getRefreshToken } from "@stores";
import { autoCreateDefaultUser, autoUpdateStreaks } from "@utils/firebaseRealTime";
import { navigateCustom } from "@utils/navigation";
import { makeRedirectUri, ResponseType } from "expo-auth-session";
import * as Google from "expo-auth-session/providers/google";
import * as WebBrowser from "expo-web-browser";
import React, { createContext, useCallback, useContext, useEffect, useRef, useState } from "react";
import { RootState } from "../redux";

WebBrowser.maybeCompleteAuthSession();

interface AuthContextType {
  authError: string | null;
  isLoading: boolean;
  loginWithGoogle: () => Promise<boolean>;
  logout: () => Promise<void>;
  clearError: () => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

interface AuthProviderProps {
  children: React.ReactNode;
}

export const AuthProvider: React.FC<AuthProviderProps> = ({ children }) => {
  const dispatch = useAppDispatch();
  const { error } = useAppSelector((state: RootState) => state.auth);
  const { user } = useAppSelector((state: RootState) => state.user);

  const [isLoading, setIsLoading] = useState(false);
  const [authError, setAuthError] = useState<string | null>(null);
  const isMounted = useRef(true);
  const isInitialized = useRef(false);

  const redirectUri = makeRedirectUri({ native: "smartcalomanaged://redirect" });

  const [request, response, promptAsync] = Google.useAuthRequest({
    androidClientId: Config.GOOGLE_ANDROID_CLIENT_ID,
    webClientId: Config.GOOGLE_WEB_CLIENT_ID,
    iosClientId: Config.GOOGLE_ANDROID_CLIENT_ID,
    redirectUri,
    scopes: ["profile", "email"],
    responseType: ResponseType.IdToken,
  });

  // ✅ Component lifecycle
  useEffect(() => {
    isMounted.current = true;
    return () => {
      isMounted.current = false;
    };
  }, []);

  // ✅ HELPER: Tạo user + Update streak
  const syncFirebaseStreak = useCallback(async (userId: string) => {
    try {
      console.log("🔥 Syncing Firebase streak for user:", userId);
      
      const today = new Date().toLocaleDateString('en-GB'); // dd/mm/yyyy
      const formattedToday = today.replace(/\//g, '-'); // dd-mm-yyyy
      
      console.log(`📅 Today formatted: ${formattedToday}`);
      
      const userData = await autoCreateDefaultUser(userId, formattedToday);
      console.log("✅ User ensured:", userData);
      
      const updatedStreak = await autoUpdateStreaks(userId, formattedToday);
      console.log("✅ Streak updated:", updatedStreak);
      
      return updatedStreak;
    } catch (error) {
      console.error("❌ Failed to sync Firebase streak:", error);
      // ✅ Không throw error - streak sync là optional
    }
  }, []);

  // ✅ Initialize: Check token & fetch user
  useEffect(() => {
    const initAuth = async () => {
      if (isInitialized.current || !isMounted.current) return;
      isInitialized.current = true;

      try {
        const accessToken = await getAccessToken();
        const refreshToken = await getRefreshToken();

        if (!accessToken || !refreshToken) {
          console.log("⚠️ No tokens found, user needs to login");
          return;
        }

        // ✅ Nếu chưa có user trong Redux → fetch
        if (!user) {
          console.log("🔄 Fetching current user...");
          const fetchedUser = await dispatch(fetchCurrentUserThunk()).unwrap();
          console.log("✅ User fetched:", fetchedUser);
          
          // ✅ Sync Firebase streak
          if (fetchedUser?.id) {
            await syncFirebaseStreak(fetchedUser.id);
          }
        }
      } catch (error: any) {
        console.warn("⚠️ Failed to fetch user on init:", error?.message);
        
        // ✅ Nếu lỗi 401 → Token invalid → Clear local và navigate
        if (error?.response?.status === 401 || error?.message?.includes("token")) {
          console.log("🔒 Token invalid on init → Clearing local tokens");
          await deleteTokens();
          navigateCustom("/login");
        }
        // ✅ Các lỗi khác (network, server) → Không làm gì, để interceptor xử lý
      }
    };

    initAuth();
  }, []); // ✅ Empty deps - chỉ chạy 1 lần khi mount

  // ✅ Sync Firebase khi user thay đổi (sau login/register)
  useEffect(() => {
    if (user?.id && isMounted.current && isInitialized.current) {
      syncFirebaseStreak(user.id);
    }
  }, [user?.id, syncFirebaseStreak]);

  // ✅ Sync error từ Redux
  useEffect(() => {
    if (error && isMounted.current) {
      setAuthError(error);
    }
  }, [error]);

  // ✅ Clear error
  const clearError = useCallback(() => {
    if (isMounted.current) setAuthError(null);
  }, []);

  // ✅ Google Login
  const loginWithGoogle = useCallback(async (): Promise<boolean> => {
    if (!isMounted.current || !request) {
      console.warn("⚠️ Google login not ready");
      return false;
    }

    setIsLoading(true);
    clearError();

    try {
      const result = await promptAsync();

      if (result.type === "success" && result.authentication) {
        const idToken = result.authentication.idToken;
        if (!idToken) {
          throw new Error("Không thể lấy token từ Google");
        }

        console.log("✅ Google OAuth success, logging in...");
        
        // ✅ Login với Google
        await dispatch(googleLoginThunk({ idToken })).unwrap();
        
        // ✅ Fetch user info
        const fetchedUser = await dispatch(fetchCurrentUserThunk()).unwrap();
        console.log("✅ Google login completed, user:", fetchedUser);
        
        // ✅ Streak sẽ tự động sync trong useEffect
        return true;
      } else if (result.type === "cancel") {
        console.log("ℹ️ Google login cancelled by user");
        if (isMounted.current) setAuthError("Đăng nhập Google đã bị hủy");
        return false;
      } else if (result.type === "error") {
        throw new Error(result.error?.message || "Lỗi đăng nhập OAuth");
      }

      return false;
    } catch (err: any) {
      const errorMessage = err?.message || "Đăng nhập Google thất bại";
      console.error("❌ Google login error:", errorMessage);
      if (isMounted.current) setAuthError(errorMessage);
      return false;
    } finally {
      if (isMounted.current) setIsLoading(false);
    }
  }, [dispatch, clearError, promptAsync, request]);

  // ✅ Logout
  const logout = useCallback(async (): Promise<void> => {
    if (!isMounted.current) return;

    setIsLoading(true);
    
    try {
      console.log("🚪 Logging out...");
      
      // ✅ Call logoutThunk (sẽ tự động handle API fail)
      await dispatch(logoutThunk()).unwrap();
      
      clearError();
      console.log("✅ Logout successful");
      
      // ✅ Navigate về login
      navigateCustom("/login");
      
    } catch (err: any) {
      console.error("❌ Logout error:", err);
      
      // ✅ Dù có lỗi vẫn clear error và navigate
      clearError();
      navigateCustom("/login");
    } finally {
      if (isMounted.current) setIsLoading(false);
    }
  }, [dispatch, clearError]);

  const value: AuthContextType = {
    authError,
    isLoading,
    loginWithGoogle,
    logout,
    clearError,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

export const useAuth = (): AuthContextType => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
};