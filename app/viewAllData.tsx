import EditMealsModal from "@components/ui/editMealSectionModal";
import Color from "@constants/color";
import { FONTS } from "@constants/fonts";
import AntDesign from "@expo/vector-icons/AntDesign";
import Feather from "@expo/vector-icons/Feather";
import {
  deleteLogEntriesBatchThunk,
  getDailyLogThunk,
} from "@features/tracking";
import { fetchCurrentUserThunk } from "@features/users";
import { RootState } from "@redux";
import { useAppDispatch, useAppSelector } from "@redux/hooks";
import { navigateCustom } from "@utils/navigation";
import { useLocalSearchParams } from "expo-router";
import React, { useEffect, useMemo, useState } from "react";
import { Pressable, ScrollView, StyleSheet, Text, View } from "react-native";
import { scale } from "react-native-size-matters";
import { GetDailyLogResponse } from "../types/tracking";

// Định nghĩa kiểu dữ liệu
export type MealItem = {
  id: string;
  name: string;
  quantity: number;
  calories: number;
  protein: number;
  carbs: number;
  fat: number;
  fiber: number;
  sugar: number;
};

export type MealSection = {
  id: string;
  name: string;
  totalCalories: number;
  items: MealItem[];
};

enum MealType {
  Breakfast = 0,
  Lunch = 1,
  Dinner = 2,
  Snack = 4,
}

const getMealTypeName = (type: number) => {
  switch (type) {
    case MealType.Breakfast:
      return "Bữa sáng";
    case MealType.Lunch:
      return "Bữa trưa";
    case MealType.Dinner:
      return "Bữa tối";
    case MealType.Snack:
      return "Bữa nhẹ";
    default:
      return "Khác";
  }
};

const transformDailyLogToMealSections = (
  dailyLog: GetDailyLogResponse | null
): MealSection[] => {
  if (!dailyLog || dailyLog.logEntries.length === 0) {
    return [];
  }

  const grouped = dailyLog.logEntries.reduce((acc, entry) => {
    const mealTypeId = entry.mealType.toString();
    if (!acc[mealTypeId]) {
      acc[mealTypeId] = {
        id: mealTypeId,
        name: getMealTypeName(entry.mealType),
        items: [],
        totalCalories: 0,
      };
    }

    const item: MealItem = {
      id: entry.id,
      name: entry.foodName,
      quantity: entry.quantity,
      calories: Math.round(entry.caloriesConsumed),
      protein: Math.round(entry.proteinConsumed),
      carbs: Math.round(entry.carbsConsumed),
      fat: Math.round(entry.fatConsumed),
      fiber: Math.round(entry.fiberConsumed),
      sugar: Math.round(entry.sugarConsumed),
    };

    acc[mealTypeId].items.push(item);
    acc[mealTypeId].totalCalories += item.calories;

    return acc;
  }, {} as Record<string, MealSection>);

  return Object.values(grouped).sort((a, b) => parseInt(a.id) - parseInt(b.id));
};

export default function ViewAllDataScreen() {
  const [mealData, setMealData] = useState<MealSection[]>([]);
  const [isEditModalVisible, setIsEditModalVisible] = useState(false);
  const [isPro, setIsPro] = useState<boolean>(false);
  const { user } = useAppSelector((state: RootState) => state.user);
  const { dailyLog, loading } = useAppSelector(
    (state: RootState) => state.tracking
  );

  const { date } = useLocalSearchParams<{ date: string }>();
  const dispatch = useAppDispatch();

  useEffect(() => {
    if (user?.currentPlanId !== 1) {
      setIsPro(true);
    }
    
  }, [user]);

  // Fetch data khi component mount
  useEffect(() => {
    dispatch(fetchCurrentUserThunk());
    
    if (date) {
      dispatch(getDailyLogThunk({ date: date }));
    }
  }, [dispatch, date]);

  // Đồng bộ Redux dailyLog vào local state mealData
  useEffect(() => {
    setMealData(transformDailyLogToMealSections(dailyLog));
  }, [dailyLog]);

  // Tính tổng dinh dưỡng từ tất cả bữa ăn
  const totals = useMemo(() => {
    return mealData.reduce(
      (acc, meal) => {
        meal.items.forEach((item) => {
          acc.calories += item.calories;
          acc.protein += item.protein;
          acc.carbs += item.carbs;
          acc.fat += item.fat;
          acc.fiber += item.fiber;
          acc.sugar += item.sugar;
        });
        return acc;
      },
      { calories: 0, protein: 0, carbs: 0, fat: 0, fiber: 0, sugar: 0 }
    );
  }, [mealData]);

  // Targets từ dailyLog
  const targets = useMemo(() => {
    if (!dailyLog) return null;
    return {
      calories: Math.round(dailyLog.totalCaloriesTarget) || 0,
      protein: Math.round(dailyLog.totalProteinTarget) || 0,
      carbs: Math.round(dailyLog.totalCarbsTarget) || 0,
      fat: Math.round(dailyLog.totalFatTarget) || 0,
      fiber: Math.round(dailyLog.totalFiberTarget) || 0,
      sugar: Math.round(dailyLog.totalSugarTarget) || 0,
    };
  }, [dailyLog]);

  /**
   * Xử lý xóa hàng loạt log entries
   * @param idsToDelete - Danh sách IDs cần xóa
   */
  const handleDeleteItems = async (idsToDelete: string[]) => {
    if (!date || idsToDelete.length === 0) return;

    try {
      // Dispatch batch delete thunk
      await dispatch(
        deleteLogEntriesBatchThunk({
          logEntryIds: idsToDelete,
          date: date,
          mealType: 0, // Giá trị mặc định, sẽ fetch lại toàn bộ
        })
      ).unwrap();

      // Thunk đã tự động fetch lại data, không cần fetch thêm
    } catch (error) {
      console.warn("Error deleting items:", error);
      // Có thể hiển thị thông báo lỗi cho người dùng
    }
  };

  // =================================================================
  // Render Progress Bar
  // =================================================================
  const renderNutrientRow = (
    label: string,
    value: number,
    target: number,
    unit: string = "g"
  ) => {
    const percentage = target > 0 ? (value / target) * 100 : 0;
    const isExceeded = percentage > 100;
    const displayPercentage = Math.min(percentage, 100);

    const mainNutrients = ["carbs", "protein", "fat", "calories"];
    const isMainNutrient = mainNutrients.includes(label.toLowerCase());
    const canShowProgress = isPro || isMainNutrient;

    return (
      <View style={styles.macroRow}>
        <Text style={styles.macroLabel}>{label}</Text>
        {canShowProgress ? (
          <>
            <View style={styles.progressBarBackground}>
              <View
                style={[
                  styles.progressBarFill,
                  {
                    width: `${displayPercentage}%`,
                    backgroundColor: isExceeded ? Color.red : Color.dark_green,
                  },
                ]}
              />
            </View>
            <Text
              style={[
                styles.macroTarget,
                isExceeded && { color: Color.red, fontFamily: FONTS.bold },
              ]}
            >
              {value} / {target}
              {unit}
            </Text>
          </>
        ) : (
          <View style={styles.progressBarBackground}>
            <View style={styles.proLockFull}>
              <AntDesign name="lock" size={scale(14)} color={Color.white} />
              <Text style={styles.proText}> PREMIUM</Text>
            </View>
          </View>
        )}
      </View>
    );
  };

  // Hiển thị trạng thái loading
  if (loading && mealData.length === 0) {
    return (
      <View
        style={[
          styles.container,
          { justifyContent: "center", alignItems: "center" },
        ]}
      >
        <Text style={styles.emptyDataText}>Đang tải dữ liệu...</Text>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <Pressable onPress={() => navigateCustom("/tabs")}>
          <AntDesign name="arrow-left" size={24} color={Color.black} />
        </Pressable>
        <Text style={styles.headerTitle}>Tổng quan dinh dưỡng</Text>
        {mealData.length > 0 && (
          <Pressable onPress={() => setIsEditModalVisible(true)}>
            <Feather name="edit" size={24} color={Color.dark_green} />
          </Pressable>
        )}
        {mealData.length === 0 && <View style={{ width: 24 }} />}
      </View>

      {/* Scrollable Content */}
      <ScrollView contentContainerStyle={styles.scrollViewContent}>
        {mealData.length > 0 ? (
          <>
            {mealData.map((mealSection) => (
              <View key={mealSection.id} style={styles.mealSection}>
                {/* Meal Header */}
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
                    <View style={styles.itemDetails}>
                      <Text style={styles.mealItemName}>{item.name}</Text>
                      <Text style={styles.mealItemQuantity}>
                        {item.quantity} phần
                      </Text>
                      {isPro ? (
                        <>
                          <Text style={styles.itemNutrients}>
                            Protein: {item.protein}g | Carbs: {item.carbs}g |
                            Fat: {item.fat}g
                          </Text>
                          <Text style={styles.itemNutrients}>
                            Fiber: {item.fiber}g | Sugar: {item.sugar}g
                          </Text>
                        </>
                      ) : (
                        <View style={styles.proLockRow}>
                          <AntDesign
                            name="lock"
                            size={scale(12)}
                            color={Color.white}
                          />
                          <Text style={styles.proLockText}>
                            Chi tiết dinh dưỡng (PREMIUM)
                          </Text>
                        </View>
                      )}
                    </View>
                    <Text style={styles.mealItemCalories}>
                      {item.calories} Cal
                    </Text>
                  </View>
                ))}
              </View>
            ))}

            {/* Nutrition Facts */}
            {targets && (
              <View style={styles.nutritionFactsContainer}>
                <Text style={styles.nutritionFactsTitle}>
                  Thành phần dinh dưỡng {!isPro && "(PREMIUM)"}
                </Text>
                {renderNutrientRow(
                  "Calories",
                  totals.calories,
                  targets.calories,
                  " Cal"
                )}
                {renderNutrientRow("Carbs", totals.carbs, targets.carbs)}
                {renderNutrientRow("Protein", totals.protein, targets.protein)}
                {renderNutrientRow("Fat", totals.fat, targets.fat)}
                {renderNutrientRow("Fiber", totals.fiber, targets.fiber)}
                {renderNutrientRow("Sugar", totals.sugar, targets.sugar)}
              </View>
            )}
          </>
        ) : (
          <Text style={styles.emptyDataText}>Chưa có dữ liệu bữa ăn nào.</Text>
        )}
      </ScrollView>

      <EditMealsModal
        isVisible={isEditModalVisible}
        onClose={() => setIsEditModalVisible(false)}
        mealSections={mealData}
        onDelete={handleDeleteItems}
      />
    </View>
  );
}

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
    backgroundColor: Color.background,
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
  itemDetails: {
    flex: 1,
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
    marginTop: scale(2),
  },
  itemNutrients: {
    fontSize: scale(11),
    fontFamily: FONTS.regular,
    color: Color.dark_green,
    marginTop: scale(2),
  },
  mealItemCalories: {
    fontSize: scale(14),
    fontFamily: FONTS.semiBold,
    color: Color.black,
  },
  emptyDataText: {
    textAlign: "center",
    marginTop: scale(50),
    fontSize: scale(16),
    fontFamily: FONTS.regular,
    color: Color.gray,
  },
  nutritionFactsContainer: {
    padding: scale(20),
    backgroundColor: Color.white,
    marginTop: scale(10),
    marginHorizontal: scale(15),
    borderRadius: 12,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  nutritionFactsTitle: {
    fontSize: scale(16),
    fontFamily: FONTS.bold,
    color: Color.black,
    marginBottom: scale(15),
    borderBottomWidth: 1,
    borderBottomColor: Color.light_gray,
    paddingBottom: scale(8),
  },
  macroRow: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: scale(12),
  },
  macroLabel: {
    width: scale(80),
    fontSize: scale(14),
    fontFamily: FONTS.medium,
    color: Color.black,
  },
  progressBarBackground: {
    flex: 1,
    height: scale(20),
    backgroundColor: Color.gray_light,
    borderRadius: 10,
    marginHorizontal: scale(10),
    justifyContent: "center",
    overflow: "hidden",
  },
  progressBarFill: {
    height: "100%",
    backgroundColor: Color.dark_green,
    borderRadius: 10,
  },
  proLockFull: {
    flex: 1,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: Color.black_70,
  },
  proLockRow: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: Color.black_70,
    borderRadius: scale(8),
    paddingHorizontal: scale(6),
    paddingVertical: scale(2),
    marginTop: scale(4),
  },
  proLockText: {
    color: Color.white,
    fontFamily: FONTS.medium,
    fontSize: scale(12),
    textAlign: "center",
  },
  proText: {
    fontSize: scale(12),
    fontFamily: FONTS.bold,
    color: Color.white,
  },
  macroTarget: {
    width: scale(90),
    textAlign: "right",
    fontSize: scale(12),
    fontFamily: FONTS.medium,
    color: Color.gray,
  },
});
