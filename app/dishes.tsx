import ButtonGoBack from "@components/ui/buttonGoBack";
import color from "@constants/color";
import { FONTS } from "@constants/fonts";
import AntDesign from "@expo/vector-icons/AntDesign";
import Ionicons from "@expo/vector-icons/Ionicons";
import MaterialIcons from "@expo/vector-icons/MaterialIcons";
import { clearSelectedDish, fetchDishById } from "@features/dishes";
import { RootState } from "@redux";
import { useAppDispatch, useAppSelector } from "@redux/hooks";
import { calculateNutritionPercentages } from "@utils/calculateNutrionPercentages";
import { navigateCustom } from "@utils/navigation";
import { useLocalSearchParams } from "expo-router";
import { useEffect, useState } from "react";
import {
  ActivityIndicator,
  Image,
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  View,
} from "react-native";
import { PieChart } from "react-native-gifted-charts/dist";
import { SafeAreaView } from "react-native-safe-area-context";

// Dữ liệu mẫu đã được xử lý (Giữ nguyên)
const rawIngredients =
  "Thịt heo 300 Gr, Thơm 1/2 Trái, Nước dừa 100 muỗngl, Ớt 2 Trái, Hạt nêm 1 muỗnguỗng cà phê, Nước mắm 1 muỗnguỗng canh, Tiêu 1/2 muỗnguỗng cà phê, Đường trắng 1 muỗnguỗng canh, Muối 1/2 muỗnguỗng cà phê, Dầu ăn 2 muỗnguỗng canh";

const rawMethods =
  "Gà rửa sạch, chặt miếng vừa ăn rồi ướp với 1 muỗnguỗng cà phê hạt nêm, 1 muỗnguỗng cà phê nước mắm ngon, 1/2 muỗnguỗng cà phê tiêu, ướp gà khoảng 2 giờ. Cho thịt gà vào lò vi sóng nấu khoảng 6-7 phút, đến khi chín sơ, rắc đều một lớp bột chiên giòn lên các miếng thịt gà., Gừng cắt sợi.Sả, riềng, tỏi băm nhuyễn. Lá lốt rửa sạch, cắt sợi mỏng. Hành tím cắt lát., Bắc chảo lên bếp, đun nóng dầu lên, cho gà vào chiên vàng rồi vớt ra, để ráo dầu., Vẫn chảo dầu ấy, cho tỏi vào phi thơm vàng. Tiếp tục cho sả, hành tím, lá lốt và gừng vào đảo đều, nêm với 2 muỗnguỗng cà phê hạt nêm., Cuối cùng cho gà đã chiên vàng vào xào nhanh tay rồi tắt bếp., Lấy ra đĩa, ăn với cơm. Chút cay nồng của gừng, chút ấm thơm của sả khiến người thưởng thức thêm ấm lòng ngày mưa lạnh.";

const methods = rawMethods
  .replace(/[,]+/g, "") // xoá hết dấu phẩy thừa
  .split(".") // tách theo dấu chấm
  .map((item) => item.trim())
  .filter((item) => item.length > 0);

export default function Dishes() {
  const [tab, setTab] = useState<"ingre" | "method">("ingre");
  const { id, menuId } = useLocalSearchParams();
  const dispatch = useAppDispatch();
  const { selectedDish, loading } = useAppSelector(
    (state: RootState) => state.dish
  );
  const [dishId, setDishId] = useState<string | null>(null);
  const [menuCheckId, setMenuCheckId] = useState<string | null>(null);

  useEffect(() => {
    const extractedId = Array.isArray(id) ? id[0] : id;
    const extractedMenuId = Array.isArray(menuId) ? menuId[0] : menuId;

    if (extractedId && typeof extractedId === "string") {
      setDishId(extractedId);
      dispatch(fetchDishById(extractedId));
    } else {
      console.warn("⚠️ Không tìm thấy dishId hợp lệ:", id);
    }

    if(extractedMenuId && typeof extractedMenuId === "string"){
      setMenuCheckId(extractedMenuId);
    }

    return () => {
      dispatch(clearSelectedDish());
    };
  }, [id, menuId, dispatch]);

  const handleAddPress = () => {
    navigateCustom("/addMealEntry");
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
  const dishImageUrl = selectedDish.imageUrl;
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
                if (menuCheckId) {
                  navigateCustom("/RecipeDetail", {
                    params: {
                      manuId: menuCheckId
                    }
                  });
                }else{
                  navigateCustom("/library");
                }
              }}
            />
          </View>
          <View style={styles.imageContainer}>
            {dishImageUrl ? (
              <Image src={dishImageUrl} style={styles.image} />
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
                <View style={styles.ingreContainer}>
                  {dishIngredients.map((item, index) => (
                    <View key={index} style={styles.ingreRow}>
                      <Text style={styles.bulletPoint}>•</Text>
                      <Text style={styles.ingreText}>{item}</Text>
                    </View>
                  ))}
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
      <Pressable style={styles.addButton} onPress={handleAddPress}>
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
  image: {
    marginHorizontal: "auto",
  },
  bodyContainer: {
    backgroundColor: color.white,
    borderRadius: 25,
    marginTop: -40, // bo góc chồng lên ảnh
    paddingBottom: 20,
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
  ingreContainer: {
    flexDirection: "column",
    gap: 8,
  },
  ingreRow: {
    flexDirection: "row",
    alignItems: "flex-start",
    paddingHorizontal: 5,
  },
  bulletPoint: {
    marginRight: 8,
    fontSize: 16,
    lineHeight: 20,
    color: color.dark_green,
  },
  ingreText: {
    fontFamily: FONTS.regular,
    fontSize: 15,
    flexShrink: 1,
    lineHeight: 20,
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
