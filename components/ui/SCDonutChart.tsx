import color from "@constants/color";
import React from "react";
import { View, Text, StyleSheet } from "react-native";
import Svg, { Circle, G } from "react-native-svg";

interface ISCDonutChartProps {
  value?: number;              // dùng cho single progress
  segments?: number[];         // nhiều segment
  colors?: string[];           // màu cho segment
  maxValue: number;            // giá trị tổng tối đa
  strokeWidth?: number;
  radius?: number;
  size?: number;               // 👈 thêm để chỉnh kích thước trực tiếp
  centerText?: string;
  centerTextColor?: string;
  backgroundColor?: string;    // màu nền vòng tròn
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
  size, // 👈 lấy từ props
  centerText,
  centerTextColor = color.black,
  backgroundColor = color.donut_chart_background,
  maxValue,
}: ISCDonutChartProps) {
  // Nếu truyền size → tự tính radius từ size
  const effectiveSize = size ?? radius * 2 + strokeWidth;
  const adjustedRadius = (effectiveSize - strokeWidth) / 2;
  const circumference = 2 * Math.PI * adjustedRadius;
  const center = effectiveSize / 2;

  // Nếu có value thì coi như progress 1 vòng
  if (value !== undefined) {
    const percent = value / maxValue;
    const dashOffset = circumference * (1 - percent);

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

            {/* Progress */}
            <Circle
              cx={center}
              cy={center}
              r={adjustedRadius}
              stroke={colors[0]}
              strokeWidth={strokeWidth}
              fill="transparent"
              strokeDasharray={circumference}
              strokeDashoffset={dashOffset}
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

  // Nếu có segments
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
