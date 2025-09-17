import { Stack } from "expo-router";

export default function SurveyLayout() {
  return (
    <Stack screenOptions={{ headerShown: false }}>
      <Stack.Screen name="step1" />
      {/* Thêm mấy trang tiếp theo vô */}
    </Stack>
  );
}
