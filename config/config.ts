import Constants from 'expo-constants';

export const Config = {
  API_URL: Constants.manifest?.extra?.API_URL ?? "https://fallback.url",
};