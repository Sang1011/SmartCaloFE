// MealSummary.js

import Color from "@constants/color";
import { FONTS } from "@constants/fonts";
import MaterialCommunityIcons from "@expo/vector-icons/MaterialCommunityIcons";
import React from "react";
import { StyleSheet, Text, View } from "react-native";
import { scale } from "react-native-size-matters";

interface Props {
  totalCal: number;
  protein: number;
  fat: number;
  sugar: number;
  fiber: number;
  isPro?: boolean;
}

const MealSummary = ({
  totalCal,
  protein,
  fat,
  sugar,
  fiber,
  isPro = false,
}: Props) => {
  // Dữ liệu macro dưới dạng mảng để dễ render
  const macros = isPro
    ? [
        { label: "Calories", value: totalCal, unit: "" },
        { label: "Protein", value: protein, unit: "g" },
        { label: "Chất Béo", value: fat, unit: "g" },
        { label: "Đường", value: sugar, unit: "g" },
        { label: "Chất Xơ", value: fiber, unit: "g" },
      ]
    : [
        { label: "Calories", value: totalCal, unit: "" },
        { label: "Protein", value: protein, unit: "g" },
        { label: "Chất Béo", value: fat, unit: "g" },
      ];

  return (
    <View style={summaryStyles.summaryContainer}>
      {/* Icon món ăn */}
      <View style={summaryStyles.mealIconWrapper}>
        <MaterialCommunityIcons
          name="food-fork-drink"
          size={50}
          color={Color.dark_green}
        />
      </View>

      {/* Tóm tắt Macro - 5 GIÁ TRỊ */}
      <View style={summaryStyles.macroSummaryRow}>
        {macros.map((macro, index) => (
          <React.Fragment key={macro.label}>
            <View style={summaryStyles.macroSummaryItem}>
              <Text style={summaryStyles.summaryValue}>
                {macro.value} {macro.unit}
              </Text>
              <Text style={summaryStyles.summaryLabel}>{macro.label}</Text>
            </View>
            {/* Không hiển thị Separator sau mục cuối cùng */}
            {index < macros.length - 1 && (
              <View style={summaryStyles.macroSummarySeparator} />
            )}
          </React.Fragment>
        ))}
      </View>
    </View>
  );
};

// =================================================================
// Styles cho MealSummary
// =================================================================
const summaryStyles = StyleSheet.create({
  summaryContainer: {
    padding: scale(20),
    backgroundColor: Color.white,
    alignItems: "center",
  },
  mealIconWrapper: {
    marginBottom: scale(15),
  },
  macroSummaryRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    width: "100%",
    paddingHorizontal: scale(5),
    paddingVertical: scale(15),
    borderWidth: 1,
    borderColor: Color.light_gray,
    borderRadius: 12,
  },
  macroSummaryItem: {
    alignItems: "center",
    flex: 1,
    paddingHorizontal: scale(2),
  },
  summaryValue: {
    fontSize: scale(13), // Giảm font để vừa
    fontFamily: FONTS.bold,
    color: Color.dark_green,
    textAlign: "center",
  },
  summaryLabel: {
    fontSize: scale(10), // Giảm font để vừa
    fontFamily: FONTS.medium,
    color: Color.gray,
    marginTop: scale(2),
    textAlign: "center",
  },
  macroSummarySeparator: {
    width: 1,
    height: "100%",
    backgroundColor: Color.light_gray,
  },
});

export default MealSummary;
