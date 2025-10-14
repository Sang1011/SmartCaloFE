import { Config } from "@config/config";
import {
  googleLoginThunk,
  loginThunk,
  logout,
  registerThunk,
} from "@features/auth";
import { GoogleSignin } from "@react-native-google-signin/google-signin";
import React, {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useRef,
  useState,
} from "react";
import { LoginManager } from "react-native-fbsdk-next";
import { useDispatch, useSelector } from "react-redux";
import { AppDispatch, RootState } from "../redux";

// ⚙️ Cấu hình Google Sign-In
GoogleSignin.configure({
  webClientId: Config.GOOGLE_WEB_CLIENT_ID,
});

interface AuthContextType {
  authError: string | null;
  isLoading: boolean;
  loginWithGoogle: () => Promise<void>;
  login: (email: string, password: string) => Promise<void>;
  register: (email: string, password: string, fullName: string) => Promise<void>;
  logout: () => Promise<void>;
  clearError: () => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);
interface AuthProviderProps {
  children: React.ReactNode;
}

export const AuthProvider: React.FC<AuthProviderProps> = ({ children }) => {
  const dispatch = useDispatch<AppDispatch>();
  const { error } = useSelector((state: RootState) => state.auth);

  const [isLoading, setIsLoading] = useState(false);
  const [authError, setAuthError] = useState<string | null>(null);
  const isMounted = useRef(true);

  useEffect(() => {
    console.log("AuthProvider mounted", isMounted.current); // true
    return () => {
      console.log("AuthProvider unmounting");
      isMounted.current = false;
    };
  }, []);

  const clearError = useCallback(() => {
    if (isMounted.current) setAuthError(null);
  }, []);

  // Sync error từ Redux
  useEffect(() => {
    if (error && isMounted.current) setAuthError(error);
  }, [error]);

  // 🟢 Login thường (email + password)
  const login = useCallback(
    async (email: string, password: string): Promise<void> => {
      console.log("in callback")
      if (!isMounted.current) return;
      console.log("in callback 222")
      setIsLoading(true);
      clearError();

      try {
        console.log("Login loading");
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

  // 🟣 Register thường
  const register = useCallback(
    async (email: string, password: string, name: string): Promise<void> => {
      if (!isMounted.current) return;
      setIsLoading(true);
      clearError();

      try {
        await dispatch(registerThunk({ email, password, name })).unwrap();
        console.log("✅ Register successful");
      } catch (error: any) {
        console.error("Register error:", error);
        if (isMounted.current)
          setAuthError(error?.message || "Đăng ký thất bại");
      } finally {
        if (isMounted.current) setIsLoading(false);
      }
    },
    [dispatch, clearError]
  );

  // 🟢 Login với Google
  const loginWithGoogle = useCallback(async (): Promise<void> => {
    if (!isMounted.current) return;
    setIsLoading(true);
    clearError();

    try {
      console.log("Starting Google login...");
      await GoogleSignin.hasPlayServices();
      const userInfo = await GoogleSignin.signIn();

      const idToken = userInfo.data?.idToken;
      if (!idToken) {
        throw new Error("Không thể lấy token từ Google");
      }

      await dispatch(googleLoginThunk({ idToken })).unwrap();
      console.log("✅ Google login successful");
    } catch (error: any) {
      console.error("Google login error:", error);
      let message = "Đăng nhập Google thất bại";
      if (error.code === "SIGN_IN_CANCELLED") message = "Đăng nhập Google đã bị hủy";
      else if (error.code === "PLAY_SERVICES_NOT_AVAILABLE")
        message = "Dịch vụ Google Play không khả dụng";
      else if (error.message) message = error.message;

      if (isMounted.current) setAuthError(message);
    } finally {
      if (isMounted.current) setIsLoading(false);
    }
  }, [dispatch, clearError]);


  // 🚪 Logout
  const handleLogout = useCallback(async (): Promise<void> => {
    if (!isMounted.current) return;

    try {
      console.log("Logging out...");
      try {
        await GoogleSignin.signOut();
      } catch (err) {
        console.warn("Google sign-out failed:", err);
      }

      try {
        await LoginManager.logOut();
      } catch (err) {
        console.warn("Facebook sign-out failed:", err);
      }

      dispatch(logout());
      clearError();
    } catch (error) {
      console.error("Logout error:", error);
    }
  }, [dispatch, clearError]);

  const value: AuthContextType = {
    authError,
    isLoading,
    loginWithGoogle,
    login,
    register,
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
