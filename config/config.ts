import Constants from 'expo-constants';
interface ExpoConfigExtra {
  API_URL: string;
  GOOGLE_ANDROID_CLIENT_ID: string;
  GOOGLE_WEB_CLIENT_ID: string;
  FACEBOOK_APP_ID?: string;
  API_PREDICTION_AI_URL: string;
}

export const Config = {
  API_URL: process.env.EXPO_PUBLIC_API_URL ?? 'https://fallback.url/',
  API_PREDICTION_AI_URL: process.env.EXPO_PUBLIC_API_PREDICTION_AI_URL ?? 'https://fallback.url/',
  GOOGLE_ANDROID_CLIENT_ID: (Constants.expoConfig?.extra as ExpoConfigExtra)?.GOOGLE_ANDROID_CLIENT_ID ?? "fallback_android_client_id",
  GOOGLE_WEB_CLIENT_ID: (Constants.expoConfig?.extra as ExpoConfigExtra)?.GOOGLE_WEB_CLIENT_ID ?? "fallback_web_client_id",
  FACEBOOK_APP_ID: (Constants.expoConfig?.extra as ExpoConfigExtra)?.FACEBOOK_APP_ID ?? "fallback_facebook_app_id",
};