import color from "@constants/color";
import React, { useEffect, useRef } from "react";
import { View, Text, StyleSheet, Animated } from "react-native";
import Svg, { Circle, G } from "react-native-svg";

interface ISCDonutChartProps {
  value?: number;              // dùng cho single progress
  segments?: number[];         // nhiều segment
  colors?: string[];           // màu cho segment
  maxValue: number;            // giá trị tổng tối đa
  strokeWidth?: number;
  radius?: number;
  size?: number;               // 👈 chỉnh kích thước trực tiếp
  centerText?: string;
  centerTextColor?: string;
  backgroundColor?: string;    // màu nền vòng tròn
  duration?: number;           // thời gian animation (ms)
}

export default function SCDonutChart({
  value,
  segments,
  colors = [
    color.checkbox,
    color.donut_chart_segment_1,
    color.donut_chart_segment_2,
    color.donut_chart_segment_3,
  ],
  strokeWidth = 20,
  radius = 70,
  size,
  centerText,
  centerTextColor = color.black,
  backgroundColor = color.donut_chart_background,
  maxValue,
  duration = 800,
}: ISCDonutChartProps) {
  const effectiveSize = size ?? radius * 2 + strokeWidth;
  const adjustedRadius = (effectiveSize - strokeWidth) / 2;
  const circumference = 2 * Math.PI * adjustedRadius;
  const center = effectiveSize / 2;

  // ✅ Animated value cho single progress
  const animatedValue = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    if (value !== undefined) {
      const percent = Math.min(value / maxValue, 1);
      Animated.timing(animatedValue, {
        toValue: percent,
        duration,
        useNativeDriver: false,
      }).start();
    }
  }, [value, maxValue, duration, animatedValue]);

  if (value !== undefined) {
    // Tính dashOffset từ animated value
    const strokeDashoffset = animatedValue.interpolate({
      inputRange: [0, 1],
      outputRange: [circumference, 0],
    });

    return (
      <View style={{ alignItems: "center", justifyContent: "center" }}>
        <Svg width={effectiveSize} height={effectiveSize}>
          <G rotation="-90" originX={center} originY={center}>
            {/* Background */}
            <Circle
              cx={center}
              cy={center}
              r={adjustedRadius}
              stroke={backgroundColor}
              strokeWidth={strokeWidth}
              fill="transparent"
            />

            {/* Progress có animation */}
            <AnimatedCircle
              cx={center}
              cy={center}
              r={adjustedRadius}
              stroke={colors[0]}
              strokeWidth={strokeWidth}
              fill="transparent"
              strokeDasharray={circumference}
              strokeDashoffset={strokeDashoffset}
              strokeLinecap="butt"
            />
          </G>
        </Svg>

        {/* Center text */}
        {centerText && (
          <View style={StyleSheet.absoluteFillObject}>
            <View style={{ flex: 1, alignItems: "center", justifyContent: "center" }}>
              <Text style={{ color: centerTextColor, fontSize: 20, fontWeight: "bold" }}>
                {centerText}
              </Text>
            </View>
          </View>
        )}
      </View>
    );
  }

  // Nếu có segments → (advanced) animate từng segment cũng được,
  // nhưng để đơn giản thì hiển thị tĩnh như trước
  let cumulativePercent = 0;

  return (
    <View style={{ alignItems: "center", justifyContent: "center" }}>
      <Svg width={effectiveSize} height={effectiveSize}>
        <G rotation="-90" originX={center} originY={center}>
          {/* Background */}
          <Circle
            cx={center}
            cy={center}
            r={adjustedRadius}
            stroke={backgroundColor}
            strokeWidth={strokeWidth}
            fill="transparent"
          />

          {/* Segments */}
          {segments?.map((val, index) => {
            const percent = val / maxValue;
            const startOffset = circumference * (1 - cumulativePercent);
            const dashOffset = startOffset - circumference * percent;

            cumulativePercent += percent;

            return (
              <Circle
                key={index}
                cx={center}
                cy={center}
                r={adjustedRadius}
                stroke={colors[index % colors.length]}
                strokeWidth={strokeWidth}
                fill="transparent"
                strokeDasharray={circumference}
                strokeDashoffset={dashOffset}
                strokeLinecap="butt"
              />
            );
          })}
        </G>
      </Svg>

      {/* Center text */}
      {centerText && (
        <View style={StyleSheet.absoluteFillObject}>
          <View style={{ flex: 1, alignItems: "center", justifyContent: "center" }}>
            <Text style={{ color: centerTextColor, fontSize: 20, fontWeight: "bold" }}>
              {centerText}
            </Text>
          </View>
        </View>
      )}
    </View>
  );
}

// 👇 Animated wrapper cho Circle
const AnimatedCircle = Animated.createAnimatedComponent(Circle);
