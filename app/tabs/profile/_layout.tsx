import { FONTS } from "@constants/fonts";
import { Stack } from "expo-router";
import { StyleSheet } from "react-native";

export default function ProfileLayout() {
  return (
    <Stack>
      <Stack.Screen
        name="index"
        options={{
          headerTitleStyle: styles.headerTitle,
          headerTitle: "Hồ sơ cá nhân",
          headerTitleAlign: "center",
          headerBackVisible: false
        }}
      />
      <Stack.Screen
        name="details"
        options={{
          headerTitle: "Thông tin cá nhân",
          headerTitleStyle: styles.headerTitle,
          headerTitleAlign: "center",
        }}
      />
      <Stack.Screen
        name="reviewApp"
        options={{
          headerShown: false,
          headerTitle: "Đánh giá App",
          headerTitleStyle: styles.headerTitle,
          headerTitleAlign: "center",
        }}
      />
    </Stack>
  );
}

const styles = StyleSheet.create({
  header: {
    width: "100%",
    justifyContent: "center",
    display: "flex",
    alignItems: "center",
  },
  headerTitle: {
    fontSize: 24,
    fontWeight: "bold",
    fontFamily: FONTS.semiBold,
    textAlign: "center",
  },
});
