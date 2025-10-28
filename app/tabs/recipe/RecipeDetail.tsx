import { AddDishModal } from "@components/ui/AddDishToMenu";
import { DayMealSection } from "@components/ui/DayMealSection";
import NutritionInfoCard from "@components/ui/NutrionInfo";
import color from "@constants/color";
import { FONTS } from "@constants/fonts";
import { Ionicons } from "@expo/vector-icons";
import MaterialCommunityIcons from '@expo/vector-icons/MaterialCommunityIcons';
import { fetchAllDishes } from "@features/dishes";
import {
  adoptCustomMenu,
  discardChanges,
  fetchMenuByIdAndDay,
  markChangesSaved,
  saveEditedDay,
} from "@features/menus";
import { fetchCurrentUserThunk } from "@features/users";
import { useFilterState } from "@hooks/useFilterState";
import { RootState } from "@redux";
import { useAppDispatch, useAppSelector } from "@redux/hooks";
import { calculateTotalNutrition } from "@utils/calculateNutrionTotal";
import { navigateCustom } from "@utils/navigation";
import { useLocalSearchParams, useRouter } from "expo-router";
import React, { useEffect, useMemo, useState } from "react";
import {
  ActivityIndicator,
  Alert,
  BackHandler,
  ImageBackground,
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  View,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { Dish } from "../../../types/dishes";
import {
  AdopMenuBodyRequest,
  Meal,
  MealDish,
  MealFromAdopt,
  MenuDay,
  MenuDayFromAdopt,
} from "../../../types/menu";

export default function RecipeDetail() {
  const dispatch = useAppDispatch();
  const router = useRouter();
  const [activeDay, setActiveDay] = useState(1);
  const [currentWeek, setCurrentWeek] = useState(1);
  const [recipe, setRecipe] = useState<MenuDay | null>(null);
  const [mealList, setMealList] = useState<Meal[] | []>([]);
  const [isEditMode, setIsEditMode] = useState<boolean>(false);
  const [hasUnsavedDayChanges, setHasUnsavedDayChanges] =
    useState<boolean>(false);
  const days = Array.from({ length: 30 }, (_, i) => i + 1);
  const totalWeeks = Math.ceil(days.length / 7);

  const start = (currentWeek - 1) * 7;
  const visibleDays = days.slice(start, start + 7);
  const { recipeId, recipeName, imageUrl, backExplore } = useLocalSearchParams<{
    recipeId: string;
    recipeName: string;
    imageUrl: string;
    backExplore: string;
  }>();

  const getMealTypeName = (mealType: string): string => {
    const mealTypeMap: Record<string, string> = {
      Breakfast: "Bữa sáng",
      Lunch: "Bữa trưa",
      Dinner: "Bữa tối",
      Snack: "Bữa phụ",
    };
    return mealTypeMap[mealType] || mealType;
  };

  const { data, loading, editedMenuDays, hasUnsavedChanges } = useAppSelector(
    (state: RootState) => state.menu
  );
  const { user } = useAppSelector((state: RootState) => state.user);

  const [isAddDishModalVisible, setIsAddDishModalVisible] = useState(false);
  const [selectedMealId, setSelectedMealId] = useState<string>("");
  const [selectedMealType, setSelectedMealType] = useState<string>("");
  const [isPro, setIsPro] = useState<boolean>(false);

  const { allDishes, loading: dishesLoading } = useAppSelector(
    (state: RootState) => state.dish
  );

  // ✅ Fetch danh sách món ăn khi component mount
  useEffect(() => {
    dispatch(fetchAllDishes({ pageIndex: 0, pageSize: 9999 }));
  }, [dispatch]);

  // ✅ Fetch menu ban đầu
  useEffect(() => {
    if (recipeId) {
      dispatch(fetchMenuByIdAndDay({ menuId: recipeId, dayNumber: activeDay }));
    }
    if(!user){
      dispatch(fetchCurrentUserThunk())
    }
  }, []);

  useEffect(() => {
    if(user){
      if(user.currentPlanId !== 1){
        setIsPro(true);
      }
    }
  }, [user])

  // ✅ Cập nhật mealList khi data thay đổi
  useEffect(() => {
    if (data) {
      setRecipe(data);
      setMealList(data.meals);
      setHasUnsavedDayChanges(false); // Reset trạng thái khi load data mới
    }
  }, [data]);

  // ✅ Kiểm tra thay đổi trong ngày hiện tại
  useEffect(() => {
    if (recipe && isEditMode) {
      const hasChanged =
        JSON.stringify(mealList) !== JSON.stringify(recipe.meals);
      setHasUnsavedDayChanges(hasChanged);
    }
  }, [mealList, recipe, isEditMode]);

  // ✅ Xử lý khi chuyển ngày
  const handleDayChange = (newDay: number) => {
    if (isEditMode && hasUnsavedDayChanges) {
      Alert.alert(
        "Thay đổi chưa được lưu",
        "Bạn cần lưu thay đổi của ngày hiện tại trước khi chuyển sang ngày khác",
        [{ text: "OK" }]
      );
      return;
    }

    setActiveDay(newDay);
    if (recipeId) {
      dispatch(fetchMenuByIdAndDay({ menuId: recipeId, dayNumber: newDay }));
    }
    setCurrentWeek(Math.ceil(newDay / 7));
  };

  // ✅ Xử lý nút Back với cảnh báo
  useEffect(() => {
    const backAction = () => {
      if (hasUnsavedChanges || hasUnsavedDayChanges) {
        Alert.alert(
          "Thay đổi chưa được lưu",
          "Những thay đổi của bạn sẽ không được lưu nếu bạn thoát ra. Bạn có chắc không?",
          [
            {
              text: "Hủy",
              style: "cancel",
            },
            {
              text: "Thoát",
              style: "destructive",
              onPress: () => {
                dispatch(discardChanges());
                if (backExplore !== null && backExplore !== "") {
                  navigateCustom("/tabs/explore");
                } else {
                  navigateCustom("/tabs/recipe");
                }
              },
            },
          ]
        );
        return true;
      }
      return false;
    };

    const backHandler = BackHandler.addEventListener(
      "hardwareBackPress",
      backAction
    );

    return () => backHandler.remove();
  }, [hasUnsavedChanges, hasUnsavedDayChanges, backExplore, dispatch]);

  // ✅ Xử lý khi bấm nút Back trên UI
  const handleBackPress = () => {
    if (hasUnsavedChanges || hasUnsavedDayChanges) {
      Alert.alert(
        "Thay đổi chưa được lưu",
        "Những thay đổi của bạn sẽ không được lưu nếu bạn thoát ra. Bạn có chắc không?",
        [
          {
            text: "Hủy",
            style: "cancel",
          },
          {
            text: "Thoát",
            style: "destructive",
            onPress: () => {
              dispatch(discardChanges());
              if (backExplore !== null && backExplore !== "") {
                navigateCustom("/tabs/explore");
              } else {
                navigateCustom("/tabs/recipe");
              }
            },
          },
        ]
      );
    } else {
      if (backExplore !== null && backExplore !== "") {
        navigateCustom("/tabs/explore");
      } else {
        navigateCustom("/tabs/recipe");
      }
    }
  };

  const handleOpenAddDishModal = (mealId: string, mealType: string) => {
    setSelectedMealId(mealId);
    setSelectedMealType(mealType);
    setIsAddDishModalVisible(true);
  };

  const handleAddDishToMeal = (dish: Dish) => {
    setMealList((prevMeals) =>
      prevMeals.map((meal) => {
        if (meal.id === selectedMealId) {
          // Kiểm tra món ăn đã tồn tại chưa
          const isDishExists = meal.mealDishes.some(
            (existingDish) => existingDish.dishId === dish.id
          );

          if (isDishExists) {
            // Hiển thị cảnh báo nếu món đã tồn tại
            Alert.alert(
              "Món đã tồn tại",
              `"${dish.name}" đã có trong bữa ăn này rồi!`,
              [{ text: "OK" }]
            );
            return meal; // Trả về meal không thay đổi
          }

          // Tạo món ăn mới
          const newMealDish: MealDish = {
            id: `meal-dish-${Date.now()}-${Math.random()}`, // Thêm random để tránh trùng timestamp
            dishId: dish.id,
            name: dish.name,
            calories: dish.calories,
            carbs: dish.carbs,
            protein: dish.protein,
            fat: dish.fat,
            imageUrl: dish.imageUrl,
            fiber: dish.fiber,
            sugar: dish.sugar,
          };

          // Thêm món mới vào danh sách
          const updatedDishes = [...meal.mealDishes, newMealDish];

          // Tính lại tổng calories
          const newTotalCalories = updatedDishes.reduce(
            (sum, dish) => sum + dish.calories,
            0
          );

          return {
            ...meal,
            mealDishes: updatedDishes,
            totalCalories: newTotalCalories,
          };
        }
        return meal;
      })
    );

    setIsAddDishModalVisible(false);
  };

  const handleDeleteDish = (mealId: string, dishId: string) => {
    const targetMeal = mealList.find((meal) => meal.id === mealId);

    if (targetMeal && targetMeal.mealDishes.length <= 1) {
      Alert.alert("Không thể xóa", "Mỗi bữa ăn phải có ít nhất 1 món ăn", [
        { text: "OK" },
      ]);
      return;
    }

    setMealList((prevMeals) =>
      prevMeals.map((meal) => {
        if (meal.id === mealId) {
          const updatedDishes = meal.mealDishes.filter(
            (dish) => dish.id !== dishId
          );
          const newTotalCalories = updatedDishes.reduce(
            (sum, dish) => sum + dish.calories,
            0
          );

          return {
            ...meal,
            mealDishes: updatedDishes,
            totalCalories: newTotalCalories,
          };
        }
        return meal;
      })
    );
  };

  const handlePrev = () => {
    setCurrentWeek((prev) => (prev > 1 ? prev - 1 : 1));
  };

  const handleNext = () => {
    setCurrentWeek((prev) => (prev < totalWeeks ? prev + 1 : totalWeeks));
  };

  const calculateCaloFullDay = (meals: Meal[] | []) => {
    if (meals.length === 0) return 0;
    let sum = 0;
    meals.forEach((item) => {
      sum += item.totalCalories;
    });
    return sum;
  };

  // ✅ Chuyển editedMenuDays sang định dạng MenuDayFromAdopt[]
  const convertToMenuDaysRequest = (): MenuDayFromAdopt[] => {
    const menuDaysArray: MenuDayFromAdopt[] = [];

    Object.entries(editedMenuDays).forEach(([dayNumberStr, menuDay]) => {
      const dayNumber = parseInt(dayNumberStr);
      const mealsRequest: MealFromAdopt[] = menuDay.meals.map((meal) => ({
        mealType: meal.mealType,
        isMainMeal: true,
        mealDishes: meal.mealDishes.map((dish) => ({
          dishId: dish.dishId,
        })),
      }));

      menuDaysArray.push({
        dayNumber: dayNumber,
        meals: mealsRequest,
      });
    });

    return menuDaysArray;
  };

  const existingDishIds = useMemo(() => {
    const currentMeal = mealList.find((meal) => meal.id === selectedMealId);
    return currentMeal ? currentMeal.mealDishes.map((dish) => dish.dishId) : [];
  }, [mealList, selectedMealId]);

  // ✅ Lưu thay đổi cho ngày hiện tại
  const handleSaveDayChanges = () => {
    if (!recipe) return;

    const updatedMenuDay: MenuDay = {
      ...recipe,
      meals: mealList,
    };

    dispatch(saveEditedDay({ dayNumber: activeDay, menuDay: updatedMenuDay }));
    setHasUnsavedDayChanges(false);
    setIsEditMode(false); // Thoát chế độ chỉnh sửa sau khi lưu
    Alert.alert("Thành công", `Đã lưu thay đổi cho ngày ${activeDay}`);
  };

  const filterState = useFilterState(allDishes);

  // ✅ Áp dụng menu (có thể có chỉnh sửa hoặc không)
  const handleAdoptMenu = async () => {
    const menuDaysRequest = convertToMenuDaysRequest();
    console.warn("menuDaysRequest", menuDaysRequest);
    const objectAdopt: AdopMenuBodyRequest = {
      adoptCustomMenuDto: {
        sourceMenuId: recipeId,
        ...(menuDaysRequest.length > 0 && { menuDays: menuDaysRequest }),
      },
    };

    console.log("objectAdopt:", JSON.stringify(objectAdopt, null, 2));
    const update = await dispatch(adoptCustomMenu(objectAdopt));

    if (adoptCustomMenu.rejected.match(update)) {
      Alert.alert("Lỗi", "Không thể áp dụng menu này");
      return;
    }

    dispatch(markChangesSaved());
    Alert.alert("Thành công", "Áp dụng menu thành công");
  };

  // ✅ Bật chế độ chỉnh sửa
  const handleEnterEditMode = () => {
    if(isPro){
      setIsEditMode(true);
    }else{
      Alert.alert(
        "Nâng cấp tài khoản",
        "Vui lòng nâng cấp tài khoản của bạn lên bản trả phí để sử dụng tính năng này!",
        [
          {
            text: "Nâng cấp ngay",
            style: "default",
            onPress: () => navigateCustom("/subscription"),
          },
          {
            text: "Rời khỏi",
            style: "destructive",
          },
        ]
      );
    }
  };

  // ✅ Hủy chỉnh sửa ngày hiện tại
  const handleCancelDayEdit = () => {
    if (hasUnsavedDayChanges) {
      Alert.alert(
        "Hủy thay đổi",
        "Bạn có chắc muốn hủy các thay đổi chưa lưu của ngày này?",
        [
          {
            text: "Không",
            style: "cancel",
          },
          {
            text: "Hủy thay đổi",
            style: "destructive",
            onPress: () => {
              // Reload lại data gốc
              if (recipe) {
                setMealList(recipe.meals);
              }
              setIsEditMode(false);
              setHasUnsavedDayChanges(false);
            },
          },
        ]
      );
    } else {
      setIsEditMode(false);
    }
  };

  const MEAL_ORDER = ["Breakfast", "Lunch", "Dinner", "Snack"];

  const sortedMeals = [...mealList].sort(
    (a, b) => MEAL_ORDER.indexOf(a.mealType) - MEAL_ORDER.indexOf(b.mealType)
  );

  const { carbs, protein, fat } = calculateTotalNutrition(mealList);

  return (
    <SafeAreaView edges={["top"]} style={styles.safeArea}>
      {loading ? (
        <View style={styles.loadingContainer}>
          <ActivityIndicator size="large" color={color.dark_green} />
          <Text style={styles.loadingText}>Đang tải dữ liệu...</Text>
        </View>
      ) : (
        <>
          <ScrollView
            style={{ marginTop: -50 }}
            showsVerticalScrollIndicator={false}
          >
            <ImageBackground src={imageUrl} style={styles.bannerImage}>
              <Pressable onPress={handleBackPress} style={styles.backButton}>
                <Ionicons name="arrow-back" size={24} color={color.white} />
              </Pressable>
            </ImageBackground>

            <View style={styles.contentContainer}>
              <Text style={styles.mainTitle}>{recipeName}</Text>

              {hasUnsavedChanges && (
                <View style={styles.unsavedBadge}>
                  <Ionicons
                    name="alert-circle"
                    size={16}
                    color={color.orange}
                  />
                  <Text style={styles.unsavedText}>
                    Có {Object.keys(editedMenuDays).length} ngày đã chỉnh sửa
                  </Text>
                </View>
              )}

              {hasUnsavedDayChanges && (
                <View
                  style={[styles.unsavedBadge, { backgroundColor: "#FFF3E0" }]}
                >
                  <Ionicons name="warning" size={16} color="#FF9800" />
                  <Text style={[styles.unsavedText, { color: "#FF9800" }]}>
                    Ngày {activeDay} có thay đổi chưa lưu
                  </Text>
                </View>
              )}

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
                    {visibleDays.map((day, index) => {
                      const isEdited = editedMenuDays[day] !== undefined;
                      return (
                        <Pressable
                          key={index}
                          style={[
                            styles.dayButton,
                            activeDay === day && styles.activeDayButton,
                            isEdited && styles.editedDayButton,
                          ]}
                          onPress={() => handleDayChange(day)}
                        >
                          <Text
                            style={[
                              styles.dayText,
                              activeDay === day && styles.activeDayText,
                            ]}
                          >
                            {day}
                          </Text>
                          {isEdited && <View style={styles.editedDot} />}
                        </Pressable>
                      );
                    })}
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
                  dishList={[]}
                  nutrientValue={carbs}
                />
                <NutritionInfoCard
                  icon="droplet"
                  label="Protein"
                  nutrientType="protein"
                  dishList={[]}
                  nutrientValue={protein}
                />
                <NutritionInfoCard
                  icon="trending-up"
                  label="Chất béo"
                  nutrientType="fat"
                  dishList={[]}
                  nutrientValue={fat}
                />
              </View>

              <View style={{ marginBottom: 24 }}>
                {sortedMeals.map((item) => (
                  <DayMealSection
                    key={item.id}
                    menuId={recipeId}
                    meal={item}
                    isOpenModal={isEditMode}
                    setIsOpenModal={setIsEditMode}
                    onDeleteDish={handleDeleteDish}
                    onOpenAddDishModal={handleOpenAddDishModal}
                  />
                ))}
              </View>

              {backExplore ? (
                <></>
              ) : (
                <>
                  {!isEditMode ? (
                    <>
                      <Pressable
                        style={styles.outlineButton}
                        onPress={handleEnterEditMode}
                      >
                        <Text style={styles.outlineButtonText}>
                          Chỉnh sửa thực đơn {isPro ? (<></>) : (<MaterialCommunityIcons name="crown" size={24} color={color.gold} />)}
                        </Text>
                      </Pressable>
                      <Pressable
                        style={styles.primaryButton}
                        onPress={handleAdoptMenu}
                      >
                        <Text style={styles.primaryButtonText}>
                          Ăn theo thực đơn này
                        </Text>
                      </Pressable>
                    </>
                  ) : (
                    <>
                      <Pressable
                        style={styles.outlineButton}
                        onPress={handleCancelDayEdit}
                      >
                        <Text style={styles.outlineButtonText}>
                          Hủy chỉnh sửa
                        </Text>
                      </Pressable>
                      <Pressable
                        style={[
                          styles.primaryButton,
                          !hasUnsavedDayChanges && styles.disabledButton,
                        ]}
                        onPress={handleSaveDayChanges}
                        disabled={!hasUnsavedDayChanges}
                      >
                        <Text style={styles.primaryButtonText}>
                          Áp dụng thay đổi cho ngày {activeDay}
                        </Text>
                      </Pressable>
                    </>
                  )}
                </>
              )}
            </View>
          </ScrollView>
          <AddDishModal
            visible={isAddDishModalVisible}
            onClose={() => setIsAddDishModalVisible(false)}
            dishes={allDishes}
            loading={dishesLoading}
            onAddDish={handleAddDishToMeal}
            mealType={getMealTypeName(selectedMealType)}
            existingDishIds={existingDishIds}
            filterState={filterState}
          />
        </>
      )}
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: color.white,
  },
  nutritionContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    gap: 10,
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
  unsavedBadge: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#E3F2FD",
    padding: 8,
    borderRadius: 8,
    marginBottom: 12,
    gap: 6,
  },
  unsavedText: {
    fontFamily: FONTS.medium,
    fontSize: 13,
    color: "#1976D2",
  },
  subTitle: {
    fontFamily: FONTS.semiBold,
    fontSize: 16,
    color: color.black,
    marginTop: 16,
    marginBottom: 8,
  },
  noDishText: {
    fontFamily: FONTS.regular,
    fontSize: 14,
    color: color.grey,
    fontStyle: "italic",
    paddingLeft: 8,
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
    position: "relative",
  },
  activeDayButton: {
    backgroundColor: color.dark_green,
    borderColor: color.dark_green,
  },
  editedDayButton: {
    borderColor: color.light_green,
    borderWidth: 2,
  },
  editedDot: {
    position: "absolute",
    top: 2,
    right: 2,
    width: 6,
    height: 6,
    borderRadius: 3,
    backgroundColor: color.orange,
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
  primaryButton: {
    backgroundColor: color.dark_green,
    padding: 16,
    borderRadius: 15,
    justifyContent: "center",
    alignItems: "center",
    marginTop: 5,
    marginBottom: 10,
  },
  primaryButtonText: {
    fontFamily: FONTS.bold,
    fontSize: 16,
    color: color.white,
  },
  outlineButton: {
    backgroundColor: color.white,
    borderColor: color.dark_green,
    borderWidth: 1,
    padding: 16,
    borderRadius: 15,
    justifyContent: "center",
    alignItems: "center",
  },
  outlineButtonText: {
    fontFamily: FONTS.bold,
    fontSize: 16,
    color: color.dark_green,
  },
  disabledButton: {
    backgroundColor: color.black_30,
    opacity: 0.5,
  },
});
