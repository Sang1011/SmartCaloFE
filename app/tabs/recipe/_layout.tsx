import color from "@constants/color";
import { Stack } from "expo-router";

export default function RecipeLayout() {
  return (
    <Stack
      screenOptions={{
        headerShown: true, // Ẩn header mặc định (vì bạn đang dùng custom header)
        contentStyle: { backgroundColor: color.white }, // màu nền mặc định cho tất cả màn
      }}
    >
      <Stack.Screen
        name="index"
        options={{
          title: "Thực đơn gợi ý",
          headerTitleAlign: "center",
          headerBackVisible: false,
        }}
      />
      <Stack.Screen
        name="RecipeDetail"
        options={{
          title: "Chi tiết thực đơn",
          headerTitleAlign: "center",
          headerBackVisible: false,
          animation: "slide_from_right", // hiệu ứng chuyển trang tự nhiên
        }}
      />
    </Stack>
  );
}
