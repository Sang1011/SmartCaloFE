import color from "@constants/color";
import { FONTS } from "@constants/fonts";
import { LinearGradient } from "expo-linear-gradient";
import React, { ReactNode, useEffect } from "react";
import { DimensionValue, Pressable, StyleSheet, Text, View } from "react-native";
import Animated, {
    interpolateColor,
    useAnimatedStyle,
    useSharedValue,
    withTiming,
} from "react-native-reanimated";

interface AnimatedGradientButtonProps {
  width?: number | string;
  height?: number;
  borderRadius?: number;
  icon?: ReactNode;
  title?: string;
  fontSize?: number;
  onPress?: () => void;
  progress?: number; // 🔥 0 → 1 (phần trăm hoàn thành)
}

export default function SCAnimatedGradientButton({
  width = "100%",
  height = 60,
  borderRadius = 20,
  icon,
  title,
  fontSize = 18,
  onPress,
  progress = 0,
}: AnimatedGradientButtonProps) {
  // Dùng progress để đổi màu dần
  const animatedProgress = useSharedValue(progress);

  useEffect(() => {
    animatedProgress.value = withTiming(progress, { duration: 500 });
  }, [progress]);

  // Gradient động
  const animatedStyle = useAnimatedStyle(() => {
    const bgColor = interpolateColor(
      animatedProgress.value,
      [0, 1],
      [color.dark_green, "#ff4d4d"] // từ xanh đậm sang đỏ
    );
    return { backgroundColor: bgColor };
  });

  return (
    <Pressable onPress={onPress} style={[ {width : width as DimensionValue}]}>
      <Animated.View
        style={[
          styles.button,
          { height, borderRadius },
          animatedStyle,
        ]}
      >
        <LinearGradient
          colors={["rgba(255,255,255,0.3)", "transparent"]}
          start={{ x: 0, y: 0 }}
          end={{ x: 1, y: 1 }}
          style={[StyleSheet.absoluteFill, { borderRadius }]}
        />
        {icon && <View style={styles.icon}>{icon}</View>}
        {title && (
          <Text style={{ color: color.white, fontSize, fontFamily: FONTS.bold }}>
            {title}
          </Text>
        )}
      </Animated.View>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  button: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    gap: 8,
    overflow: "hidden",
  },
  icon: {
    justifyContent: "center",
    alignItems: "center",
  },
});
