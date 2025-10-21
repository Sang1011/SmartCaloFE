import { DayMealSection } from "@components/ui/DayMealSection";
import NutritionInfoCard from "@components/ui/NutrionInfo";
import color from "@constants/color";
import { FONTS } from "@constants/fonts";
import { Ionicons } from "@expo/vector-icons";
import { adoptCustomMenu, fetchMenuByIdAndDay } from "@features/menus";
import { RootState } from "@redux";
import { useAppDispatch, useAppSelector } from "@redux/hooks";
import { router, useLocalSearchParams } from "expo-router";
import React, { useEffect, useState } from "react";
import {
  ActivityIndicator,
  Alert,
  ImageBackground,
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  View,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import {
  AdopMenuBodyRequest,
  Meal,
  MealDish,
  MenuDay,
} from "../../../types/menu";

export default function RecipeDetail() {
  const dispatch = useAppDispatch();
  const [activeDay, setActiveDay] = useState(1);
  const [currentWeek, setCurrentWeek] = useState(0);
  const [recipe, setRecipe] = useState<MenuDay | null>(null);
  const [mealList, setMealList] = useState<Meal[] | []>([]);
  const [dishList, setDishList] = useState<MealDish[] | []>([]);

  const days = Array.from({ length: 30 }, (_, i) => i + 1);
  const totalWeeks = Math.ceil(days.length / 7);

  const start = (currentWeek - 1) * 7;
  const visibleDays = days.slice(start, start + 7);
  const { recipeId, recipeName, imageUrl } = useLocalSearchParams<{
    recipeId: string;
    recipeName: string;
    imageUrl: string;
  }>();

  const { data, loading } = useAppSelector((state: RootState) => state.menu);
  const { user } = useAppSelector((state: RootState) => state.user);

  useEffect(() => {
    console.log("user", user);
    if (recipeId) {
      dispatch(fetchMenuByIdAndDay({ menuId: recipeId, dayNumber: activeDay }));
    }
  }, []);

  useEffect(() => {
    if (data) {
      console.log(data);
      setRecipe(data);
      setMealList(data.meals);
    }
  }, [data]);

  useEffect(() => {
    if (recipeId) {
      dispatch(fetchMenuByIdAndDay({ menuId: recipeId, dayNumber: activeDay }));
    }
    setCurrentWeek(Math.ceil(activeDay / 7));
  }, [activeDay]);

  const handlePrev = () => {
    setCurrentWeek((prev) => (prev > 1 ? prev - 1 : 1));
  };

  const handleNext = () => {
    setCurrentWeek((prev) => (prev < totalWeeks ? prev + 1 : totalWeeks));
  };

  const calculateCaloFullDay = (meals: Meal[] | []) => {
    if (meals.length === 0) return 0;
    let sum = 0;
    meals.map((item) => {
      sum += item.totalCalories;
    });
    return sum;
  };

  const handleAdoptMenu = async () => {
    const objectAdopt: AdopMenuBodyRequest = {
      adoptCustomMenuDto: {
        sourceMenuId: recipeId,
      },
    };
    const update = await dispatch(adoptCustomMenu(objectAdopt));
    if (adoptCustomMenu.rejected.match(update)) {
      Alert.alert("Không thể áp dụng menu này");
      return;
    }
    Alert.alert("Áp dụng menu thành công");
  };

  return (
    <SafeAreaView edges={["top"]} style={styles.safeArea}>
      {loading ? (
        // ✅ Hiển thị loading khi đang tải
        <View style={styles.loadingContainer}>
          <ActivityIndicator size="large" color={color.dark_green} />
          <Text style={styles.loadingText}>Đang tải thực đơn...</Text>
        </View>
      ) : (
        <ScrollView
          style={{ marginTop: -50 }}
          showsVerticalScrollIndicator={false}
        >
          <ImageBackground src={imageUrl} style={styles.bannerImage}>
            <Pressable onPress={() => router.back()} style={styles.backButton}>
              <Ionicons name="arrow-back" size={24} color={color.white} />
            </Pressable>
          </ImageBackground>

          <View style={styles.contentContainer}>
            <Text style={styles.mainTitle}>{recipeName}</Text>

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
                <View style={styles.dayScroll}>
                  {visibleDays.map((day, index) => (
                    <Pressable
                      key={index}
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

            <Text style={styles.totalCaloText}>Tổng calo trong ngày</Text>
            <Text style={styles.totalCaloValue}>
              {calculateCaloFullDay(mealList)} calo
            </Text>

            <Text style={styles.subTitle}>Giá trị dinh dưỡng</Text>
            <View style={styles.nutritionContainer}>
              <NutritionInfoCard
                icon="zap"
                label="Carbs"
                nutrientType="carbs"
                dishList={dishList}
              />
              <NutritionInfoCard
                nutrientType="protein"
                icon="droplet"
                label="Protein"
                dishList={dishList}
              />
              <NutritionInfoCard
                icon="trending-up"
                nutrientType="fat"
                label="Chất béo"
                dishList={dishList}
              />
            </View>

            {mealList.map((item) => (
              <DayMealSection
                key={item.id}
                menuId={recipeId}
                meal={item}
                setDishList={setDishList}
                dishList={dishList}
              />
            ))}

            <Pressable style={styles.primaryButton}>
              <Text
                style={styles.primaryButtonText}
                onPress={() => handleAdoptMenu()}
              >
                Ăn theo thực đơn này
              </Text>
            </Pressable>
          </View>
        </ScrollView>
      )}
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
    gap: 5,
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
  loadingContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: color.white,
  },
  loadingText: {
    marginTop: 12,
    color: color.dark_green,
    fontFamily: FONTS.medium,
    fontSize: 15,
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
});
