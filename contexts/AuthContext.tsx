import { Config } from "@config/config";
import {
  googleLoginThunk,
  loginThunk,
  logoutThunk
} from "@features/auth";

// Imports cho Expo AuthSession
import { makeRedirectUri, ResponseType } from 'expo-auth-session';
import * as Google from "expo-auth-session/providers/google";
import * as WebBrowser from "expo-web-browser";

import { useAppDispatch, useAppSelector } from "@redux/hooks";
import React, {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useRef,
  useState,
} from "react";
import { RootState } from "../redux";

// ⚙️ Hoàn tất phiên xác thực (bắt buộc cho AuthSession)
WebBrowser.maybeCompleteAuthSession();

interface AuthContextType {
  authError: string | null;
  isLoading: boolean;
  loginWithGoogle: () => Promise<void>;
  login: (email: string, password: string) => Promise<void>;
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
  const { user } = useAppSelector((state :RootState) => state.user);

  const [isLoading, setIsLoading] = useState(false);
  const [authError, setAuthError] = useState<string | null>(null);
  const isMounted = useRef(true);

  // 1. Cấu hình và hook cho Google Sign-In (OAuth)
  const redirectUri = makeRedirectUri({
    native: 'smartcalomanaged://redirect' 
  });

  const [request, response, promptAsync] = Google.useAuthRequest({
    androidClientId: Config.GOOGLE_ANDROID_CLIENT_ID,
    webClientId: Config.GOOGLE_WEB_CLIENT_ID,
    iosClientId: Config.GOOGLE_ANDROID_CLIENT_ID, // Thay bằng client ID iOS riêng nếu có
    redirectUri: redirectUri,
    scopes: ['profile', 'email'],
    responseType: ResponseType.IdToken, 
  });

  useEffect(() => {
    console.log("AuthProvider mounted", isMounted.current);
    return () => {
      console.log("AuthProvider unmounting");
      isMounted.current = false;
    };
  }, []);

  const clearError = useCallback(() => {
    if (isMounted.current) setAuthError(null);
  }, []);

  useEffect(() => {
    if (error && isMounted.current) setAuthError(error);
  }, [error]);

  // 🟢 Login thường (email + password)
  const login = useCallback(
    async (email: string, password: string): Promise<void> => {
      if (!isMounted.current) return;
      setIsLoading(true);
      clearError();

      try {
        await dispatch(loginThunk({ email, password })).unwrap();
        console.log("✅ Login successful");
      } catch (error: any) {
        console.error("Login error:", error);
        if (isMounted.current)
          setAuthError(error?.message || "Đăng nhập thất bại");
      } finally {
        if (isMounted.current) setIsLoading(false);
      }
    },
    [dispatch, clearError]
  );

  // 🟢 Login với Google (Sử dụng expo-auth-session)
  const loginWithGoogle = useCallback(async (): Promise<void> => {
    if (!isMounted.current || !request) {
      if (isMounted.current && !request) console.warn("Google Auth request chưa sẵn sàng.");
      return;
    }
    setIsLoading(true);
    clearError();

    try {
      console.log("Starting Google login with Expo AuthSession...");
      
      const result = await promptAsync();

      if (result.type === 'success' && result.authentication) {
        const idToken = result.authentication.idToken;
        
        if (!idToken) {
          throw new Error("Không thể lấy token từ Google (idToken is null)");
        }

        await dispatch(googleLoginThunk({ idToken })).unwrap();
        console.log("✅ Google login successful (OAuth flow)");

      } else if (result.type === 'cancel') {
        setAuthError("Đăng nhập Google đã bị hủy");
      } else if (result.type === 'error') {
        throw new Error(result.error?.message || "Lỗi đăng nhập OAuth");
      }
      
    } catch (error: any) {
      console.error("Google login error:", error);
      let message = error?.message || "Đăng nhập Google thất bại";

      if (isMounted.current) setAuthError(message);
    } finally {
      if (isMounted.current) setIsLoading(false);
    }
  }, [dispatch, clearError, promptAsync, request]);


  // 🚪 Logout (Đã loại bỏ tất cả logic SDK native)
  const handleLogout = useCallback(async (): Promise<void> => {
    if (!isMounted.current) return;
  
    try {
      console.log("Logging out...");
  
      await dispatch(logoutThunk()).unwrap(); 
  
      clearError();
      console.log("✅ Logout thành công (đã huỷ session server)");
    } catch (error) {
      console.error("❌ Logout error:", error);
    }
  }, [dispatch, clearError]);

  const value: AuthContextType = {
    authError,
    isLoading,
    loginWithGoogle,
    login,
    logout: handleLogout,
    clearError,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

export const useAuth = (): AuthContextType => {
  const context = useContext(AuthContext);
  if (!context) throw new Error("useAuth must be used within an AuthProvider");
  return context;
};