import color from "@constants/color";
import { FONTS } from "@constants/fonts";
import Entypo from '@expo/vector-icons/Entypo';
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
  onOpenAddDishModal: (mealId: string, mealType: string) => void; // ✅ Thêm prop này
}

export const DayMealSection: React.FC<DayMealSectionProps> = ({ 
  menuId, 
  meal, 
  isOpenModal, 
  setIsOpenModal,
  onDeleteDish,
  onOpenAddDishModal 
}) => {
  
  return (
    <View style={styles.mealSectionContainer}>
      <View style={styles.mealSectionHeader}>
        <Text style={styles.mealSectionTitle}>{meal.mealType}</Text>
        <View style={styles.headerRight}>
          <Text style={styles.mealSectionCalories}>{meal.totalCalories} calo</Text>
          {isOpenModal && (
            <Pressable 
              style={styles.addButton}
              onPress={() => onOpenAddDishModal(meal.id, meal.mealType)}
            >
              <Text style={styles.addButtonText}>Thêm</Text>
              <Entypo name="circle-with-plus" size={20} color={color.dark_green} />
            </Pressable>
          )}
        </View>
      </View>
      {meal.mealDishes.map((item: MealDish) => (
        <MealDishItem 
          key={item.id} 
          item={item}
          isOpenModal={isOpenModal}
          menuId={menuId}
          onDelete={(dishId) => onDeleteDish(meal.id, dishId)}
        />
      ))}
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
    backgroundColor: color.light_green || "#E8F5E9",
  },
  addButtonText: {
    fontFamily: FONTS.semiBold,
    fontSize: 13,
    color: color.dark_green,
  },
});