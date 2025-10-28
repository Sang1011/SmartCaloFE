import color from "@constants/color";
import { FONTS } from "@constants/fonts";
import { Feather } from "@expo/vector-icons";
import React, { useMemo } from "react";
import { StyleSheet, Text, View } from "react-native";
import { MealDish } from "../../types/menu";

type NutrientType = "carbs" | "protein" | "fat";

interface NutritionInfoCardProps {
  icon: keyof typeof Feather.glyphMap;
  label: string;
  nutrientType: "carbs" | "protein" | "fat";
  dishList?: MealDish[];        // không bắt buộc
  nutrientValue?: number;       // ✅ thêm prop mới
}

const NutritionInfoCard: React.FC<NutritionInfoCardProps> = ({
  icon,
  label,
  dishList,
  nutrientType,
  nutrientValue, // 👈 nếu có sẵn thì xài luôn
}) => {
  const value = useMemo(() => {
    if (nutrientValue !== undefined) return nutrientValue; 
    if (!dishList || dishList.length === 0) return 0;
    return dishList.reduce((sum, item) => sum + (item[nutrientType] ?? 0), 0);
  }, [dishList, nutrientType, nutrientValue]);

  return (
    <View style={styles.card}>
      <View style={styles.header}>
        <Feather name={icon} size={18} color={color.white} />
        <Text style={styles.label}>{label}</Text>
      </View>
      <Text style={styles.value}>{value.toFixed(1)}g</Text>
    </View>
  );
};


const styles = StyleSheet.create({
  card: {
    flex: 1,
    backgroundColor: color.dark_green,
    borderRadius: 14,
    paddingVertical: 10,
    paddingHorizontal: 12,
    alignItems: "center",
    justifyContent: "center",
    shadowColor: "#000",
    shadowOpacity: 0.1,
    shadowRadius: 3,
    shadowOffset: { width: 0, height: 1 },
    elevation: 2,
  },
  header: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 6,
  },
  label: {
    fontFamily: FONTS.medium,
    fontSize: 13,
    color: color.white,
    marginLeft: 6,
    opacity: 0.9,
  },
  value: {
    fontFamily: FONTS.bold,
    fontSize: 20,
    color: color.white,
  },
});

export default NutritionInfoCard;
