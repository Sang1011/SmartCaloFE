import Color from "@constants/color";
import { FONTS } from "@constants/fonts";
import { AntDesign } from "@expo/vector-icons";
import { BlurView } from "expo-blur";
import React from "react";
import { StyleSheet, Text, View } from "react-native";
import { scale } from "react-native-size-matters";
import { GetDailyLogResponse } from "../../types/tracking";

interface NutritionBarChartProps {
  data: GetDailyLogResponse;
  isPro: boolean;
}

const NutritionBarChart = ({ data, isPro }: NutritionBarChartProps) => {
  const nutrients = [
    {
      key: "Calories",
      consumed: data.totalCaloriesConsumed,
      target: data.totalCaloriesTarget,
      color: "#2ecc71", // Green
      unit: "kcal",
    },
    {
      key: "Protein",
      consumed: data.totalProteinConsumed,
      target: data.totalProteinTarget,
      color: "#3498db", // Blue
      unit: "g",
    },
    {
      key: "Carbs",
      consumed: data.totalCarbsConsumed,
      target: data.totalCarbsTarget,
      color: "#f1c40f", // Yellow
      unit: "g",
    },
    {
      key: "Fat",
      consumed: data.totalFatConsumed,
      target: data.totalFatTarget,
      color: "#e67e22", // Orange
      unit: "g",
    },
    // Phần PREMIUM
    {
      key: "Fiber",
      consumed: data.totalFiberConsumed,
      target: data.totalFiberTarget,
      color: "#9b59b6", // Purple
      unit: "g",
    },
    {
      key: "Sugar",
      consumed: data.totalSugarConsumed,
      target: data.totalSugarTarget,
      color: "#e74c3c", // Red
      unit: "g",
    },
  ];

  return (
    <View style={styles.container}>
      {nutrients.map((n) => {
        const isLocked = !isPro && (n.key === "Fiber" || n.key === "Sugar");
        // Lấy Max của Consumed và Target, sau đó lấy giá trị lớn hơn hoặc 100
        const maxScaleValue = Math.max(n.consumed, n.target, 100); 

        // Tỷ lệ so với giá trị lớn nhất (để không bị tràn)
        const consumedPercent = (n.consumed / maxScaleValue) * 100;
        const targetPercent = (n.target / maxScaleValue) * 100;

        return (
          <View key={n.key} style={styles.rowContainer}>
            {/* Label */}
            <Text style={styles.label}>{n.key}</Text>

            {/* Bar Chart Group */}
            <View style={styles.barGroup}>
              {/* Bar Background (Target) */}
              <View style={styles.barBackground}>
                {/* Target Marker (Vẽ một thanh mỏng đại diện cho mục tiêu) */}
                <View
                  style={[
                    styles.barTarget,
                    { left: `${targetPercent}%` },
                  ]}
                />
                
                {/* Consumed Bar (Thanh màu) */}
                <View
                  style={[
                    styles.barConsumed,
                    { width: `${consumedPercent}%`, backgroundColor: n.color },
                  ]}
                />
              </View>

              {/* Consumed Value Text */}
              <Text style={styles.valueText}>
                {Math.round(n.consumed)}/{Math.round(n.target)}
              </Text>
            </View>

            {/* Overlay khóa PREMIUM */}
            {isLocked && (
              // Dùng BlurView để làm mờ nội dung phía sau
              <BlurView intensity={20} tint="dark" style={styles.lockOverlay}>
                <View style={styles.lockInner}>
                  <AntDesign name="lock" size={scale(12)} color={Color.white} />
                  <Text style={styles.lockText}> PREMIUM</Text>
                </View>
              </BlurView>
            )}
          </View>
        );
      })}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    padding: scale(15),
    backgroundColor: Color.white,
    borderRadius: scale(12),
    gap: scale(14),
  },
  rowContainer: {
    position: "relative",
    flexDirection: "row",
    alignItems: "center",
  },
  label: {
    fontSize: scale(12),
    fontFamily: FONTS.medium,
    color: Color.black,
    width: scale(70), // Cố định chiều rộng cho label
  },
  barGroup: {
    flex: 1, // Chiếm phần còn lại của không gian
    flexDirection: "row",
    alignItems: "center",
    marginHorizontal: scale(10),
  },
  barBackground: {
    flex: 1,
    height: scale(15),
    backgroundColor: Color.gray_light, // Thanh nền xám
    borderRadius: scale(8),
    overflow: "hidden",
    position: "relative",
  },
  barConsumed: {
    height: "100%",
    borderRadius: scale(8),
  },
  barTarget: {
    position: "absolute",
    top: 0,
    bottom: 0,
    width: scale(3), // Độ dày của vạch Target
    backgroundColor: Color.black, // Màu của vạch Target
    zIndex: 2, // Đảm bảo vạch nằm trên thanh Consumed
  },
  valueText: {
    fontSize: scale(12),
    fontFamily: FONTS.medium,
    color: Color.black,
    marginLeft: scale(8),
    width: scale(30), // Cố định chiều rộng cho giá trị tiêu thụ
    textAlign: "right",
  },
  targetText: {
    fontSize: scale(12),
    fontFamily: FONTS.regular,
    color: Color.gray_dark,
    width: scale(30), // Cố định chiều rộng cho giá trị mục tiêu
    textAlign: "right",
  },
  // --- Lock Overlay Styles ---
  lockOverlay: {
    position: "absolute",
    top: 0,
    bottom: 0,
    left: scale(70), // Bắt đầu sau label
    right: 0,
    // Màu overlay tối (không dùng BlurView) - Cần loại bỏ backgroundColor nếu dùng BlurView
    // backgroundColor: Color.black_50, 
    borderRadius: scale(12),
    overflow: 'hidden', // Quan trọng để BlurView cắt theo borderRadius
    justifyContent: "center",
    alignItems: "center",
  },
  lockInner: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: Color.black_70, // Nền cho chữ PREMIUM
    borderRadius: scale(10),
    paddingHorizontal: scale(10),
    paddingVertical: scale(6),
  },
  lockText: {
    fontSize: scale(11),
    fontFamily: FONTS.bold,
    color: Color.white,
    marginLeft: scale(4),
  },
});

export default NutritionBarChart;