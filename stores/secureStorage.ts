// stores/index.ts
import * as SecureStore from 'expo-secure-store';

// Lưu cả 2 token
export const saveTokens = async (accessToken: string, refreshToken: string) => {
  try {
    await SecureStore.setItemAsync('access_token', accessToken);
    await SecureStore.setItemAsync('refresh_token', refreshToken);
    console.log('Tokens saved successfully');
  } catch (error) {
    console.warn('Failed to save tokens:', error);
  }
};

// Lấy access token (dùng cho API calls)
export const getAccessToken = async (): Promise<string | null> => {
  try {
    return await SecureStore.getItemAsync('access_token');
  } catch (error) {
    console.warn('Failed to get access token:', error);
    return null;
  }
};

// Lấy refresh token (dùng để refresh)
export const getRefreshToken = async (): Promise<string | null> => {
  try {
    return await SecureStore.getItemAsync('refresh_token');
  } catch (error) {
    console.warn('Failed to get refresh token:', error);
    return null;
  }
};

// Xóa cả 2 token
export const deleteTokens = async () => {
  try {
    await SecureStore.deleteItemAsync('access_token');
    await SecureStore.deleteItemAsync('refresh_token');
    console.log('Tokens deleted successfully');
  } catch (error) {
    console.warn('Failed to delete tokens:', error);
  }
};