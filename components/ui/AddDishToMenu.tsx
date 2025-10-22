// AddDishModal.tsx
import color from "@constants/color";
import { FONTS } from "@constants/fonts";
import Entypo from '@expo/vector-icons/Entypo';
import React from "react";
import {
    ActivityIndicator,
    Alert,
    FlatList,
    Image,
    Modal,
    Pressable,
    StyleSheet,
    Text,
    TextInput,
    View,
} from "react-native";
import { Dish } from "../../types/dishes";

interface AddDishModalProps {
  visible: boolean;
  onClose: () => void;
  dishes: Dish[];
  loading: boolean;
  onAddDish: (dish: Dish) => void;
  mealType: string;
}

export const AddDishModal: React.FC<AddDishModalProps> = ({
  visible,
  onClose,
  dishes,
  loading,
  onAddDish,
  mealType,
}) => {
  const [searchText, setSearchText] = React.useState("");
  const [filteredDishes, setFilteredDishes] = React.useState<Dish[]>(dishes);

  React.useEffect(() => {
    if (searchText.trim() === "") {
      setFilteredDishes(dishes);
    } else {
      const filtered = dishes.filter((dish) =>
        dish.name.toLowerCase().includes(searchText.toLowerCase())
      );
      setFilteredDishes(filtered);
    }
  }, [searchText, dishes]);

  const handleAddDish = (dish: Dish) => {
    Alert.alert(
      "Thêm món ăn",
      `Bạn có muốn thêm "${dish.name}" vào ${mealType}?`,
      [
        { text: "Hủy", style: "cancel" },
        {
          text: "Thêm",
          onPress: () => {
            onAddDish(dish);
            Alert.alert("Thành công", "Đã thêm món ăn vào thực đơn");
          },
        },
      ]
    );
  };

  const renderDishItem = ({ item }: { item: Dish }) => (
    <View style={styles.dishItem}>
      <Image
        source={
          item.imageUrl
            ? { uri: item.imageUrl }
            : require("../../assets/images/salad.png")
        }
        style={styles.dishImage}
      />
      <View style={styles.dishInfo}>
        <Text style={styles.dishName} numberOfLines={1}>
          {item.name}
        </Text>
        <Text style={styles.dishCalories}>{item.calories} calo</Text>
        <View style={styles.dishMacros}>
          <Text style={[styles.macroText, styles.carb]}>
            {item.carbs}g Carb
          </Text>
          <Text style={[styles.macroText, styles.protein]}>
            {item.protein}g Protein
          </Text>
          <Text style={[styles.macroText, styles.fat]}>
            {item.fat}g Fat
          </Text>
        </View>
      </View>
      <Pressable
        style={styles.addButton}
        onPress={() => handleAddDish(item)}
      >
        <Entypo name="circle-with-plus" size={28} color={color.dark_green} />
      </Pressable>
    </View>
  );

  return (
    <Modal
      visible={visible}
      animationType="slide"
      transparent={true}
      onRequestClose={onClose}
    >
      <View style={styles.modalOverlay}>
        <View style={styles.modalContent}>
          {/* Header */}
          <View style={styles.modalHeader}>
            <Text style={styles.modalTitle}>Thêm món vào {mealType}</Text>
            <Pressable onPress={onClose} style={styles.closeButton}>
              <Entypo name="cross" size={24} color={color.black} />
            </Pressable>
          </View>

          {/* Search Bar */}
          <View style={styles.searchContainer}>
            <Entypo name="magnifying-glass" size={20} color={color.gray} />
            <TextInput
              style={styles.searchInput}
              placeholder="Tìm kiếm món ăn..."
              value={searchText}
              onChangeText={setSearchText}
            />
          </View>

          {/* Dish List */}
          {loading ? (
            <View style={styles.loadingContainer}>
              <ActivityIndicator size="large" color={color.dark_green} />
              <Text style={styles.loadingText}>Đang tải...</Text>
            </View>
          ) : filteredDishes.length === 0 ? (
            <View style={styles.emptyContainer}>
              <Text style={styles.emptyText}>Không tìm thấy món ăn</Text>
            </View>
          ) : (
            <FlatList
              data={filteredDishes}
              renderItem={renderDishItem}
              keyExtractor={(item) => item.id}
              showsVerticalScrollIndicator={false}
              contentContainerStyle={styles.listContent}
            />
          )}
        </View>
      </View>
    </Modal>
  );
};

const styles = StyleSheet.create({
  modalOverlay: {
    flex: 1,
    backgroundColor: "rgba(0, 0, 0, 0.5)",
    justifyContent: "flex-end",
  },
  modalContent: {
    backgroundColor: color.white,
    borderTopLeftRadius: 24,
    borderTopRightRadius: 24,
    height: "85%",
    paddingTop: 20,
  },
  modalHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingHorizontal: 20,
    paddingBottom: 16,
    borderBottomWidth: 1,
    borderBottomColor: "#E8E8E8",
  },
  modalTitle: {
    fontFamily: FONTS.bold,
    fontSize: 20,
    color: color.black,
  },
  closeButton: {
    padding: 4,
  },
  searchContainer: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#F5F5F5",
    borderRadius: 12,
    paddingHorizontal: 16,
    paddingVertical: 12,
    marginHorizontal: 20,
    marginTop: 16,
    marginBottom: 12,
  },
  searchInput: {
    flex: 1,
    marginLeft: 8,
    fontFamily: FONTS.regular,
    fontSize: 15,
    color: color.black,
  },
  listContent: {
    paddingHorizontal: 20,
    paddingBottom: 20,
  },
  dishItem: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: color.white,
    borderRadius: 12,
    padding: 12,
    marginTop: 12,
    borderWidth: 1,
    borderColor: "#E8E8E8",
    elevation: 2,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
  },
  dishImage: {
    width: 70,
    height: 70,
    borderRadius: 10,
    marginRight: 12,
  },
  dishInfo: {
    flex: 1,
  },
  dishName: {
    fontFamily: FONTS.semiBold,
    fontSize: 15,
    color: color.black,
    marginBottom: 4,
  },
  dishCalories: {
    fontFamily: FONTS.medium,
    fontSize: 13,
    color: color.calories,
    marginBottom: 6,
  },
  dishMacros: {
    flexDirection: "row",
    gap: 6,
  },
  macroText: {
    fontFamily: FONTS.medium,
    fontSize: 10,
    borderRadius: 8,
    paddingVertical: 4,
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
  addButton: {
    padding: 8,
  },
  loadingContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  loadingText: {
    fontFamily: FONTS.medium,
    fontSize: 14,
    color: color.gray,
    marginTop: 12,
  },
  emptyContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  emptyText: {
    fontFamily: FONTS.medium,
    fontSize: 15,
    color: color.gray,
  },
});