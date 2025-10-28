import color from "@constants/color";
import { FONTS } from "@constants/fonts";
import Entypo from "@expo/vector-icons/Entypo";
import React, { Dispatch, SetStateAction } from "react";
import { Pressable, StyleSheet, Text, View } from "react-native";
import { Meal, MealDish } from "../../types/menu";
import { MealDishItem } from "./MealItem";

interface DayMealSectionProps {
  menuId: string;
  meal: Meal;
  isOpenModal: boolean;
  setIsOpenModal: Dispatch<SetStateAction<boolean>>;
  onDeleteDish: (mealId: string, dishId: string) => void;
  onOpenAddDishModal: (mealId: string, mealType: string) => void;
}

export const DayMealSection: React.FC<DayMealSectionProps> = ({
  menuId,
  meal,
  isOpenModal,
  setIsOpenModal,
  onDeleteDish,
  onOpenAddDishModal,
}) => {
  return (
    <View style={styles.mealSectionContainer}>
      {/* Header */}
      <View style={styles.mealSectionHeader}>
        <Text style={styles.mealSectionTitle}>{meal.mealType}</Text>
        <View style={styles.headerRight}>
          <Text style={styles.mealSectionCalories}>
            {meal.totalCalories} calo
          </Text>

          {isOpenModal && (
            <Pressable
              style={styles.addButton}
              onPress={() => onOpenAddDishModal(meal.id, meal.mealType)}
            >
              <Text style={styles.addButtonText}>Thêm</Text>
              <Entypo name="circle-with-plus" size={20} color={color.white} />
            </Pressable>
          )}
        </View>
      </View>

      {/* Dishes list */}
      {meal.mealDishes.length === 0 ? (
        <Text style={styles.noDishText}>Chưa có món ăn nào</Text>
      ) : (
        meal.mealDishes.map((item: MealDish) => (
          <MealDishItem
            key={item.id}
            item={item}
            isOpenModal={isOpenModal}
            menuId={menuId}
            onDelete={(dishId) => onDeleteDish(meal.id, dishId)}
          />
        ))
      )}
    </View>
  );
};

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
  headerRight: {
    flexDirection: "row",
    alignItems: "center",
    gap: 12,
  },
  mealSectionCalories: {
    fontFamily: FONTS.medium,
    fontSize: 14,
    color: color.grey,
  },
  addButton: {
    flexDirection: "row",
    alignItems: "center",
    gap: 4,
    paddingVertical: 4,
    paddingHorizontal: 8,
    borderRadius: 8,
    backgroundColor: color.light_green,
  },
  addButtonText: {
    fontFamily: FONTS.semiBold,
    fontSize: 13,
    color: color.white,
  },
  noDishText: {
    fontFamily: FONTS.regular,
    fontSize: 14,
    color: color.grey,
    fontStyle: "italic",
    paddingLeft: 8,
  },
});
