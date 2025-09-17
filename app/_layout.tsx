import { Stack } from "expo-router";
import { Provider } from "react-redux";
import { store } from "../redux";
import { useRedirect } from "../hooks/useRedirect";

export default function RootLayout() {
  // Hook tự redirect theo flag
  useRedirect();

  return (
    <Provider store={store}>
      <Stack screenOptions={{ headerShown: false }}>
        <Stack.Screen name="introScreen" />
        <Stack.Screen name="welcomeScreen" />
        <Stack.Screen name="login" />
        <Stack.Screen name="(survey)" />
        <Stack.Screen name="(tabs)" />
        <Stack.Screen name="+not-found" />
      </Stack>
    </Provider>
  );
}
