import { StatusBar, View, Text } from "react-native"; // import thêm StatusBar
import { Stack } from "expo-router";
import { Provider } from "react-redux";
import { store } from "../redux";
import { useRedirect } from "../hooks/useRedirect";
import { useFonts } from "expo-font";
import { LocaleConfig } from "react-native-calendars";

export default function RootLayout() {
  LocaleConfig.locales["vi"] = {
    monthNames: ["Tháng 1","Tháng 2","Tháng 3","Tháng 4","Tháng 5","Tháng 6","Tháng 7","Tháng 8","Tháng 9","Tháng 10","Tháng 11","Tháng 12"],
    monthNamesShort: ["T1","T2","T3","T4","T5","T6","T7","T8","T9","T10","T11","T12"],
    dayNames: ["Chủ nhật","Thứ 2","Thứ 3","Thứ 4","Thứ 5","Thứ 6","Thứ 7"],
    dayNamesShort: ["CN","T2","T3","T4","T5","T6","T7"],
    today: "Hôm nay",
  };
  LocaleConfig.defaultLocale = "vi";

  const [loaded] = useFonts({
    // fonts...
  });

  useRedirect();

  if (!loaded) {
    return (
      <View>
        <Text>Loading...</Text>
      </View>
    );
  }

  return (
    <Provider store={store}>
      {/* Thêm StatusBar ở đây */}
      <StatusBar
        translucent={true}           // overlay lên content
        backgroundColor="transparent" // nền trong suốt
        barStyle="dark-content"      // icon/text màu đen
      />

      <Stack screenOptions={{ headerShown: false }}>
        <Stack.Screen name="introScreen" />
        <Stack.Screen name="welcomeScreen" />
        <Stack.Screen name="login" />
        <Stack.Screen name="(survey)" />
        <Stack.Screen name="tabs" />
        <Stack.Screen name="+not-found" />
      </Stack>
    </Provider>
  );
}
