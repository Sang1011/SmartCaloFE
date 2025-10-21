import color from "@constants/color";
import { FONTS } from "@constants/fonts";
import React, { Dispatch, SetStateAction, useEffect } from "react";
import { StyleSheet, Text, View } from "react-native";
import { Meal, MealDish } from "../../types/menu";
import { MealDishItem } from "./MealItem";

interface DayMealSectionProps {
  menuId: string;
  meal: Meal;
  // These props are passed down but not directly used in the section
  dishList: MealDish[] | []; 
  setDishList: Dispatch<SetStateAction<MealDish[] | []>>;
}

export const DayMealSection: React.FC<DayMealSectionProps> = ({ menuId, meal, dishList, setDishList }) => {
    useEffect(() => {
      if (meal?.mealDishes && meal.mealDishes.length > 0) {
        setDishList(meal.mealDishes);
      }
    }, [meal, setDishList]);
  
    return (
      <View style={styles.mealSectionContainer}>
        <View style={styles.mealSectionHeader}>
          <Text style={styles.mealSectionTitle}>{meal.mealType}</Text>
          <Text style={styles.mealSectionCalories}>{meal.totalCalories} calo</Text>
        </View>
        {dishList.map((item: MealDish) => (
          <MealDishItem 
            key={item.id} 
            item={item}
            menuId={menuId}
          />
        ))}
      </View>
    );
  };

// Reuse the relevant styles here
const styles = StyleSheet.create({
  mealSectionContainer: {
    marginTop: 24,
  },
  mealSectionHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 12,
  },
  mealSectionTitle: {
    fontFamily: FONTS.bold,
    fontSize: 18,
    color: color.black,
  },
  mealSectionCalories: {
    fontFamily: FONTS.medium,
    fontSize: 14,
    color: color.light_gray,
  },
});