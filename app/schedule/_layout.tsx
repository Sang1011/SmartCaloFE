import color from "@constants/color";
import { Stack } from "expo-router";

export default function ScheduleLayout() {
  return (
    <Stack
      screenOptions={{
        headerShown: false, // Ẩn header mặc định (vì bạn đang dùng custom header)
        contentStyle: { backgroundColor: color.white }, // màu nền mặc định cho tất cả màn
      }}
    >
      <Stack.Screen
        name="index"
        options={{
          title: "Lịch tập",
        }}
      />
      <Stack.Screen
        name="scheduleDetail"
        options={{
          title: "Chi tiết lịch tập",
          animation: "slide_from_right", // hiệu ứng chuyển trang tự nhiên
        }}
      />
    </Stack>
  );
}
