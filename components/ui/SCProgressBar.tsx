import React, { useEffect, useRef } from "react";
import { View, Animated, StyleSheet } from "react-native";
import Color from "../../constants/color";

interface ISCProgressBarProps {
  progress: number;          // giá trị % từ 0–100
  color?: string;            // màu thanh tiến trình
  height?: number;           // chiều cao
  width?: number | string;   // chiều rộng
  duration?: number;         // thời gian animation (ms)
}

export default function SCProgressBar({
  progress,
  color = Color.progress_default,
  height = 4,
  width = "100%",
  duration = 500,
}: ISCProgressBarProps) {
  const animatedWidth = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    Animated.timing(animatedWidth, {
      toValue: progress,
      duration: duration,
      useNativeDriver: false,
    }).start();
  }, [progress]);

  const barWidth = animatedWidth.interpolate({
    inputRange: [0, 100],
    outputRange: ["0%", "100%"],
  });

  return (
    <View style={[styles.container, { height: height, width: width as import("react-native").DimensionValue }]}>
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
