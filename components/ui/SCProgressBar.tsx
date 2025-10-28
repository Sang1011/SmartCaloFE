import React, { useEffect, useRef } from "react";
import { Animated, StyleSheet, View } from "react-native";
import Color from "../../constants/color";

interface ISCProgressBarProps {
  progress: number;          // giá trị hiện tại
  maxProgress?: number;      // giá trị tối đa (mặc định 100)
  color?: string;            // màu thanh tiến trình
  height?: number;           // chiều cao
  width?: number | string;   // chiều rộng
  duration?: number;         // thời gian animation (ms)
}

export default function SCProgressBar({
  progress,
  maxProgress = 100,
  color = Color.progress_default,
  height = 4,
  width = "100%",
  duration = 500,
}: ISCProgressBarProps) {
  const animatedWidth = useRef(new Animated.Value(0)).current;

  // ✅ Tính phần trăm an toàn
  const safePercent =
    maxProgress > 0 ? Math.min((progress / maxProgress) * 100, 100) : 0;

  useEffect(() => {
    Animated.timing(animatedWidth, {
      toValue: safePercent,
      duration,
      useNativeDriver: false,
    }).start();
  }, [safePercent, duration, animatedWidth]);

  const barWidth = animatedWidth.interpolate({
    inputRange: [0, 100],
    outputRange: ["0%", "100%"],
  });

  return (
    <View
      style={[
        styles.container,
        {
          height,
          width: width as import("react-native").DimensionValue,
        },
      ]}
    >
      <Animated.View
        style={[
          styles.progressBar,
          { backgroundColor: color, width: barWidth },
        ]}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    backgroundColor: Color.donut_chart_background,
    borderRadius: 5,
    overflow: "hidden",
  },
  progressBar: {
    height: "100%",
  },
});
