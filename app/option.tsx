import Color from "@constants/color";
import { FONTS } from "@constants/fonts";
import AntDesign from "@expo/vector-icons/AntDesign";
import MaterialCommunityIcons from "@expo/vector-icons/MaterialCommunityIcons";
import { navigateCustom } from "@utils/navigation";
import { useState } from "react";
import {
  Modal,
  Pressable,
  StyleSheet,
  Text,
  TouchableWithoutFeedback,
  View,
} from "react-native";
import { scale } from "react-native-size-matters"; // Dùng để scaling nếu bạn có thư viện này

// Danh sách các tùy chọn bữa ăn
const mealOptions = [
  { key: "Breakfast", label: "Bữa sáng" },
  { key: "Lunch", label: "Bữa trưa" },
  { key: "Dinner", label: "Bữa tối" },
  { key: "Snacks", label: "Bữa phụ" },
];

/**
 * Component Select Tùy Chỉnh (Mô phỏng Dropdown)
 */
const MealSelect = ({ selectedMeal, setSelectedMeal }) => {
  const [isModalVisible, setIsModalVisible] = useState(false);

  const currentLabel =
    mealOptions.find((opt) => opt.key === selectedMeal)?.label || "Chọn bữa ăn";

  const handleSelect = (key) => {
    setSelectedMeal(key);
    setIsModalVisible(false);
  };

  return (
    <>
      {/* Nút hiển thị giá trị đã chọn */}
      <Pressable
        style={selectStyles.dropdownButton}
        onPress={() => setIsModalVisible(true)}
      >
        <Text style={selectStyles.dropdownText}>{currentLabel}</Text>
        <AntDesign name="caret-down" size={14} color={Color.dark_green} />
      </Pressable>

      {/* Modal cho danh sách tùy chọn */}
      <Modal
        visible={isModalVisible}
        transparent={true}
        animationType="fade"
        onRequestClose={() => setIsModalVisible(false)}
      >
        <TouchableWithoutFeedback onPress={() => setIsModalVisible(false)}>
          <View style={selectStyles.overlay}>
            <View style={selectStyles.dropdownList}>
              {mealOptions.map((meal) => (
                <Pressable
                  key={meal.key}
                  style={selectStyles.dropdownItem}
                  onPress={() => handleSelect(meal.key)}
                >
                  <Text
                    style={[
                      selectStyles.itemText,
                      meal.key === selectedMeal &&
                        selectStyles.itemTextSelected,
                    ]}
                  >
                    {meal.label}
                  </Text>
                </Pressable>
              ))}
            </View>
          </View>
        </TouchableWithoutFeedback>
      </Modal>
    </>
  );
};

export default function OptionScreen() {
  const [selectedMeal, setSelectedMeal] = useState("Breakfast");

  return (
    <View style={styles.container}>
      {/* 1. Nút Quay Lại (prevButton) */}
      <Pressable
        style={styles.backButton}
        onPress={() => {
          navigateCustom("/tabs");
        }}
      >
        <AntDesign name="arrow-left" size={24} color={Color.black} />
      </Pressable>

      <Text style={styles.instructionText}>Hãy lựa chọn phương thức thêm:</Text>

      {/* 3. Button Chụp ảnh (snap) */}
      <Pressable
        style={styles.actionButton}
        onPress={() => navigateCustom("/scan")}
      >
        <View style={styles.iconWrapper}>
          <MaterialCommunityIcons
            name="camera"
            size={36}
            color={Color.dark_green}
          />
        </View>
        <View style={styles.textWrapper}>
          <Text style={styles.actionTitle}>Chụp ảnh</Text>
          <Text style={styles.actionDescription}>
            Chụp ảnh hoặc gửi ảnh bữa ăn để nhận thông tin dinh dưỡng.
          </Text>
        </View>
      </Pressable>

      {/* 4. Button Search */}
      <Pressable
        style={styles.actionButton}
        onPress={() => navigateCustom("/library")}
      >
        <View style={styles.iconWrapper}>
          <MaterialCommunityIcons
            name="magnify"
            size={36}
            color={Color.dark_green}
          />
        </View>
        <View style={styles.textWrapper}>
          <Text style={styles.actionTitle}>Tìm kiếm</Text>
          <Text style={styles.actionDescription}>
            Tìm kiếm bằng database của chúng tôi.
          </Text>
        </View>
      </Pressable>
    </View>
  );
}

// Styles cho MealSelect (Dropdown)
const selectStyles = StyleSheet.create({
  dropdownButton: {
    flexDirection: "row",
    justifyContent: "flex-start",
    gap: 8,
    alignItems: "center",
    padding: scale(15),
    borderRadius: 12,
    marginBottom: scale(30),
  },
  dropdownText: {
    fontSize: scale(16),
    fontFamily: FONTS.semiBold,
    color: Color.dark_green,
  },
  overlay: {
    flex: 1,
    backgroundColor: Color.black_50, // Nền mờ cho Modal
    justifyContent: "center",
    alignItems: "center",
  },
  dropdownList: {
    width: "80%",
    backgroundColor: Color.white,
    borderRadius: 12,
    paddingHorizontal: scale(10),
    paddingVertical: scale(5),
    shadowColor: Color.black,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.1,
    shadowRadius: 5,
    elevation: 10,
  },
  dropdownItem: {
    paddingVertical: scale(12),
    borderBottomWidth: 1,
    borderBottomColor: Color.light_gray,
  },
  itemText: {
    fontSize: scale(16),
    fontFamily: FONTS.regular,
    color: Color.black,
  },
  itemTextSelected: {
    fontFamily: FONTS.bold,
    color: Color.dark_green,
  },
});

// Styles cho OptionScreen (Giữ lại và điều chỉnh nhẹ)
const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Color.white, // Nền trắng
    padding: scale(20),
  },
  backButton: {
    marginTop: 30,
    paddingVertical: scale(10),
    marginBottom: scale(10),
    alignSelf: "flex-start",
  },
  headerTitle: {
    fontSize: scale(20),
    fontFamily: FONTS.bold,
    color: Color.black,
    marginBottom: scale(20),
  },

  // Tùy chọn Bữa Ăn (Đã loại bỏ container cũ, sử dụng MealSelect)

  instructionText: {
    fontSize: scale(16),
    fontFamily: FONTS.semiBold,
    color: Color.black,
    marginBottom: scale(15),
  },

  // Nút Hành Động (Chụp ảnh/Tìm kiếm) - Đã bỏ mũi tên bên phải để gọn gàng hơn
  actionButton: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: Color.white,
    padding: scale(15),
    borderRadius: 12,
    marginBottom: scale(15),
    borderWidth: 1.5,
    borderColor: Color.light_gray,

    shadowColor: Color.dark_green,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.05,
    shadowRadius: 5,
    elevation: 5,
  },
  iconWrapper: {
    padding: scale(10),
    borderRadius: 8,
    backgroundColor: Color.dark_green + "10", // Màu dark_green mờ cho nền icon
    marginRight: scale(15),
  },
  textWrapper: {
    flex: 1,
    justifyContent: "center",
  },
  actionTitle: {
    fontSize: scale(16),
    fontFamily: FONTS.semiBold,
    color: Color.dark_green, // Title màu dark_green
    marginBottom: scale(2),
  },
  actionDescription: {
    fontSize: scale(12),
    fontFamily: FONTS.regular,
    color: Color.gray,
  },
});
