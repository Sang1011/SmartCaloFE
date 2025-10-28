import EditMealModal from "@components/ui/editMealModal";
import MealSummary from "@components/ui/mealSummary";
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
import { useEffect, useMemo, useState } from "react";
import { Pressable, ScrollView, StyleSheet, Text, View } from "react-native";
import { scale } from "react-native-size-matters";
import { MealType } from "../types/tracking";

// Tạm thời set isPro để test

export default function ViewData() {
  const [isPro, setIsPro] = useState<boolean>(false);
  const { date, mealType } = useLocalSearchParams<{
    date: string;
    mealType: string;
  }>();
  const [mealTypeNumber, setMealTypeNumber] = useState<number>(0);

  const { dailyLog, loading } = useAppSelector(
    (state: RootState) => state.tracking
  );
  const dispatch = useAppDispatch();

  const [isEditModalVisible, setIsEditModalVisible] = useState(false);
  const [localDeletedItemIds, setLocalDeletedItemIds] = useState<string[]>([]);
  const { user } = useAppSelector((state: RootState) => state.user);

  // =================================================================
  // Lấy tên bữa ăn
  // =================================================================
  const mealNames = useMemo(
    () => [
      { name: "Bữa sáng", type: MealType.Breakfast },
      { name: "Bữa trưa", type: MealType.Lunch },
      { name: "Bữa tối", type: MealType.Dinner },
      { name: "Bữa phụ", type: MealType.Snack },
    ],
    []
  );

  const mealName = useMemo(() => {
    return (
      mealNames.find((m) => m.type === mealTypeNumber)?.name ||
      "Chi tiết Bữa ăn"
    );
  }, [mealTypeNumber, mealNames]);

  useEffect(() => {
    if (user?.currentPlanId !== 1) {
      setIsPro(true);
    }
  }, [user]);

  useEffect(() => {
    dispatch(fetchCurrentUserThunk());

    if (date && mealType) {
      const typeNum = Number(mealType);
      setMealTypeNumber(typeNum);
      dispatch(getDailyLogThunk({ date: date, mealType: typeNum }));
    }
  }, [date, mealType, dispatch]);

  useEffect(() => {
    setLocalDeletedItemIds([]);
  }, [dailyLog, mealTypeNumber]);

  // =================================================================
  // Tính toán dữ liệu từ dailyLog
  // =================================================================
  const items = useMemo(() => {
    if (!dailyLog || !dailyLog.logEntries) return [];

    return dailyLog.logEntries.map((entry) => ({
      id: entry.id,
      name: entry.foodName,
      quantity: `${entry.quantity} phần`,
      calories: Math.round(entry.caloriesConsumed),
      protein: Math.round(entry.proteinConsumed),
      carbs: Math.round(entry.carbsConsumed),
      fat: Math.round(entry.fatConsumed),
      fiber: Math.round(entry.fiberConsumed),
      sugar: Math.round(entry.sugarConsumed),
    }));
  }, [dailyLog]);

  // Danh sách items đã lọc sau khi xóa cục bộ
  const displayedItems = useMemo(() => {
    return items.filter((item) => !localDeletedItemIds.includes(item.id));
  }, [items, localDeletedItemIds]);

  // Tính tổng dinh dưỡng
  const totals = useMemo(() => {
    return displayedItems.reduce(
      (acc, item) => ({
        calories: acc.calories + item.calories,
        protein: acc.protein + item.protein,
        carbs: acc.carbs + item.carbs,
        fat: acc.fat + item.fat,
        fiber: acc.fiber + item.fiber,
        sugar: acc.sugar + item.sugar,
      }),
      { calories: 0, protein: 0, carbs: 0, fat: 0, fiber: 0, sugar: 0 }
    );
  }, [displayedItems]);

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

  // =================================================================
  // Xử lý xóa món ăn
  // =================================================================
  const handleDeleteItem = async (idsToRemove: string[]) => {
    if (idsToRemove && idsToRemove.length > 0) {
      setLocalDeletedItemIds((prevIds) => [...prevIds, ...idsToRemove]);
      setIsEditModalVisible(false);

      try {
        await dispatch(
          deleteLogEntriesBatchThunk({
            logEntryIds: idsToRemove,
            date: date as string,
            mealType: mealTypeNumber,
          })
        ).unwrap();
        console.log("Xóa hàng loạt thành công và đã cập nhật nhật ký ngày.");
      } catch (error) {
        console.error("Lỗi xóa món ăn:", error);
        // Hoàn tác nếu xóa thất bại
        setLocalDeletedItemIds((prevIds) =>
          prevIds.filter((id) => !idsToRemove.includes(id))
        );
      }
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

  return (
    <View style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <Pressable onPress={() => navigateCustom("/tabs")}>
          <AntDesign name="arrow-left" size={scale(24)} color={Color.black} />
        </Pressable>
        <Text style={styles.headerTitle}>{mealName}</Text>
        <View style={styles.headerActions}>
          {displayedItems.length > 0 && (
            <Pressable
              style={styles.actionButton}
              onPress={() => setIsEditModalVisible(true)}
            >
              <Feather name="edit" size={scale(24)} color={Color.dark_green} />
            </Pressable>
          )}
        </View>
      </View>

      <ScrollView contentContainerStyle={styles.scrollViewContent}>
        {/* Tổng quan Bữa Ăn */}
        <MealSummary
          totalCal={totals.calories}
          protein={totals.protein}
          fat={totals.fat}
          sugar={totals.sugar}
          fiber={totals.fiber}
        />

        {/* Danh sách các món ăn */}
        <View style={styles.itemsList}>
          <Text style={styles.listTitle}>Các món đã dùng</Text>
          {displayedItems.length > 0 ? (
            displayedItems.map((item) => (
              <View key={item.id} style={styles.itemRow}>
                <View style={styles.itemDetails}>
                  <Text style={styles.itemName}>{item.name}</Text>
                  <Text style={styles.itemQuantity}>{item.quantity}</Text>

                  {isPro ? (
                    <>
                      <Text style={styles.itemNutrients}>
                        Protein: {item.protein}g | Carbs: {item.carbs}g | Fat:{" "}
                        {item.fat}g
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

                <Text style={styles.itemCalories}>{item.calories} Cal</Text>
              </View>
            ))
          ) : (
            <Text style={styles.emptyListText}>
              Chưa có món ăn nào được thêm.
            </Text>
          )}
        </View>

        {/* Nút thêm món ăn */}
        <Pressable
          style={styles.addButton}
          onPress={() => navigateCustom("/option")}
        >
          <AntDesign name="plus" size={scale(18)} color={Color.white} />
          <Text style={styles.addButtonText}> Thêm món ăn</Text>
        </Pressable>

        {/* Nutrition Facts */}
        {targets && displayedItems.length > 0 && (
          <View style={styles.nutritionFactsContainer}>
            <Text style={styles.nutritionFactsTitle}>
              Thành phần dinh dưỡng {!isPro && "(PREMIUM)"}
            </Text>
            {renderNutrientRow(
              "Calories",
              totals.calories,
              targets.calories,
              "Cal"
            )}
            {renderNutrientRow("Carbs", totals.carbs, targets.carbs)}
            {renderNutrientRow("Protein", totals.protein, targets.protein)}
            {renderNutrientRow("Fat", totals.fat, targets.fat)}
            {renderNutrientRow("Fiber", totals.fiber, targets.fiber)}
            {renderNutrientRow("Sugar", totals.sugar, targets.sugar)}
          </View>
        )}
      </ScrollView>

      {/* Modal */}
      <EditMealModal
        isVisible={isEditModalVisible}
        onClose={() => setIsEditModalVisible(false)}
        items={displayedItems}
        onDelete={handleDeleteItem}
      />
    </View>
  );
}

// =================================================================
// Styles
// =================================================================
const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Color.background,
  },
  scrollViewContent: {
    flexGrow: 1,
    paddingBottom: scale(20),
  },
  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    padding: scale(15),
    paddingTop: scale(40),
    backgroundColor: Color.white,
    borderBottomWidth: 1,
    borderBottomColor: Color.light_gray,
  },
  headerTitle: {
    flex: 1,
    textAlign: "center",
    fontSize: scale(18),
    fontFamily: FONTS.semiBold,
    color: Color.black,
  },
  headerActions: {
    width: scale(30),
    alignItems: "flex-end",
  },
  actionButton: {},
  itemsList: {
    paddingHorizontal: scale(20),
    paddingVertical: scale(10),
    backgroundColor: Color.white,
    marginTop: scale(10),
    borderTopWidth: 1,
    borderTopColor: Color.light_gray,
  },
  listTitle: {
    fontSize: scale(16),
    fontFamily: FONTS.bold,
    color: Color.black,
    paddingVertical: scale(5),
  },
  itemRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingVertical: scale(12),
    borderBottomWidth: 1,
    borderBottomColor: Color.light_gray,
  },
  itemDetails: {
    flex: 1,
  },
  itemName: {
    fontSize: scale(15),
    fontFamily: FONTS.semiBold,
    color: Color.black,
  },
  itemQuantity: {
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
  itemCalories: {
    fontSize: scale(15),
    fontFamily: FONTS.semiBold,
    color: Color.dark_green,
  },
  emptyListText: {
    fontSize: scale(14),
    fontFamily: FONTS.regular,
    color: Color.gray,
    textAlign: "center",
    paddingVertical: scale(10),
  },
  addButton: {
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: Color.dark_green,
    padding: scale(12),
    borderRadius: 8,
    marginHorizontal: scale(20),
    marginTop: scale(10),
  },
  addButtonText: {
    fontSize: scale(16),
    fontFamily: FONTS.semiBold,
    color: Color.white,
  },
  nutritionFactsContainer: {
    padding: scale(20),
    backgroundColor: Color.white,
    marginTop: scale(10),
    borderTopWidth: 1,
    borderTopColor: Color.light_gray,
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
    textAlign: "center"
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
