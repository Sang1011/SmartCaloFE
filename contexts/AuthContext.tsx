import { Config } from '@config/config';
import { facebookLoginThunk, googleLoginThunk, logout, refreshTokenThunk } from '@features/auth';
import { GoogleSignin } from '@react-native-google-signin/google-signin';
import { getAccessToken, getRefreshToken } from '@stores';
import React, { createContext, useCallback, useContext, useEffect, useRef, useState } from 'react';
import { AccessToken, LoginManager } from 'react-native-fbsdk-next';
import { useDispatch, useSelector } from 'react-redux';
import { AppDispatch, RootState } from '../redux';

// Cấu hình Google Sign-In
GoogleSignin.configure({
  webClientId: Config.GOOGLE_WEB_CLIENT_ID,
});

interface AuthContextType {
  // Auth state
  authError: string | null;
  
  // Loading states
  isLoading: boolean; 
  
  // Methods
  loginWithGoogle: () => Promise<void>;
  loginWithFacebook: () => Promise<void>;
  logout: () => Promise<void>;
  clearError: () => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

// Hàm kiểm tra JWT token có hết hạn không
const isTokenExpired = (token: string): boolean => {
  try {
    const payload = JSON.parse(atob(token.split('.')[1]));
    const currentTime = Date.now() / 1000;
    return payload.exp < currentTime;
  } catch (error) {
    console.error('Error decoding token:', error);
    return true;
  }
};

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const dispatch = useDispatch<AppDispatch>();
  
  // Lấy state từ Redux
  const { error } = useSelector(
    (state: RootState) => state.auth
  );
  
  // Loading states
  const [isLoading, setIsLoading] = useState(true);
  const [authError, setAuthError] = useState<string | null>(null);

  // Ref để tránh memory leaks
  const isMounted = useRef(true);

  useEffect(() => {
    return () => {
      isMounted.current = false;
    };
  }, []);

  // Clear error
  const clearError = useCallback(() => {
    if (isMounted.current) {
      setAuthError(null);
    }
  }, []);

  // Combine errors từ Redux và local
  useEffect(() => {
    if (error && isMounted.current) {
      setAuthError(error);
    }
  }, [error]);

  // Auto login check
  const checkAutoLogin = useCallback(async () => {
    if (!isMounted.current) return;

    try {
      setIsLoading(true);
      const accessToken = await getAccessToken();
      const refreshToken = await getRefreshToken();
      
      if (accessToken && refreshToken) {
        console.log('Found stored tokens, checking validity...');
        
        if (isTokenExpired(accessToken)) {
          console.log('Access token expired, attempting refresh...');
          try {
            await dispatch(refreshTokenThunk()).unwrap();
            console.log('Token refresh successful');
          } catch (refreshError) {
            console.log('Token refresh failed, logging out...');
            dispatch(logout());
          }
        } else {
          console.log('Access token still valid');
          // Token hợp lệ, user vẫn đăng nhập
        }
      } else {
        console.log('No stored tokens found');
      }
    } catch (error) {
      console.error('Error checking auto-login:', error);
      dispatch(logout());
    } finally {
      if (isMounted.current) {
        setIsLoading(false);
      }
    }
  }, [dispatch]);

  useEffect(() => {
    checkAutoLogin();
  }, [checkAutoLogin]);

  // Google Login
  const loginWithGoogle = useCallback(async (): Promise<void> => {
    if (!isMounted.current) return;

    setIsLoading(true);
    clearError();

    try {
      console.log('Starting Google login...');
      
      // Kiểm tra Google Play Services
      await GoogleSignin.hasPlayServices();
      
      // Thực hiện đăng nhập Google
      const userInfo = await GoogleSignin.signIn();
      console.log('Google sign-in response:', userInfo);
      
      // Debug: log toàn bộ response structure
      console.log('UserInfo keys:', Object.keys(userInfo));
      if (userInfo.data) {
        console.log('UserInfo.data keys:', Object.keys(userInfo.data));
      }
      
      const idToken = userInfo.data?.idToken;
      console.log('Extracted idToken:', idToken ? '✓ Received' : '✗ Missing');
      
      if (idToken) {
        console.log('Dispatching googleLoginThunk with idToken...');
        await dispatch(googleLoginThunk({ idToken })).unwrap();
        console.log('Google login successful!');
      } else {
        console.error('No ID token found in Google response');
        const errorMsg = 'Không thể lấy token từ Google. Vui lòng thử lại.';
        setAuthError(errorMsg);
        throw new Error(errorMsg);
      }
    } catch (error: any) {
      
      let errorMessage = 'Đăng nhập Google thất bại';
      
      if (error.code === 'SIGN_IN_CANCELLED') {
        errorMessage = 'Đăng nhập Google đã bị hủy';
      } else if (error.code === 'IN_PROGRESS') {
        errorMessage = 'Đang tiến hành đăng nhập Google';
      } else if (error.code === 'PLAY_SERVICES_NOT_AVAILABLE') {
        errorMessage = 'Dịch vụ Google Play không khả dụng';
      } else if (error.message) {
        errorMessage = error.message;
      }
      
      if (isMounted.current) {
        setAuthError(errorMessage);
      }
    } finally {
      if (isMounted.current) {
        setIsLoading(false);
      }
    }
  }, [dispatch, clearError]);

  // Facebook Login
  const loginWithFacebook = useCallback(async (): Promise<void> => {
    if (!isMounted.current) return;

    setIsLoading(true);
    clearError();

    try {
      console.log('Starting Facebook login...');
      
      // Thực hiện đăng nhập Facebook
      const result = await LoginManager.logInWithPermissions(['public_profile', 'email']);
      
      if (result.isCancelled) {
        console.log('Facebook login cancelled');
        throw new Error('Đăng nhập Facebook đã bị hủy');
      }

      // Lấy access token từ Facebook
      const data = await AccessToken.getCurrentAccessToken();
      console.log('Facebook access token data:', data);
      
      if (data?.accessToken) {
        console.log('Facebook access token received, dispatching thunk...');
        await dispatch(facebookLoginThunk({ accessToken: data.accessToken })).unwrap();
        console.log('Facebook login successful!');
      } else {
        console.error('No access token received from Facebook');
        throw new Error('Không thể lấy token từ Facebook');
      }
    } catch (error: any) {
      console.error('Error during Facebook login:', error);
      
      let errorMessage = 'Đăng nhập Facebook thất bại';
      
      if (error.message?.includes('cancelled') || error.message?.includes('đã bị hủy')) {
        errorMessage = 'Đăng nhập Facebook đã bị hủy';
      } else if (error.message) {
        errorMessage = error.message;
      }
      
      if (isMounted.current) {
        setAuthError(errorMessage);
      }
      throw new Error(errorMessage);
    } finally {
      if (isMounted.current) {
        setIsLoading(false);
      }
    }
  }, [dispatch, clearError]);

  // Logout
  const handleLogout = useCallback(async (): Promise<void> => {
    if (!isMounted.current) return;

    try {
      console.log('Starting logout process...');
      
      // Đăng xuất khỏi Google
      try {
        await GoogleSignin.signOut();
        console.log('Google sign-out successful');
      } catch (googleError) {
        console.error('Error during Google sign-out:', googleError);
      }

      // Đăng xuất khỏi Facebook
      try {
        await LoginManager.logOut();
        console.log('Facebook sign-out successful');
      } catch (facebookError) {
        console.error('Error during Facebook sign-out:', facebookError);
      }
    } finally {
      // Luôn dispatch logout action dù social sign-out có lỗi hay không
      dispatch(logout());
      clearError();
    }
  }, [dispatch, clearError]);

  const value: AuthContextType = {
    // Auth state
    authError,
    
    // Loading states
    isLoading,
    
    // Methods
    loginWithGoogle,
    loginWithFacebook,
    logout: handleLogout,
    clearError,
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = (): AuthContextType => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};