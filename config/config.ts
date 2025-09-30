import Constants from 'expo-constants';

export const Config = {
  API_URL: Constants.expoConfig?.extra?.API_URL ?? "https://fallback.url",
  GOOGLE_ANDROID_CLIENT_ID: Constants.expoConfig?.extra?.GOOGLE_ANDROID_CLIENT_ID ?? "fallback_android_client_id",
  GOOGLE_IOS_CLIENT_ID: Constants.expoConfig?.extra?.GOOGLE_IOS_CLIENT_ID ?? "fallback_ios_client_id",
};