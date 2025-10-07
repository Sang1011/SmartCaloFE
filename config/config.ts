import Constants from 'expo-constants';

interface ExpoConfigExtra {
  API_URL: string;
  GOOGLE_ANDROID_CLIENT_ID: string;
  GOOGLE_WEB_CLIENT_ID: string;
  FACEBOOK_APP_ID?: string;
}

export const Config = {
  API_URL: (Constants.expoConfig?.extra as ExpoConfigExtra)?.API_URL ?? "https://fallback.url/",
  GOOGLE_ANDROID_CLIENT_ID: (Constants.expoConfig?.extra as ExpoConfigExtra)?.GOOGLE_ANDROID_CLIENT_ID ?? "fallback_android_client_id",
  GOOGLE_WEB_CLIENT_ID: (Constants.expoConfig?.extra as ExpoConfigExtra)?.GOOGLE_WEB_CLIENT_ID ?? "fallback_web_client_id",
  FACEBOOK_APP_ID: (Constants.expoConfig?.extra as ExpoConfigExtra)?.FACEBOOK_APP_ID ?? "fallback_facebook_app_id",
};