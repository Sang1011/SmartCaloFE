import ButtonGoBack from "@components/ui/buttonGoBack";
import color from "@constants/color";
import { FONTS, globalStyles } from "@constants/fonts";
import AntDesign from "@expo/vector-icons/AntDesign";
import Ionicons from "@expo/vector-icons/Ionicons";
import MaterialIcons from "@expo/vector-icons/MaterialIcons";
import { clearSelectedDish, fetchDishById } from "@features/dishes";
import { createLogEntryThunk } from "@features/tracking";
import { fetchCurrentUserThunk } from "@features/users";
import { RootState } from "@redux";
import { useAppDispatch, useAppSelector } from "@redux/hooks";
import { calculateNutritionPercentages } from "@utils/calculateNutrionPercentages";
import { navigateCustom } from "@utils/navigation";
import { useLocalSearchParams } from "expo-router";
import { useEffect, useState } from "react";
import {
  ActivityIndicator,
  Alert,
  Image,
  Modal,
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  View,
} from "react-native";
import { PieChart } from "react-native-gifted-charts/dist";
import { SafeAreaView } from "react-native-safe-area-context";
import { CreateEntryLogRequestBody, MealType } from "../types/tracking";

// const methods = rawMethods
//   .replace(/[,]+/g, "") // xoá hết dấu phẩy thừa
//   .split(".") // tách theo dấu chấm
//   .map((item) => item.trim())
//   .filter((item) => item.length > 0);

export default function Dishes() {
  const [tab, setTab] = useState<"ingre" | "method">("ingre");
  const { id, menuId, predict } = useLocalSearchParams<{
    id: string;
    menuId: string;
    predict: string;
  }>();
  const dispatch = useAppDispatch();
  const { selectedDish, loading } = useAppSelector(
    (state: RootState) => state.dish
  );
  const [dishId, setDishId] = useState<string | null>(null);
  const [isPredict, setIsPredict] = useState<boolean>(false);
  const [isMenu, setIsMenu] = useState<boolean>(false);

  useEffect(() => {
    dispatch(fetchCurrentUserThunk());
  }, []);

  const { loading: createLoading } = useAppSelector(
    (state: RootState) => state.tracking
  );

  useEffect(() => {
    if (id) {
      setDishId(id);
      dispatch(fetchDishById(id));
    } else {
      console.warn("⚠️ Không tìm thấy dishId hợp lệ:", id);
    }

    if (menuId) {
      setIsMenu(true);
    }

    return () => {
      dispatch(clearSelectedDish());
    };
  }, [id, menuId, dispatch]);

  useEffect(() => {
      const extractedId = Array.isArray(id) ? id[0] : id;
      if (extractedId && typeof extractedId === "string") {
        setDishId(extractedId);
        dispatch(fetchDishById(extractedId));
      }
    }, [id, dispatch]);

    useEffect(() => {
      console.log("selected: ", selectedDish);
    }, [selectedDish])

  const [isModalVisible, setIsModalVisible] = useState(false);
  const [quantity, setQuantity] = useState(1);
  const [mealType, setMealType] = useState<MealType>(MealType.Breakfast);

  // Optional: cho phép người dùng chỉnh dinh dưỡng
  const [customNutrition, setCustomNutrition] = useState({
    calories: 0,
    protein: 0,
    carbs: 0,
    fat: 0,
    fiber: 0,
    sugar: 0,
  });

  const handleAddPress = async () => {
    if (!selectedDish) return;
  
    const body: CreateEntryLogRequestBody = {
      dishId: selectedDish.id,
      quantity,
      mealType,
      sourceType: 1,
      date: new Date().toLocaleDateString("en-CA"),
      foodName: selectedDish.name,
      calories: customNutrition.calories ?? selectedDish.calories,
      protein: customNutrition.protein ?? selectedDish.protein,
      carbs: customNutrition.carbs ?? selectedDish.carbs,
      fat: customNutrition.fat ?? selectedDish.fat,
      fiber: customNutrition.fiber ?? selectedDish.fiber,
      sugar: customNutrition.sugar ?? selectedDish.sugar,
    };
  
    console.warn("BODY", body);
  
    try {
      await dispatch(createLogEntryThunk({ body })).unwrap();
      alert("✅ Đã thêm vào lịch sử thành công!");
    } catch (error: any) {
      console.warn("❌ Lỗi khi thêm log món ăn:", error);
  
      if (error?.status === 403 || error?.response?.status === 403) {
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
              style: "cancel",
              onPress: () => navigateCustom("/tabs"),
            },
          ]
        );
      } else {
        alert("❌ Lỗi khi thêm log món ăn: " + (error?.message || "Không xác định"));
      }
    }
  };

  // Nếu dữ liệu đang tải hoặc chưa có, bạn có thể hiển thị loading/placeholder
  if (loading && !selectedDish) {
    return (
      <View style={{ flex: 1, justifyContent: "center", alignItems: "center" }}>
        <Text
          style={{
            fontSize: 24,
            fontFamily: FONTS.bold,
            color: color.dark_green,
          }}
        >
          LOADING...
        </Text>
        <ActivityIndicator size="large" color={color.dark_green} />
      </View>
    );
  }

  const mealTypeOptions = [
    { label: "Bữa sáng", value: MealType.Breakfast },
    { label: "Bữa trưa", value: MealType.Lunch },
    { label: "Bữa tối", value: MealType.Dinner },
    { label: "Ăn nhẹ", value: MealType.Snack },
  ];

  // Nếu không có món ăn nào được chọn
  if (!selectedDish) {
    return (
      <SafeAreaView style={styles.container}>
        <Text style={{ textAlign: "center", marginTop: 50 }}>
          Không tìm thấy món ăn.
        </Text>
      </SafeAreaView>
    );
  }

  const dishName = selectedDish.name;
  const dishTime = `${selectedDish.cookingTime} phút`;
  const dishCalories = `${selectedDish.calories} Kcal`;
  const dishCategory = selectedDish.category;
  const dishServings = `${selectedDish.servings} suất ăn`;
  const dishDescription = selectedDish.description;
  const calculateNutrion = calculateNutritionPercentages(selectedDish);

  const dishIngredients = selectedDish.ingredients
    ? selectedDish.ingredients
        .split(",")
        .map((item) => item.trim())
        .filter((item) => item.length > 0)
    : [];

  const dishMethods = selectedDish.instructions
    ? selectedDish.instructions
        .replace(/[,]+/g, "")
        .split(".")
        .map((item) => item.trim())
        .filter((item) => item.length > 0)
    : [];
  return (
    <SafeAreaView edges={["top"]} style={styles.container}>
      <ScrollView contentContainerStyle={{ paddingBottom: 40 }}>
        {/* Header - ảnh và nút quay lại (Giữ nguyên) */}
        <View style={styles.header}>
          <View style={styles.gobackButton}>
            <ButtonGoBack
              handleLogic={() => {
                if (isMenu) {
                  navigateCustom("/tabs/recipe");
                } else {
                  navigateCustom("/library");
                }
              }}
            />
          </View>
          <View style={styles.imageContainer}>
            {selectedDish.imageUrl ? (
              <Image src={selectedDish.imageUrl} style={styles.image} />
            ) : (
              <Image
                source={require("@assets/images/com-tam.png")}
                style={styles.image}
              />
            )}
          </View>
        </View>

        {/* Phần thân bo tròn nổi lên */}
        <View style={styles.bodyContainer}>
          <View style={styles.flyContainer}>
            <Text style={styles.titleText}>{dishName}</Text>

            {/* START: PHẦN THÔNG TIN ĐÃ SỬA ĐỔI */}

            {/* ⭐️ Hàng 1: Calories (Làm nổi bật) */}
            <View style={styles.caloriesContainer}>
              <AntDesign name="fire" size={30} color={color.red_dark} />
              <Text style={styles.calorieText}>{dishCalories}</Text>
            </View>

            {/* ⭐️ Hàng 2: Thời gian, Khẩu phần, Loại món ăn */}
            <View style={styles.infoRowContainer}>
              {/* Thời gian */}
              <View style={styles.infoItem}>
                <Ionicons
                  name="time-outline"
                  size={20}
                  color={color.dark_green}
                />
                <Text style={styles.infoText}>{dishTime}</Text>
              </View>
              <View style={styles.infoDivider} />

              {/* Khẩu phần (Servings) */}
              <View style={styles.infoItem}>
                <Ionicons
                  name="people-outline"
                  size={20}
                  color={color.dark_green}
                />
                <Text style={styles.infoText}>{dishServings}</Text>
              </View>
              <View style={styles.infoDivider} />

              {/* Loại món ăn */}
              <View style={styles.infoItem}>
                <Ionicons
                  name="fast-food-outline"
                  size={20}
                  color={color.dark_green}
                />
                <Text style={styles.infoText}>{dishCategory}</Text>
              </View>
            </View>

            {/* END: PHẦN THÔNG TIN ĐÃ SỬA ĐỔI */}

            <View style={styles.desContainer}>
              <Text style={{ fontFamily: FONTS.semiBold, fontSize: 17 }}>
                Giới thiệu
              </Text>
              <Text
                style={{
                  fontFamily: FONTS.regular,
                  fontSize: 14,
                  paddingHorizontal: 10,
                }}
              >
                {dishDescription}
              </Text>
            </View>
          </View>

          <Modal
            visible={isModalVisible}
            animationType="slide"
            transparent
            onRequestClose={() => setIsModalVisible(false)}
          >
            <View style={styles.modalOverlay}>
              <View style={styles.modalContainer}>
                <Text style={styles.modalTitle}>Thêm vào lịch sử</Text>

                {/* Số lượng */}
                <View style={styles.modalRow}>
                  <Text style={styles.modalLabel}>Số lượng:</Text>
                  <TextInput
                    style={styles.input}
                    keyboardType="numeric"
                    value={quantity.toString()}
                    onChangeText={(val) => setQuantity(Number(val) || 1)}
                  />
                </View>

                {/* Meal type */}
                <View style={styles.modalRow}>
                  <Text style={styles.modalLabel}>Bữa ăn:</Text>
                  <View style={styles.mealTypeContainer}>
                    {mealTypeOptions.map((item) => (
                      <Pressable
                        key={item.value}
                        style={[
                          styles.mealTypeButton,
                          mealType === item.value && {
                            backgroundColor: color.dark_green,
                          },
                        ]}
                        onPress={() => setMealType(item.value)}
                      >
                        <Text
                          style={{
                            color:
                              mealType === item.value
                                ? color.white
                                : color.black,
                          }}
                        >
                          {item.label}
                        </Text>
                      </Pressable>
                    ))}
                  </View>
                </View>

                {/* Tùy chỉnh dinh dưỡng */}
                <View style={{ marginTop: 10 }}>
                  <Text style={[styles.modalLabel, { marginBottom: 6 }]}>
                    Tùy chỉnh dinh dưỡng (Tùy chọn):
                  </Text>
                  {Object.keys(customNutrition).map((key) => (
                    <View style={styles.modalRow} key={key}>
                      <Text style={styles.modalLabelSmall}>{key}:</Text>
                      <TextInput
                        style={styles.inputSmall}
                        keyboardType="numeric"
                        placeholder="Mặc định theo món"
                        value={customNutrition[
                          key as keyof typeof customNutrition
                        ].toString()}
                        onChangeText={(val) =>
                          setCustomNutrition((prev) => ({
                            ...prev,
                            [key]: val === "" ? 0 : Number(val),
                          }))
                        }
                      />
                    </View>
                  ))}
                </View>

                {/* Nút xác nhận */}
                <View style={styles.modalButtons}>
                  <Pressable
                    style={[
                      styles.modalBtn,
                      { backgroundColor: color.grey },
                      createLoading && { opacity: 0.6 },
                    ]}
                    onPress={() => setIsModalVisible(false)}
                    disabled={createLoading}
                  >
                    <Text
                      style={[{ color: color.white }, globalStyles.regular]}
                    >
                      Hủy
                    </Text>
                  </Pressable>
                  <Pressable
                    style={[
                      styles.modalBtn,
                      { backgroundColor: color.dark_green },
                    ]}
                    onPress={async () => {
                      await handleAddPress();
                      setIsModalVisible(false);
                    }}
                    disabled={createLoading}
                  >
                    <Text
                      style={[
                        { color: color.white },
                        globalStyles.regular,
                        createLoading && { opacity: 0.6 },
                      ]}
                    >
                      Xác nhận
                    </Text>
                  </Pressable>
                </View>
              </View>
            </View>
          </Modal>

          {/* Dinh dưỡng (Giữ nguyên) */}
          <View style={styles.nutrions}>
            <View style={styles.headerNutrions}>
              <Text style={{ fontFamily: FONTS.semiBold, fontSize: 15 }}>
                Giá trị dinh dưỡng
              </Text>
              <View style={{ flexDirection: "row", alignItems: "center" }}>
                <Text
                  style={{ fontFamily: FONTS.semiBold, fontSize: 12 }}
                  onPress={() =>
                    navigateCustom("/nutrions", { params: { id: dishId } })
                  }
                >
                  Xem tất cả
                </Text>
                <MaterialIcons name="navigate-next" size={16} color="black" />
              </View>
            </View>

            <View style={styles.chartContainer}>
              <PieChart
                donut
                radius={60}
                innerRadius={40}
                data={[
                  { value: calculateNutrion.protein || 25, color: "#60A5FA" },
                  { value: calculateNutrion.fat || 35, color: "#FCA5A5" },
                  { value: calculateNutrion.carbs || 40, color: "#C4B5FD" },
                ]}
              />
              <View style={styles.legendContainer}>
                <View style={styles.legendItem}>
                  <View
                    style={[styles.colorBox, { backgroundColor: "#60A5FA" }]}
                  />
                  <Text style={styles.legendText}>
                    {calculateNutrion.protein}% Protein
                  </Text>
                </View>
                <View style={styles.legendItem}>
                  <View
                    style={[styles.colorBox, { backgroundColor: "#FCA5A5" }]}
                  />
                  <Text style={styles.legendText}>
                    {calculateNutrion.fat}% Chất béo
                  </Text>
                </View>
                <View style={styles.legendItem}>
                  <View
                    style={[styles.colorBox, { backgroundColor: "#C4B5FD" }]}
                  />
                  <Text style={styles.legendText}>
                    {calculateNutrion.carbs}% Chất đường bột
                  </Text>
                </View>
              </View>
            </View>

            <Text
              style={{
                fontFamily: FONTS.semiBold,
                fontSize: 12,
                textAlign: "center",
              }}
            >
              Theo % giá trị khuyến nghị DV – Daily Value, khuyến nghị hàng ngày
            </Text>

            {/* Tabs (Giữ nguyên) */}
            <View style={styles.buttonContainer}>
              <Pressable
                style={[tab === "ingre" ? styles.buttonActive : styles.button]}
                onPress={() => setTab("ingre")}
              >
                <Text
                  style={[
                    tab === "ingre"
                      ? styles.buttonTextActive
                      : styles.buttonText,
                  ]}
                >
                  Thành phần
                </Text>
              </Pressable>
              <Pressable
                style={[tab === "method" ? styles.buttonActive : styles.button]}
                onPress={() => setTab("method")}
              >
                <Text
                  style={[
                    tab === "method"
                      ? styles.buttonTextActive
                      : styles.buttonText,
                  ]}
                >
                  Cách làm
                </Text>
              </Pressable>
            </View>

            {/* Nội dung tab (Giữ nguyên) */}
            <View style={styles.contentContainer}>
              {tab === "ingre" ? (
                <View style={styles.ingredientsBox}>
                  <View style={styles.ingredientTags}>
                    {dishIngredients.map((ing, index) => (
                      <View key={index} style={styles.ingredientTag}>
                        <Text style={styles.ingredientText}>{ing.trim()}</Text>
                      </View>
                    ))}
                  </View>
                </View>
              ) : (
                <View style={styles.methodContainer}>
                  {dishMethods.map((stepContent, index) => (
                    <View key={index} style={styles.methodRow}>
                      <View style={styles.numberDots}>
                        <Text
                          style={{
                            color: color.white,
                            fontFamily: FONTS.semiBold,
                            fontSize: 14,
                          }}
                        >
                          {index + 1}
                        </Text>
                      </View>
                      <View style={styles.methodSteps}>
                        <Text style={styles.step}>Bước {index + 1}</Text>
                        <Text style={styles.stepContent}>{stepContent}</Text>
                      </View>
                    </View>
                  ))}
                </View>
              )}
            </View>
          </View>
        </View>
      </ScrollView>
      <Pressable
        style={[styles.addButton, createLoading && { opacity: 0.6 }]}
        onPress={() => {
          if (!selectedDish) return;
          setCustomNutrition({
            calories: selectedDish.calories || 0,
            protein: selectedDish.protein || 0,
            carbs: selectedDish.carbs || 0,
            fat: selectedDish.fat || 0,
            fiber: selectedDish.fiber || 0,
            sugar: selectedDish.sugar || 0,
          });
          setIsModalVisible(true);
        }}
        disabled={createLoading}
      >
        <AntDesign name="plus" size={20} color={color.white} />
        <Text style={styles.addButtonText}>Thêm vào lịch sử</Text>
      </Pressable>
    </SafeAreaView>
  );
}

// --- Cập nhật Styles ---
const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: color.white,
  },
  header: {
    backgroundColor: color.background_dish,
    height: 270,
    justifyContent: "center",
    alignItems: "center",
  },
  gobackButton: {
    position: "absolute",
    top: 30,
    left: 15,
  },
  imageContainer: {
    marginTop: 15,
    justifyContent: "center",
    alignItems: "center",
  },
  image: { width: 200, height: 200, borderRadius: 100, resizeMode: "cover", marginBottom: 15 },
  bodyContainer: {
    backgroundColor: color.white,
    borderRadius: 25,
    marginTop: -40, // bo góc chồng lên ảnh
    paddingBottom: 20,
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: "rgba(0,0,0,0.5)",
    justifyContent: "center",
    alignItems: "center",
  },
  modalContainer: {
    backgroundColor: color.white,
    width: "85%",
    borderRadius: 12,
    padding: 16,
  },
  modalTitle: {
    fontFamily: FONTS.bold,
    fontSize: 18,
    textAlign: "center",
    marginBottom: 12,
    color: color.dark_green,
  },
  modalRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginVertical: 4,
  },
  modalLabel: {
    fontFamily: FONTS.semiBold,
    fontSize: 14,
  },
  modalLabelSmall: {
    width: 90,
    fontFamily: FONTS.regular,
    fontSize: 13,
  },
  input: {
    borderWidth: 1,
    borderColor: color.grey,
    borderRadius: 8,
    paddingHorizontal: 8,
    paddingVertical: 4,
    width: 60,
    textAlign: "center",
  },
  inputSmall: {
    borderWidth: 1,
    borderColor: color.grey,
    borderRadius: 6,
    paddingHorizontal: 6,
    paddingVertical: 3,
    width: 80,
    textAlign: "center",
  },
  mealTypeContainer: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: 8,
  },
  mealTypeButton: {
    borderWidth: 1,
    borderColor: color.dark_green,
    borderRadius: 6,
    paddingVertical: 4,
    paddingHorizontal: 10,
  },
  modalButtons: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginTop: 20,
  },
  modalBtn: {
    paddingVertical: 10,
    paddingHorizontal: 16,
    borderRadius: 8,
    width: "45%",
    alignItems: "center",
  },
  flyContainer: {
    padding: 16,
    borderRadius: 25,
    backgroundColor: color.white,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 4,
    elevation: 5,
    marginBottom: 10, // Giảm khoảng cách giữa flyContainer và Nutrions
  },
  titleText: {
    marginTop: 10,
    fontFamily: FONTS.bold,
    fontSize: 25,
    marginBottom: 5,
    textAlign: "center", // Căn giữa tên món ăn
    color: color.dark_green,
  },

  // ⭐️ STYLES MỚI CHO CALORIES (Nổi bật)
  caloriesContainer: {
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
    marginBottom: 15,
    paddingVertical: 8,
    borderRadius: 10,
    marginHorizontal: 15,
  },
  calorieText: {
    fontFamily: FONTS.bold,
    fontSize: 24,
    marginLeft: 8,
    color: color.red_dark, // Màu đỏ cho calorie
  },

  // ⭐️ STYLES MỚI CHO HÀNG THÔNG TIN GỘP
  infoRowContainer: {
    flexDirection: "row",
    justifyContent: "space-evenly", // Căn đều các mục
    alignItems: "center",
    marginBottom: 20,
    paddingHorizontal: 10,
  },
  infoItem: {
    alignItems: "center",
  },
  infoText: {
    fontFamily: FONTS.semiBold,
    fontSize: 13,
    marginTop: 4,
    color: color.black,
  },
  infoDivider: {
    height: "100%",
    width: 1,
    backgroundColor: color.grey,
  },
  // END STYLES MỚI

  desContainer: {
    paddingHorizontal: 15,
    marginTop: 20,
  },
  nutrions: {
    paddingVertical: 20,
    paddingHorizontal: 15,
  },
  headerNutrions: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  chartContainer: {
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
    marginVertical: 20,
    gap: 20,
  },
  legendContainer: {
    gap: 8,
  },
  legendItem: {
    flexDirection: "row",
    alignItems: "center",
    gap: 6,
  },
  colorBox: {
    width: 14,
    height: 14,
    borderRadius: 3,
  },
  legendText: {
    fontSize: 14,
    fontFamily: FONTS.regular,
    color: "#333",
  },
  buttonContainer: {
    alignSelf: "center",
    marginVertical: 15,
    width: 220,
    height: 35,
    borderRadius: 8,
    borderWidth: 0.5,
    borderColor: color.grey,
    flexDirection: "row",
    justifyContent: "space-evenly",
    alignItems: "center",
  },
  button: {
    height: 25,
    width: 102,
  },
  buttonActive: {
    height: 25,
    width: 102,
    backgroundColor: color.dark_green,
    borderRadius: 8,
  },
  buttonText: {
    textAlign: "center",
    fontSize: 12,
    fontFamily: FONTS.semiBold,
    lineHeight: 25,
  },
  buttonTextActive: {
    textAlign: "center",
    fontSize: 12,
    fontFamily: FONTS.semiBold,
    lineHeight: 25,
    color: color.white,
  },
  contentContainer: {
    flex: 1,
    paddingHorizontal: 10,
  },
  ingredientsBox: {
    backgroundColor: color.light_gray + "30",
    borderRadius: 15,
    padding: 15,
    marginBottom: 20,
  },
  sectionTitle: {
    fontSize: 16,
    color: color.black,
    fontFamily: FONTS.bold,
    marginBottom: 12,
  },
  ingredientTags: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: 8,
  },
  ingredientTag: {
    backgroundColor: color.white,
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: 20,
    borderWidth: 1,
    borderColor: color.dark_green + "30",
  },
  ingredientText: {
    fontSize: 13,
    color: color.dark_green,
    fontFamily: FONTS.medium,
  },
  methodContainer: {
    flexDirection: "column",
    justifyContent: "center",
    gap: 12,
  },
  methodRow: {
    flexDirection: "row",
    alignItems: "flex-start",
    gap: 8,
  },
  numberDots: {
    backgroundColor: color.dark_green,
    width: 25,
    height: 25,
    borderRadius: 45,
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
  },
  methodSteps: {
    flex: 1,
  },
  step: {
    fontSize: 15,
    fontFamily: FONTS.semiBold,
    marginBottom: 2,
  },
  stepContent: {
    fontSize: 14,
    fontFamily: FONTS.regular,
  },
  addButton: {
    position: "absolute",
    bottom: 0,
    left: 0,
    right: 0,
    backgroundColor: color.dark_green,
    paddingVertical: 15,
    marginHorizontal: 16,
    marginBottom: 16,
    borderRadius: 10,
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
  },
  addButtonText: {
    color: color.white,
    fontFamily: FONTS.bold,
    fontSize: 16,
    marginLeft: 8,
  },
});
