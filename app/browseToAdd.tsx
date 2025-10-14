import color from "@constants/color";
import { FONTS } from "@constants/fonts";
import AntDesign from "@expo/vector-icons/AntDesign";
import { navigateCustom } from "@utils/navigation";
import React, { useState } from "react";
import {
    Modal,
    Pressable,
    ScrollView,
    StyleSheet,
    Text,
    TextInput,
    View,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

const foodItems = [
  { id: 1, name: "Olive Oil", details: "1 tbsp. (13½ g)", cal: 119 },
  { id: 2, name: "Apple", details: "1 fruit (182 g)", cal: 95 },
  {
    id: 3,
    name: "Chicken Breast, cooked",
    details: "1 whole (58 g)",
    cal: 114,
  },
  { id: 4, name: "Banana", details: "1 whole, regular (150 g)", cal: 134 },
  { id: 5, name: "White Rice, cooked", details: "1 cup (158 g)", cal: 205 },
  { id: 6, name: "Egg, boiled", details: "1 egg, regular (60 g)", cal: 93 },
  { id: 7, name: "Coffee", details: "1 cup (237 mL)", cal: 2 },
  { id: 8, name: "Scrambled Eggs", details: "2 large eggs (92 g)", cal: 198 },
  { id: 9, name: "Avocado", details: "½ wholes (135 g)", cal: 216 },
  { id: 10, name: "Avocado", details: "½ wholes (135 g)", cal: 216 },
  { id: 11, name: "AvocadoPlusTwo", details: "½ wholes (135 g)", cal: 216 },
];

// FoodItemRow nhận ID và các thông tin cần thiết
const FoodItemRow = ({ id, name, details, cal, onAdd }) => (
  <View style={styles.itemContainer}>
    <View style={styles.itemTextContent}>
      <Text style={styles.foodName}>{name}</Text>
      <Text style={styles.foodDetails}>{details}</Text>
    </View>
    <View style={styles.itemActions}>
      <Text style={styles.calorieText}>{cal} Cal</Text>
      {/* Truyền toàn bộ đối tượng món ăn vào hàm onAdd */}
      <Pressable
        style={styles.addButton}
        onPress={() => onAdd({ id, name, cal })}
      >
        <AntDesign name="plus-circle" size={24} color={color.dark_green} />
      </Pressable>
    </View>
  </View>
);

export default function BrowseToAdd() {
  const [searchText, setSearchText] = useState("");
  // CẬP NHẬT: selectedFoods chứa { id, name, cal, quantity }
  const [selectedFoods, setSelectedFoods] = useState([]);
  const [isModalVisible, setIsModalVisible] = useState(false);

  // Xử lý thêm món ăn hoặc tăng số lượng
  const handleAddFood = (food) => {
    const existingFoodIndex = selectedFoods.findIndex((f) => f.id === food.id);

    if (existingFoodIndex !== -1) {
      // Món đã tồn tại: Tăng số lượng
      const updatedFoods = [...selectedFoods];
      updatedFoods[existingFoodIndex].quantity += 1;
      setSelectedFoods(updatedFoods);
    } else {
      // Món mới: Thêm vào với số lượng là 1
      setSelectedFoods([...selectedFoods, { ...food, quantity: 1 }]);
    }
  };

  // Xử lý giảm số lượng hoặc xóa món
  const handleUpdateQuantity = (id, change) => {
    const updatedFoods = selectedFoods
      .map((f) => {
        if (f.id === id) {
          const newQuantity = f.quantity + change;
          if (newQuantity < 1) return null; // Đánh dấu để xóa
          return { ...f, quantity: newQuantity };
        }
        return f;
      })
      .filter(Boolean); // Lọc bỏ các món có quantity < 1

    setSelectedFoods(updatedFoods);

    // Nếu không còn món nào, đóng Modal
    if (updatedFoods.length === 0) {
      setIsModalVisible(false);
    }
  };

  const totalFoodCount = selectedFoods.reduce((sum, f) => sum + f.quantity, 0);

  const filteredFoods = foodItems.filter((item) =>
    item.name.toLowerCase().includes(searchText.toLowerCase())
  );

  const functionGetValue = (food: any) => {
    if (food.quantity === 1) return `${food.cal} Cal`;
    const totalCal = food.cal * food.quantity;
    return `${totalCal} Cal ${food.cal} Cal/món)`;
  };

  return (
    <SafeAreaView style={styles.screenContainer}>
      <ScrollView
        contentContainerStyle={styles.scrollContent}
        style={styles.scrollView}
      >
        <View style={styles.headerContainer}>
          <Pressable
            onPress={() => {
              navigateCustom("/tabs");
            }}
          >
            <AntDesign name="arrow-left" size={20} color={color.black} />
          </Pressable>
          <Text style={styles.headerTitle}>Bữa sáng</Text>
        </View>

        <View style={styles.bodyContainer}>
          {/* Tìm kiếm */}
          <View style={styles.searchContainer}>
            <TextInput
              style={styles.searchInput}
              placeholder="Tìm kiếm món ăn..."
              placeholderTextColor={color.gray_dark}
              value={searchText}
              onChangeText={setSearchText}
            />
            <AntDesign
              name="search"
              size={20}
              color={color.gray_dark}
              style={styles.searchIcon}
            />
          </View>

          {/* Danh sách món ăn */}
          <View style={styles.listContainer}>
            {filteredFoods.map((item) => (
              <FoodItemRow
                key={item.id}
                id={item.id} // Truyền ID
                name={item.name}
                details={item.details}
                cal={item.cal}
                onAdd={handleAddFood}
              />
            ))}
          </View>
        </View>
      </ScrollView>

      {/* Footer */}
      {totalFoodCount > 0 && ( // Chỉ hiển thị footer nếu có món đã chọn
        <View style={styles.floatingFooter}>
          <View style={styles.footerInner}>
            <Pressable
              style={styles.countCircle}
              onPress={() => setIsModalVisible(true)}
            >
              <Text style={styles.countText}>{totalFoodCount}</Text>
            </Pressable>
            <Pressable style={styles.doneButton}>
              <Text style={styles.doneButtonText}>Hoàn tất</Text>
            </Pressable>
          </View>
        </View>
      )}

      {/* Modal hiển thị món đã thêm */}
      <Modal
        visible={isModalVisible}
        transparent
        animationType="slide"
        onRequestClose={() => setIsModalVisible(false)}
      >
        <Pressable
          style={styles.modalBackdrop}
          onPress={() => setIsModalVisible(false)}
        >
          <Pressable style={styles.modalContainer}>
            {" "}
            {/* Ngăn chặn đóng modal khi chạm vào container */}
            <Text style={styles.modalTitle}>Món đã thêm</Text>
            <ScrollView style={{ maxHeight: 300 }}>
              {selectedFoods.map((food) => (
                <View key={food.id} style={styles.modalItem}>
                  <View style={{ flex: 1 }}>
                    <Text style={styles.modalFoodName}>{food.name}</Text>
                    <Text style={styles.modalCal}>
                      {functionGetValue(food)}
                    </Text>
                  </View>

                  {/* CONTROLS SỐ LƯỢNG */}
                  <View style={styles.quantityControls}>
                    <Pressable
                      style={styles.quantityButton}
                      onPress={() => handleUpdateQuantity(food.id, -1)}
                    >
                      <AntDesign
                        name="minus"
                        size={18}
                        color={color.dark_green}
                      />
                    </Pressable>
                    <Text style={styles.quantityText}>{food.quantity}</Text>
                    <Pressable
                      style={styles.quantityButton}
                      onPress={() => handleUpdateQuantity(food.id, 1)}
                    >
                      <AntDesign
                        name="plus"
                        size={18}
                        color={color.dark_green}
                      />
                    </Pressable>
                  </View>
                </View>
              ))}
              {selectedFoods.length === 0 && (
                <Text
                  style={{
                    textAlign: "center",
                    color: color.gray_dark,
                    marginTop: 10,
                  }}
                >
                  Chưa có món nào được thêm
                </Text>
              )}
            </ScrollView>
            <Pressable
              style={styles.closeButton}
              onPress={() => setIsModalVisible(false)}
            >
              <Text style={styles.closeButtonText}>Đóng</Text>
            </Pressable>
          </Pressable>
        </Pressable>
      </Modal>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  screenContainer: { flex: 1, backgroundColor: color.white },
  scrollView: { flex: 1 },
  scrollContent: { paddingBottom: 100 },
  headerContainer: {
    padding: 16,
    borderBottomWidth: 1,
    borderBottomColor: color.light_gray,
    flexDirection: "row", 
    gap: 20,
  },
  listContainer: {},
  headerTitle: { fontFamily: FONTS.semiBold, fontSize: 18, color: color.black },
  bodyContainer: { paddingHorizontal: 16 },
  searchContainer: {
    flexDirection: "row",
    alignItems: "center",
    borderWidth: 1,
    borderColor: color.light_gray,
    borderRadius: 8,
    paddingHorizontal: 12,
    marginVertical: 15,
    backgroundColor: color.gray_light,
  },
  searchInput: {
    flex: 1,
    height: 45,
    fontFamily: FONTS.regular,
    fontSize: 16,
    paddingRight: 10,
    color: color.black,
  },
  searchIcon: { marginLeft: 8 },
  itemContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: color.light_gray,
  },
  itemTextContent: { flex: 1, paddingRight: 10 },
  foodName: { fontFamily: FONTS.semiBold, fontSize: 16, color: color.black },
  foodDetails: {
    fontFamily: FONTS.regular,
    fontSize: 12,
    color: color.gray_dark,
    marginTop: 2,
  },
  itemActions: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "flex-end",
    width: "35%",
  },
  calorieText: {
    fontFamily: FONTS.semiBold,
    fontSize: 16,
    color: color.black,
    marginRight: 10,
  },
  addButton: { padding: 4 },
  floatingFooter: {
    position: "absolute",
    bottom: 0,
    left: 0,
    right: 0,
    paddingHorizontal: 16,
    paddingVertical: 10,
    backgroundColor: color.white,
    borderTopWidth: 1,
    borderTopColor: color.light_gray,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: -2 },
    shadowOpacity: 0.1,
    shadowRadius: 3,
    elevation: 5,
  },
  footerInner: {
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
    gap: 15,
  },
  countCircle: {
    backgroundColor: color.dark_green,
    width: 40,
    height: 40,
    borderRadius: 20,
    justifyContent: "center",
    alignItems: "center",
  },
  countText: { color: color.white, fontFamily: FONTS.bold, fontSize: 18 },
  doneButton: {
    backgroundColor: color.dark_green,
    paddingVertical: 12,
    borderRadius: 8,
    alignItems: "center",
    justifyContent: "center",
    flex: 1,
    marginLeft: 10,
    maxWidth: "80%",
  },
  doneButtonText: { color: color.white, fontFamily: FONTS.bold, fontSize: 16 },

  // --- MODAL ---
  modalBackdrop: {
    flex: 1,
    backgroundColor: "rgba(0,0,0,0.3)",
    justifyContent: "center",
    alignItems: "center",
  },
  modalContainer: {
    width: "85%",
    backgroundColor: color.white,
    borderRadius: 10,
    padding: 16,
  },
  modalTitle: {
    fontFamily: FONTS.bold,
    fontSize: 18,
    marginBottom: 10,
    color: color.black,
  },
  modalItem: {
    flexDirection: "row",
    justifyContent: "space-between",
    borderBottomWidth: 1,
    borderBottomColor: color.light_gray,
    paddingVertical: 10,
    alignItems: "center",
  },
  modalFoodName: { fontFamily: FONTS.semiBold, fontSize: 16 },
  modalCal: {
    fontFamily: FONTS.regular,
    color: color.gray_dark,
    fontSize: 13,
  },
  // Controls số lượng trong modal
  quantityControls: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: color.gray_light,
    borderRadius: 5,
    paddingHorizontal: 2,
  },
  quantityButton: {
    padding: 5,
  },
  quantityText: {
    fontFamily: FONTS.semiBold,
    fontSize: 15,
    minWidth: 20,
    textAlign: "center",
    color: color.black,
  },
  closeButton: {
    marginTop: 16,
    backgroundColor: color.dark_green,
    borderRadius: 8,
    alignItems: "center",
    paddingVertical: 10,
  },
  closeButtonText: { color: color.white, fontFamily: FONTS.bold, fontSize: 16 },
});
