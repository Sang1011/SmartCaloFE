import color from "@constants/color";
import { calculateDailyMacroTargets, calculateNutritionPercentages } from "@utils/calculateNutrionPercentages";
import React from "react";
import { StyleSheet, Text, View } from "react-native";
import { Dish } from "../../types/dishes";

type UserProfile = {
  tdee: number;
  gender: "male" | "female";
  age: number;
  goal: "maintain" | "loseWeight" | "gainWeight" | "gainMuscle";
};

export default function NutritionSummary({
  selectedDish,
  userProfile,
}: {
  selectedDish: Dish;
  userProfile: UserProfile;
}) {
  if (!selectedDish) return null;

  const dailyTargets = calculateDailyMacroTargets(
    userProfile.tdee,
    userProfile.gender,
    userProfile.age,
    userProfile.goal
  );

  // 🍱 Cấu trúc năng lượng nội tại của món
  const energyRatio = calculateNutritionPercentages(selectedDish);

  // 🧩 Helper
  const getPercentLabel = (value: number, target: number) =>
    ((value / target) * 100).toFixed(1) + "%";

  const renderRow = (
    label: string,
    value: number,
    target: number,
    barColor: string
  ) => {
    const percent = value / target;
    const exceeded = percent > 1;

    return (
      <View style={styles.row}>
        <View style={styles.rowHeader}>
          <Text style={styles.label}>{label}</Text>
          <Text style={styles.value}>
            {value}/{target}g ({getPercentLabel(value, target)})
          </Text>
        </View>
        <View style={styles.progressContainer}>
          <View
            style={[
              styles.progressFill,
              {
                width: `${Math.min(percent * 100, 100)}%`,
                backgroundColor: exceeded ? "#ff4d4d" : barColor,
              },
            ]}
          />
        </View>
      </View>
    );
  };

  // 🔹 Tổng calories của món và % so với TDEE
  const totalCalories = energyRatio.totalCaloriesCalc;
  const percentCalories = (
    (totalCalories / dailyTargets.calories) *
    100
  ).toFixed(1);

  return (
    <View style={styles.container}>
      {/* --- PHẦN 1: Tổng quan --- */}
      <Text style={styles.title}>Tổng quan dinh dưỡng</Text>
      <Text style={styles.subTitle}>
        So sánh lượng dinh dưỡng của món với nhu cầu 1 ngày của bạn
      </Text>

      <Text style={styles.caloriesText}>
        {Math.round(totalCalories)} kcal ({percentCalories}% nhu cầu/ngày)
      </Text>

      {renderRow(
        "Protein",
        selectedDish.protein ?? 0,
        dailyTargets.protein,
        "#4CAF50"
      )}
      {renderRow(
        "Chất béo",
        selectedDish.fat ?? 0,
        dailyTargets.fat,
        "#FF9800"
      )}
      {renderRow(
        "Carbs",
        selectedDish.carbs ?? 0,
        dailyTargets.carbs,
        "#2196F3"
      )}
      {renderRow(
        "Chất xơ",
        selectedDish.fiber ?? 0,
        dailyTargets.fiber,
        "#9C27B0"
      )}
      {renderRow(
        "Đường",
        selectedDish.sugar ?? 0,
        dailyTargets.sugar,
        "#E91E63"
      )}

      {/* --- PHẦN 2: Cấu trúc món --- */}
      <View style={styles.summary}>
        <Text style={styles.summaryTitle}>Cơ cấu năng lượng trong món</Text>
        <Text style={styles.summaryDesc}>
          Cho biết món ăn này lấy năng lượng từ đâu — chất đạm, béo hay tinh
          bột.
        </Text>

        <View style={styles.macroTable}>
          <View style={styles.macroRow}>
            <Text style={styles.macroLabel}>Protein</Text>
            <Text style={[styles.macroValue, { backgroundColor: color.macro_span_protein_bg, color: color.macro_span_protein_color}]}>{energyRatio.protein}%</Text>
          </View>
          <View style={styles.macroRow}>
            <Text style={styles.macroLabel}>Chất bột đường (Carbs)</Text>
            <Text style={[styles.macroValue, { backgroundColor: color.macro_span_carb_bg, color: color.macro_span_carb_color}]}>{energyRatio.carbs}%</Text>
          </View>
          <View style={styles.macroRow}>
            <Text style={styles.macroLabel}>Chất béo (Fat)</Text>
            <Text style={[styles.macroValue, { backgroundColor: color.macro_span_fat_bg, color: color.macro_span_fat_color}]}>{energyRatio.fat}%</Text>
          </View>
        </View>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    backgroundColor: "#fff",
    padding: 16,
    borderRadius: 16,
    shadowColor: "#000",
    shadowOpacity: 0.1,
    shadowRadius: 6,
    elevation: 3,
  },
  title: {
    fontSize: 20,
    fontWeight: "700",
    marginBottom: 4,
    textAlign: "center"
  },
  subTitle: {
    fontSize: 13,
    color: "#666",
    marginBottom: 12,
  },
  caloriesText: {
    fontSize: 15,
    fontWeight: "600",
    color: "#444",
    marginBottom: 10,
  },
  row: {
    marginBottom: 10,
  },
  rowHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
  },
  label: {
    fontSize: 15,
    fontWeight: "600",
  },
  value: {
    fontSize: 14,
    color: "#555",
  },
  progressContainer: {
    height: 8,
    borderRadius: 4,
    backgroundColor: "#eee",
    overflow: "hidden",
    marginTop: 4,
  },
  progressFill: {
    height: "100%",
    borderRadius: 4,
  },
  summary: {
    marginTop: 20,
    backgroundColor: "#f9f9f9",
    padding: 10,
    borderRadius: 12,
  },
  summaryTitle: {
    fontWeight: "700",
    fontSize: 18,
    textAlign: "center"
  },
  summaryDesc: {
    fontSize: 13,
    color: "#666",
    marginTop: 4,
  },
  macroTable: {
    marginTop: 4,
  },
  macroRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginVertical: 2,
  },
  macroLabel: {
    fontSize: 14,
    color: "#333",
  },
  macroValue: {
    fontSize: 14,
    fontWeight: "600",
    paddingVertical: 4,
    paddingHorizontal: 10,
    borderRadius: 15,
  },
  totalEnergy: {
    marginTop: 10,
    color: "#555",
    fontWeight: "500",
  },
});
