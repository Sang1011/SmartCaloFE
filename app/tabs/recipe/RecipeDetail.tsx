import color from "@constants/color";
import { FONTS } from "@constants/fonts";
import { Feather, Ionicons } from "@expo/vector-icons";
import { navigateCustom } from "@utils/navigation";
import { router } from "expo-router";
import React, { useState } from "react";
import {
  Image,
  ImageBackground,
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  View,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

// Dữ liệu đã được cập nhật để khớp với hình ảnh mới
const recipeDetails = {
  id: 1,
  title: "Meal plan chuẩn gym: Tăng cơ, Giảm mỡ, Sống khỏe",
  image: require("../../../assets/images/recipe_1.png"), // Giữ hoặc thay bằng ảnh banner của bạn
  totalCalories: 1290,
  nutrition: {
    protein: "903g",
    fat: "434g",
    carbs: "1,358g",
  },
  meals: {
    breakfast: {
      title: "Buổi sáng",
      totalCalories: 240,
      items: [
        {
          id: "b1",
          name: "Trứng ốp la",
          calories: 84,
          carb: "0.9g",
          protein: "6.4g",
          fat: "6.1g",
          image: require("../../../assets/images/recipe_1.png"),
        },
        {
          id: "b2",
          name: "Bánh mì Sandwich",
          calories: 144,
          carb: "25.5g",
          protein: "5g",
          fat: "2.5g",
          image: require("../../../assets/images/recipe_1.png"),
        },
        {
          id: "b3",
          name: "Rau xà lách",
          calories: 12,
          carb: "1.5g",
          protein: "1g",
          fat: "0.1g",
          image: require("../../../assets/images/recipe_1.png"),
        },
      ],
    },
    lunch: {
      title: "Buổi trưa",
      totalCalories: 432,
      items: [
        {
          id: "l1",
          name: "Súp lơ xanh luộc",
          calories: 40,
          carb: "6.1g",
          protein: "3.1g",
          fat: "0.3g",
          image: require("../../../assets/images/recipe_1.png"),
        },
        {
          id: "l2",
          name: "Cơm gạo lứt đỏ",
          calories: 169,
          carb: "35.8g",
          protein: "3.5g",
          fat: "1.3g",
          image: require("../../../assets/images/recipe_1.png"), // Cần ảnh cơm gạo lứt
        },
        {
          id: "l3",
          name: "Gà kho sả",
          calories: 223,
          carb: "7.8g",
          protein: "24.7g",
          fat: "9.9g",
          image: require("../../../assets/images/recipe_1.png"),
        },
      ],
    },
    dinner: {
      title: "Buổi tối",
      totalCalories: 449,
      items: [
        {
          id: "d1",
          name: "Su su luộc",
          calories: 25,
          carb: "5.1g",
          protein: "0.9g",
          fat: "0.1g",
          image: require("../../../assets/images/recipe_1.png"),
        },
        {
          id: "d2",
          name: "Ức gà áp chảo",
          calories: 302,
          carb: "1.2g",
          protein: "57.4g",
          fat: "8g",
          image: require("../../../assets/images/recipe_2.png"),
        },
        {
          id: "d3",
          name: "Khoai lang luộc",
          calories: 122,
          carb: "23.2g",
          protein: "0.8g",
          fat: "0.2g",
          image: require("../../../assets/images/recipeDetail/dish_chicken.png"), // Cần ảnh khoai lang
        },
      ],
    },
  },
};

const NutritionInfo = ({ icon, label, value }) => (
  <View style={styles.nutritionCard}>
    <View style={styles.nutritionHeader}>
      <Feather name={icon} size={16} color={color.white} />
      <Text style={styles.nutritionLabel}>{label}</Text>
    </View>
    <Text style={styles.nutritionValue}>{value}</Text>
  </View>
);

const MealItem = ({ item }) => (
  <Pressable style={styles.mealItemContainer}>
    <Image source={item.image} style={styles.mealItemImage} />
    <View style={styles.mealItemDetails}>
      <View style={styles.mealItemDetailsUpper}>
        <View style={{ flexDirection: "column", justifyContent: "center" }}>
          <Text style={styles.mealItemName} numberOfLines={1}>
            {item.name}
          </Text>
          <Text style={styles.mealItemCalories}>Calo: {item.calories}</Text>
        </View>
        <Pressable style={styles.viewDetailContainer} onPress={() => navigateCustom("/dishes")}>
          <Text style={styles.viewDetailText}>Xem chi tiết</Text>
          <Ionicons name="chevron-forward" size={16} color={color.light_gray} />
        </Pressable>
      </View>
      <View style={styles.mealItemMacros}>
        <Text style={[styles.macroText, styles.carb]}>{item.carb} Carb</Text>
        <Text style={[styles.macroText, styles.protein]}>
          {item.protein} Protein
        </Text>
        <Text style={[styles.macroText, styles.fat]}>{item.fat} Fat</Text>
      </View>
    </View>
  </Pressable>
);

const MealSection = ({ meal }) => (
  <View style={styles.mealSectionContainer}>
    <View style={styles.mealSectionHeader}>
      <Text style={styles.mealSectionTitle}>{meal.title}</Text>
      <Text style={styles.mealSectionCalories}>{meal.totalCalories} calo</Text>
    </View>
    {meal.items.map((item) => (
      <MealItem key={item.id} item={item} />
    ))}
  </View>
);

export default function RecipeDetail() {
  const [activeDay, setActiveDay] = useState(25);
  const [currentWeek, setCurrentWeek] = useState(Math.ceil(25 / 7)); // ✅ tuần hiện tại dựa theo ngày

  const days = Array.from({ length: 30 }, (_, i) => i + 1);
  const totalWeeks = Math.ceil(days.length / 7);

  // Lấy ra 7 ngày tương ứng của tuần hiện tại
  const start = (currentWeek - 1) * 7;
  const visibleDays = days.slice(start, start + 7);

  const handlePrev = () => {
    setCurrentWeek((prev) => (prev > 1 ? prev - 1 : 1));
  };

  const handleNext = () => {
    setCurrentWeek((prev) => (prev < totalWeeks ? prev + 1 : totalWeeks));
  };

  return (
    <SafeAreaView edges={["top"]} style={styles.safeArea}>
      <ScrollView
        style={{ marginTop: -50 }}
        showsVerticalScrollIndicator={false}
      >
        <ImageBackground
          source={recipeDetails.image}
          style={styles.bannerImage}
        >
          <Pressable onPress={() => router.back()} style={styles.backButton}>
            <Ionicons name="arrow-back" size={24} color={color.white} />
          </Pressable>
        </ImageBackground>

        <View style={styles.contentContainer}>
          <Text style={styles.mainTitle}>{recipeDetails.title}</Text>

          <Text style={styles.subTitle}>Thực đơn theo ngày</Text>
          <View style={styles.dayRow}>
            {currentWeek !== 1 && (
              <Pressable onPress={handlePrev} style={styles.navButton}>
              <Ionicons
                name="chevron-back"
                size={22}
                color={color.dark_green}
              />
            </Pressable>
            )}
            
            <View style={{ flex: 1, margin: "auto" }}>
              <View style={styles.dayScroll}
              >
                {visibleDays.map((day) => (
                  <Pressable
                    key={day}
                    style={[
                      styles.dayButton,
                      activeDay === day && styles.activeDayButton,
                    ]}
                    onPress={() => setActiveDay(day)}
                  >
                    <Text
                      style={[
                        styles.dayText,
                        activeDay === day && styles.activeDayText,
                      ]}
                    >
                      {day}
                    </Text>
                  </Pressable>
                ))}
              </View>
            </View>
            {currentWeek !== totalWeeks && (
            <Pressable onPress={handleNext} style={styles.navButton}>
              <Ionicons
                name="chevron-forward"
                size={22}
                color={color.dark_green}
              />
            </Pressable>
            )}
          </View>

          <Text style={styles.totalCaloText}>Tổng calo trong tuần</Text>
          <Text style={styles.totalCaloValue}>
            {recipeDetails.totalCalories} calo
          </Text>

          <Text style={styles.subTitle}>Giá trị dinh dưỡng</Text>
          <View style={styles.nutritionContainer}>
            <NutritionInfo
              icon="zap"
              label="Protein"
              value={recipeDetails.nutrition.protein}
            />
            <NutritionInfo
              icon="droplet"
              label="Chất béo"
              value={recipeDetails.nutrition.fat}
            />
            <NutritionInfo
              icon="trending-up"
              label="Tinh bột"
              value={recipeDetails.nutrition.carbs}
            />
          </View>

          <MealSection meal={recipeDetails.meals.breakfast} />
          <MealSection meal={recipeDetails.meals.lunch} />
          <MealSection meal={recipeDetails.meals.dinner} />

          {/* Sửa thứ tự và nội dung nút */}
          <Pressable style={styles.secondaryButton}>
            <Text style={styles.secondaryButtonText}>Tùy chỉnh thực đơn</Text>
          </Pressable>
          <Pressable style={styles.primaryButton}>
            <Text style={styles.primaryButtonText}>Ăn theo thực đơn này</Text>
          </Pressable>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: color.white,
  },
  bannerImage: {
    width: "100%",
    height: 250,
    justifyContent: "flex-end",
  },
  backButton: {
    position: "absolute",
    top: 50,
    left: 16,
    backgroundColor: "rgba(0,0,0,0.4)",
    padding: 8,
    borderRadius: 20,
  },
  contentContainer: {
    padding: 16,
    backgroundColor: "white",
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    marginTop: -20,
  },
  mainTitle: {
    fontFamily: FONTS.bold,
    fontSize: 22,
    color: color.black,
    marginBottom: 16,
  },
  subTitle: {
    fontFamily: FONTS.semiBold,
    fontSize: 16,
    color: color.black,
    marginTop: 16,
    marginBottom: 8,
  },
  dayRow: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    marginVertical: 10,
  },
  dayScroll: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
    paddingHorizontal: 10,
    paddingVertical: 5,
    display: "flex",
    justifyContent: "center",
  },
  navButton: {
    backgroundColor: color.transparent,
    padding: 0,
    borderRadius: 10,
  },
  dayButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: color.white_40,
    borderWidth: 1,
    borderColor: color.black,
  },
  activeDayButton: {
    backgroundColor: color.dark_green,
    borderColor: color.dark_green,
  },
  dayText: {
    fontFamily: FONTS.semiBold,
    fontSize: 16,
    color: color.black,
  },
  activeDayText: {
    color: color.white,
  },
  totalCaloText: {
    fontFamily: FONTS.medium,
    fontSize: 14,
    color: color.black_70,
    textAlign: "center",
    marginTop: 16,
  },
  totalCaloValue: {
    fontFamily: FONTS.bold,
    fontSize: 28,
    color: color.light_green,
    textAlign: "center",
    marginBottom: 16,
  },
  nutritionContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    gap: 10,
  },
  nutritionCard: {
    flex: 1,
    backgroundColor: color.dark_green,
    borderRadius: 12,
    padding: 12,
    alignItems: "center",
  },
  nutritionHeader: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 4,
  },
  nutritionLabel: {
    fontFamily: FONTS.medium,
    fontSize: 12,
    color: color.white,
    marginLeft: 4,
  },
  nutritionValue: {
    fontFamily: FONTS.bold,
    fontSize: 18,
    color: color.white,
  },
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
    width: 200,
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
  primaryButton: {
    backgroundColor: color.dark_green,
    padding: 16,
    borderRadius: 15,
    justifyContent: "center",
    alignItems: "center",
    marginTop: 12,
    marginBottom: 20,
  },
  primaryButtonText: {
    fontFamily: FONTS.bold,
    fontSize: 16,
    color: color.white,
  },
  secondaryButton: {
    backgroundColor: color.white,
    padding: 16,
    borderRadius: 15,
    justifyContent: "center",
    alignItems: "center",
    borderWidth: 1,
    borderColor: color.dark_green,
    marginTop: 32,
  },
  secondaryButtonText: {
    fontFamily: FONTS.bold,
    fontSize: 16,
    color: color.dark_green,
  },
});
