import color from "@constants/color";
import { FONTS } from "@constants/fonts";
import { Ionicons } from "@expo/vector-icons";
import { navigateCustom } from "@utils/navigation";
import React from "react";
import { Image, Pressable, StyleSheet, Text, View } from "react-native";
import { MealDish } from "../../types/menu";

interface MealDishItemProps {
  menuId: string;
  item: MealDish;
}

export const MealDishItem: React.FC<MealDishItemProps> = ({ menuId, item }) => {
  return (
    <Pressable style={styles.mealItemContainer}>
      <Image src={item.imageUrl} style={styles.mealItemImage} />
      <View style={styles.mealItemDetails}>
        <View style={styles.mealItemDetailsUpper}>
          <View style={{ flexDirection: "column", justifyContent: "center" }}>
            <Text style={styles.mealItemName} numberOfLines={1}>
              {item.name}
            </Text>
            <Text style={styles.mealItemCalories}>Calo: {item.calories}</Text>
          </View>
          <Pressable
            style={styles.viewDetailContainer}
            onPress={() => navigateCustom("/dishes", {
                params: {
                    id: item.dishId,
                    menuId: menuId
                }
            })}
          >
            <Text style={styles.viewDetailText}>Xem chi tiết</Text>
            <Ionicons
              name="chevron-forward"
              size={16}
              color={color.light_gray}
            />
          </Pressable>
        </View>
        <View style={styles.mealItemMacros}>
          <Text style={[styles.macroText, styles.carb]}>{item.carbs} Carb</Text>
          <Text style={[styles.macroText, styles.protein]}>
            {item.protein} Protein
          </Text>
          <Text style={[styles.macroText, styles.fat]}>{item.fat} Fat</Text>
        </View>
      </View>
    </Pressable>
  );
};

// Reuse the relevant styles here
const styles = StyleSheet.create({
  // ... (meal item styles)
  mealItemContainer: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: color.white,
    borderRadius: 12,
    padding: 10,
    marginBottom: 10,
    borderWidth: 1,
    borderColor: "#E8E8E8",
    elevation: 2,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
  },
  mealItemImage: {
    width: 60,
    height: 60,
    borderRadius: 8,
    marginRight: 12,
  },
  mealItemDetails: {
    flex: 1,
  },
  mealItemDetailsUpper: {
    flexDirection: "row",
    display: "flex",
    justifyContent: "space-around",
    alignItems: "center",
  },
  mealItemName: {
    fontFamily: FONTS.semiBold,
    fontSize: 15,
    color: color.black,
    width: 175,
  },
  mealItemCalories: {
    fontFamily: FONTS.medium,
    fontSize: 12,
    color: color.calories,
    marginVertical: 4,
  },
  mealItemMacros: {
    flexDirection: "row",
    gap: 8,
  },
  macroText: {
    fontFamily: FONTS.medium,
    fontSize: 11,
    borderRadius: 10,
    paddingVertical: 5,
    paddingHorizontal: 8,
  },
  carb: {
    backgroundColor: color.macro_span_carb_bg,
    color: color.macro_span_carb_color,
  },
  protein: {
    backgroundColor: color.macro_span_protein_bg,
    color: color.macro_span_protein_color,
  },
  fat: {
    backgroundColor: color.macro_span_fat_bg,
    color: color.macro_span_fat_color,
  },
  viewDetailContainer: {
    width: 80,
    marginLeft: "auto",
    flexDirection: "row",
    alignItems: "flex-start",
    justifyContent: "center",
  },
  viewDetailText: {
    fontFamily: FONTS.regular,
    fontSize: 12,
    color: color.gray,
  },
});
