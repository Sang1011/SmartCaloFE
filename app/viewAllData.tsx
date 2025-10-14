// ViewAllDataScreen.js

import EditMealsModal from "@components/ui/editMealSectionModal";
import Color from "@constants/color";
import { FONTS } from "@constants/fonts";
import AntDesign from "@expo/vector-icons/AntDesign";
import Feather from "@expo/vector-icons/Feather";
import { navigateCustom } from "@utils/navigation";
import React, { useState } from "react";
import { Pressable, ScrollView, StyleSheet, Text, View } from "react-native";
import { scale } from "react-native-size-matters";

// Định nghĩa kiểu dữ liệu (Giữ nguyên)
export type MealItem = {
  id: string;
  name: string;
  quantity: string;
  calories: number;
};
export type MealSection = {
  id: string;
  name: string;
  totalCalories: number; // Lưu ý: Nên tính toán lại khi xóa món
  items: MealItem[];
};

// Dữ liệu giả định ban đầu (Giữ nguyên)
const initialMealData: MealSection[] = [
  {
    id: "meal-1",
    name: "Breakfast",
    totalCalories: 448,
    items: [
      {
        id: "item-1",
        name: "Olive Oil",
        quantity: "1 tbsp. (13½ g)",
        calories: 119,
      },
      {
        id: "item-2",
        name: "Apple",
        quantity: "1 fruit (182 g)",
        calories: 95,
      },
      {
        id: "item-3",
        name: "Chicken Breast, cooked, Chicken Breast, cooked",
        quantity: "1 whole (58 g)",
        calories: 114,
      },
      {
        id: "item-4",
        name: "Olive Oil",
        quantity: "1 tbsp. (13½ g)",
        calories: 119,
      },
    ],
  },
  {
    id: "meal-2",
    name: "Lunch",
    totalCalories: 234,
    items: [
      {
        id: "item-5",
        name: "Chicken Breast, cooked",
        quantity: "1 whole (58 g)",
        calories: 114,
      },
      {
        id: "item-6",
        name: "Olive Oil",
        quantity: "1 tbsp. (13½ g)",
        calories: 119,
      },
    ],
  },
  {
    id: "meal-3",
    name: "Afternoon",
    totalCalories: 234,
    items: [
      {
        id: "item-7",
        name: "Chicken Breast, cooked",
        quantity: "1 whole (58 g)",
        calories: 114,
      },
      {
        id: "item-8",
        name: "Olive Oil",
        quantity: "1 tbsp. (13½ g)",
        calories: 119,
      },
    ],
  },
];

export default function ViewAllDataScreen() {
  const [mealData, setMealData] = useState(initialMealData);
  const [isEditModalVisible, setIsEditModalVisible] = useState(false);

  // Hàm xử lý việc xóa (Section và/hoặc Items)
  const handleDeleteItemsOrSections = (sectionsToKeep: MealSection[]) => {
    // Cập nhật lại state với dữ liệu đã được xóa/chỉnh sửa
    // và tính toán lại tổng Calorie cho mỗi section
    const updatedData = sectionsToKeep.map((section) => {
      const newTotalCalories = section.items.reduce(
        (sum, item) => sum + item.calories,
        0
      );
      return {
        ...section,
        totalCalories: newTotalCalories,
      };
    });

    // Chỉ giữ lại các section có món ăn bên trong
    setMealData(updatedData.filter((section) => section.items.length > 0));
  };

  return (
    <View style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <Pressable onPress={() => navigateCustom("/tabs")}>
          <AntDesign name="arrow-left" size={24} color={Color.black} />
        </Pressable>
        <Text style={styles.headerTitle}>Nutrition</Text>
        <Pressable onPress={() => setIsEditModalVisible(true)}>
          <Feather name="edit" size={24} color={Color.dark_green} />
        </Pressable>
      </View>

      {/* Scrollable Content */}
      <ScrollView contentContainerStyle={styles.scrollViewContent}>
        {mealData.length > 0 ? (
          mealData.map((mealSection) => (
            <View key={mealSection.id} style={styles.mealSection}>
              {/* Meal Header (Breakfast / Lunch) */}
              <View style={styles.mealHeader}>
                <Text style={styles.mealTitle}>{mealSection.name}</Text>
                <Text style={styles.mealTotalCalories}>
                  {mealSection.totalCalories} Cal
                </Text>
              </View>

              {/* Meal Items List */}
              {mealSection.items.map((item, index) => (
                <View
                  key={item.id}
                  style={[
                    styles.mealItemRow,
                    index < mealSection.items.length - 1 &&
                      styles.mealItemSeparator,
                  ]}
                >
                  <View style={{ width: "80%"}}>
                    <Text style={styles.mealItemName}>{item.name}</Text>
                    <Text style={styles.mealItemQuantity}>{item.quantity}</Text>
                  </View>
                  <Text style={styles.mealItemCalories}>
                    {item.calories} Cal
                  </Text>
                </View>
              ))}
            </View>
          ))
        ) : (
          <Text style={styles.emptyDataText}>Chưa có dữ liệu bữa ăn nào.</Text>
        )}
      </ScrollView>

      {/* Modal Chỉnh sửa linh hoạt */}
      <EditMealsModal
        isVisible={isEditModalVisible}
        onClose={() => setIsEditModalVisible(false)}
        mealSections={mealData}
        onSave={() => handleDeleteItemsOrSections} // Giờ là onSave, nhận dữ liệu mới
      />
    </View>
  );
}

// ... Styles (giữ nguyên từ lần chỉnh sửa cuối)
const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Color.white,
  },
  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingHorizontal: scale(15),
    paddingTop: scale(40),
    paddingBottom: scale(15),
    backgroundColor: Color.white,
    borderBottomWidth: 1,
    borderBottomColor: Color.light_gray,
  },
  headerTitle: {
    fontSize: scale(18),
    fontFamily: FONTS.semiBold,
    color: Color.black,
  },
  scrollViewContent: {
    flexGrow: 1,
    paddingVertical: scale(5),
    paddingBottom: scale(80),
    backgroundColor: Color.white,
  },
  mealSection: {
    marginTop: scale(10),
    marginBottom: scale(5),
    backgroundColor: Color.white,
    borderRadius: 12,
    marginHorizontal: scale(15),
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  mealHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingHorizontal: scale(15),
    paddingVertical: scale(12),
    borderBottomWidth: 1,
    borderBottomColor: Color.light_gray,
  },
  mealTitle: {
    fontSize: scale(16),
    fontFamily: FONTS.bold,
    color: Color.dark_green,
  },
  mealTotalCalories: {
    fontSize: scale(16),
    fontFamily: FONTS.bold,
    color: Color.dark_green,
  },
  mealItemRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingHorizontal: scale(15),
    paddingVertical: scale(12),
  },
  mealItemSeparator: {
    borderBottomWidth: 1,
    borderBottomColor: Color.light_gray,
  },
  mealItemName: {
    fontSize: scale(14),
    fontFamily: FONTS.medium,
    color: Color.black,
  },
  mealItemQuantity: {
    fontSize: scale(12),
    fontFamily: FONTS.regular,
    color: Color.gray,
  },
  mealItemCalories: {
    fontSize: scale(14),
    fontFamily: FONTS.semiBold,
    color: Color.black,
  },
  floatingButton: {
    position: "absolute",
    bottom: scale(30),
    left: scale(20),
    backgroundColor: Color.dark_green,
    borderRadius: scale(30),
    width: scale(60),
    height: scale(60),
    justifyContent: "center",
    alignItems: "center",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 4.65,
    elevation: 8,
  },
  emptyDataText: {
    textAlign: "center",
    marginTop: scale(50),
    fontSize: scale(16),
    fontFamily: FONTS.regular,
    color: Color.gray,
  },
});
