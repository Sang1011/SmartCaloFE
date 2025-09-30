import { useFonts } from "expo-font";
import { Stack } from "expo-router";
import { Platform, StatusBar, StyleSheet, Text, View } from "react-native"; // import thêm StatusBar
import { LocaleConfig } from "react-native-calendars";
import { SafeAreaProvider, SafeAreaView } from "react-native-safe-area-context";
import { Provider } from "react-redux";
import { useRedirect } from "../hooks/useRedirect";
import { store } from "../redux";
import color from "@constants/color";
import { useSystemBars } from "@hooks/useSystemBars";

export default function RootLayout() {
  LocaleConfig.locales["vi"] = {
    monthNames: [
      "Tháng 1",
      "Tháng 2",
      "Tháng 3",
      "Tháng 4",
      "Tháng 5",
      "Tháng 6",
      "Tháng 7",
      "Tháng 8",
      "Tháng 9",
      "Tháng 10",
      "Tháng 11",
      "Tháng 12",
    ],
    monthNamesShort: [
      "T1",
      "T2",
      "T3",
      "T4",
      "T5",
      "T6",
      "T7",
      "T8",
      "T9",
      "T10",
      "T11",
      "T12",
    ],
    dayNames: [
      "Chủ nhật",
      "Thứ 2",
      "Thứ 3",
      "Thứ 4",
      "Thứ 5",
      "Thứ 6",
      "Thứ 7",
    ],
    dayNamesShort: ["CN", "T2", "T3", "T4", "T5", "T6", "T7"],
    today: "Hôm nay",
  };
  LocaleConfig.defaultLocale = "vi";

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

  useRedirect();

  useSystemBars();
  

  if (!loaded) {
    return (
      <View>
        <Text>Loading...</Text>
      </View>
    );
  }

  return (
    <Provider store={store}>
      <SafeAreaProvider>
      <SafeAreaView style={{ flex: 1 }} edges={["bottom"]}>
        <StatusBar barStyle="dark-content" />
        <Stack
          screenOptions={{
            headerShown: false,
            contentStyle: { backgroundColor: color.white },
          }}
        >
          <Stack.Screen name="introScreen" />
          <Stack.Screen name="welcomeScreen" />
          <Stack.Screen name="login" />
          <Stack.Screen name="survey" />
          <Stack.Screen name="tabs" />
          <Stack.Screen name="+not-found" />
        </Stack>
      </SafeAreaView>
      </SafeAreaProvider>
    </Provider>
  );
}