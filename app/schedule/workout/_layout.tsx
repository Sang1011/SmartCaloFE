import color from "@constants/color";
import { Stack } from "expo-router";
import { View } from "react-native";

export default function WorkoutLayout() {
  return (
    <View style={{ flex: 1, backgroundColor: color.background }}>
      <Stack screenOptions={{ headerShown: false }} />
    </View>
  );
}
