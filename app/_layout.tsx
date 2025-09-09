import { useFonts } from "expo-font";
import { Stack } from "expo-router";
import { StatusBar } from "expo-status-bar";
import { useEffect, useState } from "react";
import "react-native-reanimated";
import { getBooleanData, saveBooleanData } from "@/stores";
import {
  AppScreen,
  HAS_DONE_SURVEY,
  HAS_OPENED_APP,
  IS_LOGGED_IN,
} from "@/constants/app";
import { Text, View } from "react-native";
import IntroScreen from "./introScreen";
import LoginScreen from "./login";
import SurveyScreen from "./surveyScreen";
import { Provider } from "react-redux";
import { store } from "@/redux";
import Welcome from "./welcomeScreen";

export default function RootLayout() {
  const [loaded] = useFonts({
    "Montserrat-Thin": require("../assets/fonts/Montserrat-Thin.ttf"),
    "Montserrat-ThinItalic": require("../assets/fonts/Montserrat-ThinItalic.ttf"),
    "Montserrat-ExtraLight": require("../assets/fonts/Montserrat-ExtraLight.ttf"),
    "Montserrat-ExtraLightItalic": require("../assets/fonts/Montserrat-ExtraLightItalic.ttf"),
    "Montserrat-Light": require("../assets/fonts/Montserrat-Light.ttf"),
    "Montserrat-LightItalic": require("../assets/fonts/Montserrat-LightItalic.ttf"),
    "Montserrat-Regular": require("../assets/fonts/Montserrat-Regular.ttf"),
    "Montserrat-Italic": require("../assets/fonts/Montserrat-Italic.ttf"),
    "Montserrat-Medium": require("../assets/fonts/Montserrat-Medium.ttf"),
    "Montserrat-MediumItalic": require("../assets/fonts/Montserrat-MediumItalic.ttf"),
    "Montserrat-SemiBold": require("../assets/fonts/Montserrat-SemiBold.ttf"),
    "Montserrat-SemiBoldItalic": require("../assets/fonts/Montserrat-SemiBoldItalic.ttf"),
    "Montserrat-Bold": require("../assets/fonts/Montserrat-Bold.ttf"),
    "Montserrat-BoldItalic": require("../assets/fonts/Montserrat-BoldItalic.ttf"),
    "Montserrat-ExtraBold": require("../assets/fonts/Montserrat-ExtraBold.ttf"),
    "Montserrat-ExtraBoldItalic": require("../assets/fonts/Montserrat-ExtraBoldItalic.ttf"),
    "Montserrat-Black": require("../assets/fonts/Montserrat-Black.ttf"),
    "Montserrat-BlackItalic": require("../assets/fonts/Montserrat-BlackItalic.ttf"),
  });

  const [screen, setScreen] = useState<AppScreen | null>(null);

  useEffect(() => {
    async function checkFlags() {
      const hasOpenedApp = await getBooleanData(HAS_OPENED_APP);
      const isLoggedIn = await getBooleanData(IS_LOGGED_IN);
      const hasDoneSurvey = await getBooleanData(HAS_DONE_SURVEY);

      if (!hasOpenedApp) setScreen(AppScreen.Intro);
      else if (!isLoggedIn) setScreen(AppScreen.Login);
      else if (!hasDoneSurvey) setScreen(AppScreen.Survey);
      else setScreen(AppScreen.Main);
    }

    checkFlags();
  }, []);

  if (!loaded || !screen) {
    return (
      <View>
        <Text>Loading...</Text>
      </View>
    );
  }

  return (
    <Provider store={store}>
      {screen === AppScreen.Intro && (
        <IntroScreen onFinish={() => setScreen(AppScreen.Welcome)} />
      )}
      {screen === AppScreen.Welcome && (
        <Welcome onFinish={() => setScreen(AppScreen.Login)} />
      )}
      {screen === AppScreen.Login && (
        <LoginScreen
          onLoginSuccess={() => {
            saveBooleanData(IS_LOGGED_IN, true);
            setScreen(AppScreen.Survey);
          }}
        />
      )}
      {screen === AppScreen.Survey && (
        <SurveyScreen
          onFinish={() => {
            saveBooleanData(HAS_DONE_SURVEY, true);
            setScreen(AppScreen.Main);
          }}
        />
      )}
      {screen === AppScreen.Main && (
        <Stack>
          <Stack.Screen name="(tabs)" options={{ headerShown: false }} />
          <Stack.Screen name="+not-found" />
        </Stack>
      )}
      <StatusBar style="auto" />
    </Provider>
  );
}
