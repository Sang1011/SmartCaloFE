import EditMealModal from "@components/ui/editMealModal";
import MealSummary from "@components/ui/mealSummary";
import Color from "@constants/color";
import { FONTS } from "@constants/fonts";
import AntDesign from "@expo/vector-icons/AntDesign";
import Feather from "@expo/vector-icons/Feather";
import { navigateCustom } from "@utils/navigation";
import { useMemo, useState } from "react";
import { Pressable, ScrollView, StyleSheet, Text, View } from "react-native";
import { scale } from "react-native-size-matters";

export type MealItem = {
  id: number;
  name: string;
  quantity: string;
  calories: number;
  protein: number;
  fat: number;
  sugar: number;
  fiber: number;
};

// Dữ liệu giả định ban đầu
const initialItems: MealItem[] = [
  {
    id: 1,
    name: "Chicken Breast, cooked",
    quantity: "1 whole (58 g)",
    calories: 114,
    protein: 15.0,
    fat: 5.0,
    sugar: 0.5,
    fiber: 0.0,
  },
  {
    id: 2,
    name: "Olive Oil",
    quantity: "1 tbsp. (13½ g)",
    calories: 119,
    protein: 0.0,
    fat: 13.5,
    sugar: 0.0,
    fiber: 0.0,
  },
];

const mealDataTemplate = {
  name: "Lunch",
  nutritionDetails: {
    targetCal: 552,
    targetProtein: 27,
    targetCarbs: 67,
    targetFat: 18,
    fiber: 0.0,
  },
};

export default function ViewData() {
  const [items, setItems] = useState(initialItems);
  const [isEditModalVisible, setIsEditModalVisible] = useState(false);

  // Tính toán lại tổng calo và macro
  const calculatedData = useMemo(() => {
    const totalCal = items.reduce((sum, item) => sum + item.calories, 0);
    const totalProtein = items.reduce((sum, item) => sum + item.protein, 0);
    const totalFat = items.reduce((sum, item) => sum + item.fat, 0);
    const totalSugar = items.reduce((sum, item) => sum + (item.sugar || 0), 0);
    const totalFiber = items.reduce((sum, item) => sum + (item.fiber || 0), 0);

    // Giả định carbs là tổng của Sugar + Fiber (tạm thời)
    // Tạm thời bỏ qua công thức tính carbs chính xác từ macro
    const totalCarbs = totalSugar + totalFiber;

    return {
      totalCal,
      protein: totalProtein,
      carbs: totalCarbs,
      fat: totalFat,
      sugar: totalSugar,
      fiber: totalFiber,
      ...mealDataTemplate,
    };
  }, [items]);

  const { totalCal, carbs, protein, fat, sugar, fiber, nutritionDetails } =
    calculatedData;

  // Xử lý xóa món ăn (nhận mảng ID từ Modal)
  const handleDeleteItem = (idsToRemove: number[]) => {
    if (idsToRemove && idsToRemove.length > 0) {
      setItems((prevItems) =>
        prevItems.filter((item) => !idsToRemove.includes(item.id))
      );
    }
  };

  // Hàm render cho thanh tiến trình (Giữ logic PRO lock)
  const renderCalorieProgressBar = (
    value: number,
    target: number,
    label: string
  ) => (
    <View style={styles.macroRow}>
      <Text style={styles.macroLabel}>{label}</Text>
      <View style={styles.progressBarBackground}>
        <View style={styles.proLockFull}>
          <AntDesign name="lock" size={scale(14)} color={Color.white} />
          <Text style={styles.proText}> PRO</Text>
        </View>
      </View>
      <Text style={styles.macroTarget}>
        {value} / {target}{label === "Calories" ? "Cal" : "g"}
      </Text>
    </View>
  );

  return (
    <View style={styles.container}>
      {/* 1. Header (giữ bên ngoài ScrollView để cố định) */}
      <View style={styles.header}>
        <Pressable
          onPress={() => {
            navigateCustom("/tabs");
          }}
        >
          <AntDesign name="arrow-left" size={scale(24)} color={Color.black} />
        </Pressable>
        <Text style={styles.headerTitle}>{calculatedData.name}</Text>
        <View style={styles.headerActions}>
          <Pressable
            style={styles.actionButton}
            onPress={() => setIsEditModalVisible(true)}
          >
            <Feather name="edit" size={scale(24)} color={Color.dark_green} />
          </Pressable>
        </View>
      </View>

      {/* Bọc toàn bộ nội dung còn lại trong ScrollView */}
      <ScrollView contentContainerStyle={styles.scrollViewContent}>
        {/* 2. Tổng quan Bữa Ăn (Tách thành MealSummary) */}
        {/* Giả định MealSummary đã dùng các màu từ Color, nên không cần thay đổi */}
        <MealSummary
          totalCal={totalCal}
          protein={protein}
          fat={fat}
          sugar={sugar}
          fiber={fiber}
        />

        {/* 3. Danh sách các món ăn */}
        <View style={styles.itemsList}>
          <Text style={styles.listTitle}>Các món đã dùng</Text>{" "}
          {/* Thêm tiêu đề danh sách */}
          {items.map((item) => (
            <View key={item.id} style={styles.itemRow}>
              <View style={styles.itemDetails}>
                <Text style={styles.itemName}>{item.name}</Text>
                <Text style={styles.itemQuantity}>{item.quantity}</Text>
              </View>
              <Text style={styles.itemCalories}>{item.calories} Cal</Text>
            </View>
          ))}
          {items.length === 0 && (
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

        {/* 4. Thông tin Dinh dưỡng (Nutrition Facts) */}
        {nutritionDetails && (
          <View style={styles.nutritionFactsContainer}>
            <Text style={styles.nutritionFactsTitle}>
              Nutrition Facts (PRO Feature)
            </Text>
            {renderCalorieProgressBar(
              0,
              nutritionDetails.targetCal,
              "Calories"
            )}
            {renderCalorieProgressBar(0, nutritionDetails.targetCarbs, "Carbs")}
            {renderCalorieProgressBar(
              0,
              nutritionDetails.targetProtein,
              "Protein"
            )}
            {renderCalorieProgressBar(0, nutritionDetails.targetFat, "Fat")}
          </View>
        )}

        {/* 5. Footer tóm tắt chi tiết */}
        <View style={styles.footerContainer}>
          <Text style={styles.footerSummaryTitle}>Tổng quan dinh dưỡng</Text>

          <View style={styles.footerRow}>
            <Text style={styles.footerLabel}>Calories</Text>
            <Text style={[styles.footerValue, { color: Color.dark_green }]}>
              {totalCal} Cal
            </Text>
          </View>

          <View style={styles.footerRow}>
            <Text style={styles.footerLabel}>Protein</Text>
            <Text style={styles.footerValue}>{protein} g</Text>
          </View>

          <View style={styles.footerRow}>
            <Text style={styles.footerLabel}>Chất béo</Text>
            <Text style={styles.footerValue}>{fat} g</Text>
          </View>

          <View style={styles.footerRow}>
            <Text style={styles.footerLabel}>Đường</Text>
            <Text style={styles.footerValue}>{sugar} g</Text>
          </View>

          <View style={styles.footerRow}>
            <Text style={styles.footerLabel}>Chất xơ</Text>
            <Text style={styles.footerValue}>{fiber} g</Text>
          </View>
        </View>
      </ScrollView>

      {/* Modal (Giữ bên ngoài ScrollView) */}
      <EditMealModal
        isVisible={isEditModalVisible}
        onClose={() => setIsEditModalVisible(false)}
        items={items}
        onDelete={handleDeleteItem}
      />
    </View>
  );
}

// =================================================================
// Styles cho ViewData (Đã cập nhật màu)
// =================================================================
const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Color.background, // Nền ngoài cùng
  },
  scrollViewContent: {
    flexGrow: 1,
    paddingBottom: scale(20),
  },

  // 1. Header (Cố định)
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
    textAlign: "center",
    marginLeft: "20%",
    fontSize: scale(18),
    fontFamily: FONTS.semiBold,
    color: Color.black,
  },
  headerActions: {
    flexDirection: "row",
    width: scale(80),
    justifyContent: "flex-end",
  },

  // 3. Items List
  itemsList: {
    paddingHorizontal: scale(20),
    paddingVertical: scale(10),
    backgroundColor: Color.white,
    marginTop: scale(10), // Khoảng cách giữa MealSummary và danh sách
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
    color: Color.grey, // Dùng gray/grey cho chữ phụ
    marginTop: scale(2),
  },
  itemCalories: {
    fontSize: scale(15),
    fontFamily: FONTS.semiBold,
    color: Color.dark_green, // Calo dùng màu nhấn
  },
  emptyListText: {
    fontSize: scale(14),
    fontFamily: FONTS.regular,
    color: Color.gray,
    textAlign: "center",
    paddingVertical: scale(10),
  },

  // Nút thêm món ăn
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

  // 4. Nutrition Facts (Logic tiến trình bị khóa)
  nutritionFactsContainer: {
    padding: scale(20),
    backgroundColor: Color.white, // Chuyển nền trắng để dễ phân biệt
    marginTop: scale(10),
    borderTopWidth: 1,
    borderTopColor: Color.light_gray,
  },
  nutritionFactsTitle: {
    fontSize: scale(16),
    fontFamily: FONTS.bold,
    color: Color.black, // Đổi màu tiêu đề thành đen
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
    backgroundColor: Color.gray_light, // Nền xám nhạt cho thanh tiến trình
    borderRadius: 10,
    marginHorizontal: scale(10),
    justifyContent: "center",
    overflow: "hidden",
    borderWidth: 0, // Bỏ border
  },
  proLockFull: {
    flex: 1,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: Color.black_70, // Lớp phủ đen mờ
  },
  proText: {
    fontSize: scale(12),
    fontFamily: FONTS.bold,
    color: Color.white,
  },
  macroTarget: {
    width: scale(70),
    textAlign: "right",
    fontSize: scale(12),
    fontFamily: FONTS.medium,
    color: Color.gray,
  },

  // 5. Footer
  footerContainer: {
    padding: scale(20),
    backgroundColor: Color.white,
    marginTop: scale(10),
    borderTopWidth: 1,
    borderTopColor: Color.light_gray,
  },
  footerSummaryTitle: {
    fontSize: scale(16),
    fontFamily: FONTS.bold,
    color: Color.black,
    marginBottom: scale(15),
    borderBottomWidth: 1,
    borderBottomColor: Color.light_gray,
    paddingBottom: scale(8),
  },
  footerRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: scale(10),
  },
  footerLabel: {
    fontSize: scale(15),
    fontFamily: FONTS.regular,
    color: Color.black_60, // Chữ phụ màu hơi xám
  },
  footerValue: {
    fontSize: scale(15),
    fontFamily: FONTS.semiBold,
    color: Color.black,
  },
  // Đã xóa các styles không dùng (proBadge, proTextSmall, etc.)
});
