import { FilterModal } from "@components/ui/FilterModal";
import color from "@constants/color";
import { FONTS } from "@constants/fonts";
import { Ionicons } from "@expo/vector-icons";
import Entypo from "@expo/vector-icons/Entypo";
import {
  TimeFilter,
  TypeFilter,
  UseFilterStateType,
} from "@hooks/useFilterState";
import React, { useEffect, useMemo, useState } from "react";
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
  TouchableOpacity,
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
  existingDishIds?: string[];
  filterState: UseFilterStateType;
}

export const AddDishModal: React.FC<AddDishModalProps> = ({
  visible,
  onClose,
  dishes,
  loading,
  onAddDish,
  mealType,
  existingDishIds = [],
  filterState,
}) => {
  const [searchText, setSearchText] = useState("");
  const [isFilterModalVisible, setIsFilterModalVisible] = useState(false);

  const {
    includedIngredients,
    excludedIngredients,
    selectedTimeFilter,
    selectedTypeFilter,
    handleResetFilter,
  } = filterState;

  // Reset search khi đóng modal
  useEffect(() => {
    if (!visible) {
      setSearchText("");
    }
  }, [visible]);

  // Hàm kiểm tra thời gian nấu
  const matchesTimeFilter = (
    cookingTime: number,
    filter: TimeFilter
  ): boolean => {
    switch (filter) {
      case "<= 20 phút":
        return cookingTime <= 20;
      case "<= 60 phút":
        return cookingTime <= 60;
      case "<= 120 phút":
        return cookingTime <= 120;
      case "> 120 phút":
        return cookingTime > 120;
      default:
        return true;
    }
  };

  // Hàm kiểm tra loại món ăn
  const matchesTypeFilter = (dishType: string, filter: TypeFilter): boolean => {
    return dishType === filter;
  };

  // Lọc món ăn theo tất cả các tiêu chí
  const filteredDishes = useMemo(() => {
    let result = dishes;

    // Lọc theo tìm kiếm
    if (searchText.trim() !== "") {
      result = result.filter((dish) =>
        dish.name.toLowerCase().includes(searchText.toLowerCase())
      );
    }

    // Lọc theo nguyên liệu bao gồm
    if (includedIngredients.length > 0) {
      result = result.filter((dish) => {
        const dishIngredients = dish.ingredients
          ? dish.ingredients.split(",").map((s) => s.trim())
          : [];
        return includedIngredients.every((included) =>
          dishIngredients.includes(included)
        );
      });
    }

    // Lọc theo nguyên liệu loại trừ
    if (excludedIngredients.length > 0) {
      result = result.filter((dish) => {
        const dishIngredients = dish.ingredients
          ? dish.ingredients.split(",").map((s) => s.trim())
          : [];
        return !excludedIngredients.some((excluded) =>
          dishIngredients.includes(excluded)
        );
      });
    }

    // Lọc theo thời gian nấu
    if (selectedTimeFilter) {
      result = result.filter((dish) =>
        matchesTimeFilter(dish.cookingTime || 0, selectedTimeFilter)
      );
    }

    // Lọc theo loại món ăn
    if (selectedTypeFilter) {
      result = result.filter((dish) =>
        matchesTypeFilter(dish.category || "", selectedTypeFilter)
      );
    }

    return result;
  }, [
    dishes,
    searchText,
    includedIngredients,
    excludedIngredients,
    selectedTimeFilter,
    selectedTypeFilter,
  ]);

  // Kiểm tra có filter nào đang active không
  const hasActiveFilters = useMemo(() => {
    return (
      includedIngredients.length > 0 ||
      excludedIngredients.length > 0 ||
      selectedTimeFilter !== null ||
      selectedTypeFilter !== null
    );
  }, [
    includedIngredients,
    excludedIngredients,
    selectedTimeFilter,
    selectedTypeFilter,
  ]);

  const handleAddDish = (dish: Dish) => {
    // Kiểm tra món đã tồn tại chưa
    if (existingDishIds.includes(dish.id)) {
      Alert.alert(
        "Món đã tồn tại",
        `"${dish.name}" đã có trong ${mealType} rồi!`,
        [{ text: "OK" }]
      );
      return;
    }

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

  const handleClearFilters = () => {
    handleResetFilter();
  };

  const renderDishItem = ({ item }: { item: Dish }) => {
    const isAlreadyAdded = existingDishIds.includes(item.id);

    return (
      <View
        style={[styles.dishItem, isAlreadyAdded && styles.dishItemDisabled]}
      >
        <Image
          source={
            item.imageUrl
              ? { uri: item.imageUrl }
              : require("../../assets/images/salad.png")
          }
          style={[styles.dishImage, isAlreadyAdded && styles.dishImageDisabled]}
        />
        <View style={styles.dishInfo}>
          <Text style={styles.dishName} numberOfLines={1}>
            {item.name}
          </Text>
          {isAlreadyAdded && <Text style={styles.addedLabel}>✓ Đã thêm</Text>}
          <Text style={styles.dishCalories}>{item.calories} calo</Text>
          <View style={styles.dishMacros}>
            <Text style={[styles.macroText, styles.carb]}>
              {item.carbs}g Carb
            </Text>
            <Text style={[styles.macroText, styles.protein]}>
              {item.protein}g Protein
            </Text>
            <Text style={[styles.macroText, styles.fat]}>{item.fat}g Fat</Text>
          </View>
        </View>
        <Pressable
          style={[styles.addButton, isAlreadyAdded && styles.addButtonDisabled]}
          onPress={() => handleAddDish(item)}
          disabled={isAlreadyAdded}
        >
          <Entypo
            name={isAlreadyAdded ? "check" : "circle-with-plus"}
            size={28}
            color={isAlreadyAdded ? color.gray : color.dark_green}
          />
        </Pressable>
      </View>
    );
  };

  return (
    <>
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

            {/* Search Bar & Filter Button */}
            <View style={styles.searchRow}>
              <View style={styles.searchContainer}>
                <Entypo name="magnifying-glass" size={20} color={color.gray} />
                <TextInput
                  style={styles.searchInput}
                  placeholder="Tìm kiếm món ăn..."
                  placeholderTextColor={color.gray}
                  value={searchText}
                  onChangeText={setSearchText}
                />
              </View>
              <TouchableOpacity
                style={[
                  styles.filterButton,
                  hasActiveFilters && styles.filterButtonActive,
                ]}
                onPress={() => setIsFilterModalVisible(true)}
              >
                <Ionicons
                  name="filter"
                  size={20}
                  color={hasActiveFilters ? color.white : color.dark_green}
                />
                {hasActiveFilters && <View style={styles.filterBadge} />}
              </TouchableOpacity>
            </View>

            {/* Active Filters Display */}
            {hasActiveFilters && (
              <View style={styles.activeFiltersContainer}>
                <Text style={styles.activeFiltersTitle}>
                  Bộ lọc đang áp dụng:
                </Text>
                <View style={styles.filterChips}>
                  {includedIngredients.map((ing) => (
                    <View key={`inc-${ing}`} style={styles.filterChip}>
                      <Text style={styles.filterChipText}>+{ing}</Text>
                    </View>
                  ))}
                  {excludedIngredients.map((ing) => (
                    <View
                      key={`exc-${ing}`}
                      style={[styles.filterChip, styles.filterChipExclude]}
                    >
                      <Text style={styles.filterChipText}>-{ing}</Text>
                    </View>
                  ))}
                  {selectedTimeFilter && (
                    <View style={styles.filterChip}>
                      <Text style={styles.filterChipText}>
                        {selectedTimeFilter}
                      </Text>
                    </View>
                  )}
                  {selectedTypeFilter && (
                    <View style={styles.filterChip}>
                      <Text style={styles.filterChipText}>
                        {selectedTypeFilter}
                      </Text>
                    </View>
                  )}
                </View>
                <TouchableOpacity onPress={handleClearFilters}>
                  <Text style={styles.clearFiltersText}>Xóa tất cả bộ lọc</Text>
                </TouchableOpacity>
              </View>
            )}

            {/* Dish List */}
            {loading ? (
              <View style={styles.loadingContainer}>
                <ActivityIndicator size="large" color={color.dark_green} />
                <Text style={styles.loadingText}>Đang tải...</Text>
              </View>
            ) : filteredDishes.length === 0 ? (
              <View style={styles.emptyContainer}>
                <Ionicons name="search-outline" size={48} color={color.gray} />
                <Text style={styles.emptyText}>
                  {hasActiveFilters
                    ? "Không tìm thấy món ăn phù hợp với bộ lọc"
                    : "Không tìm thấy món ăn"}
                </Text>
                {hasActiveFilters && (
                  <TouchableOpacity
                    onPress={handleClearFilters}
                    style={styles.clearButton}
                  >
                    <Text style={styles.clearButtonText}>Xóa bộ lọc</Text>
                  </TouchableOpacity>
                )}
              </View>
            ) : (
              <>
                <Text style={styles.resultCount}>
                  Tìm thấy {filteredDishes.length} món ăn
                </Text>
                <FlatList
                  data={filteredDishes}
                  renderItem={renderDishItem}
                  keyExtractor={(item) => item.id}
                  showsVerticalScrollIndicator={false}
                  contentContainerStyle={styles.listContent}
                />
              </>
            )}
          </View>
        </View>
      </Modal>

      {/* FilterModal - Đặt bên ngoài Modal chính */}
      <FilterModal
        isVisible={isFilterModalVisible}
        onClose={() => setIsFilterModalVisible(false)}
        onApplyFilter={() => {
          setIsFilterModalVisible(false);
        }}
        onClearAllAndApply={() => {
          handleResetFilter();
          setIsFilterModalVisible(false);
        }}
        filterState={filterState}
      />
    </>
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
  searchRow: {
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: 20,
    marginTop: 16,
    marginBottom: 12,
    gap: 12,
  },
  searchContainer: {
    flex: 1,
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#F5F5F5",
    borderRadius: 12,
    paddingHorizontal: 16,
    paddingVertical: 12,
  },
  searchInput: {
    flex: 1,
    marginLeft: 8,
    fontFamily: FONTS.regular,
    fontSize: 15,
    color: color.black,
  },
  filterButton: {
    width: 48,
    height: 48,
    borderRadius: 12,
    backgroundColor: "#F5F5F5",
    justifyContent: "center",
    alignItems: "center",
    borderWidth: 1,
    borderColor: color.dark_green,
  },
  filterButtonActive: {
    backgroundColor: color.dark_green,
  },
  filterBadge: {
    position: "absolute",
    top: 8,
    right: 8,
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: color.red,
  },
  activeFiltersContainer: {
    paddingHorizontal: 20,
    paddingVertical: 12,
    backgroundColor: "#F9F9F9",
    borderBottomWidth: 1,
    borderBottomColor: "#E8E8E8",
  },
  activeFiltersTitle: {
    fontFamily: FONTS.medium,
    fontSize: 13,
    color: color.gray_dark,
    marginBottom: 8,
  },
  filterChips: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: 8,
    marginBottom: 8,
  },
  filterChip: {
    backgroundColor: color.dark_green,
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 16,
  },
  filterChipExclude: {
    backgroundColor: color.red,
  },
  filterChipText: {
    fontFamily: FONTS.medium,
    fontSize: 12,
    color: color.white,
  },
  clearFiltersText: {
    fontFamily: FONTS.medium,
    fontSize: 12,
    color: color.dark_green,
    textDecorationLine: "underline",
  },
  resultCount: {
    paddingHorizontal: 20,
    paddingVertical: 8,
    fontFamily: FONTS.medium,
    fontSize: 13,
    color: color.gray_dark,
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
  dishItemDisabled: {
    opacity: 0.6,
    backgroundColor: "#F9F9F9",
  },
  dishImage: {
    width: 70,
    height: 70,
    borderRadius: 10,
    marginRight: 12,
  },
  dishImageDisabled: {
    opacity: 0.5,
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
  addedLabel: {
    fontFamily: FONTS.medium,
    fontSize: 11,
    color: color.dark_green,
    marginBottom: 2,
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
  addButtonDisabled: {
    opacity: 0.5,
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
    paddingHorizontal: 40,
  },
  emptyText: {
    fontFamily: FONTS.medium,
    fontSize: 15,
    color: color.gray,
    textAlign: "center",
    marginTop: 12,
    marginBottom: 16,
  },
  clearButton: {
    backgroundColor: color.dark_green,
    paddingHorizontal: 20,
    paddingVertical: 10,
    borderRadius: 8,
  },
  clearButtonText: {
    fontFamily: FONTS.semiBold,
    fontSize: 14,
    color: color.white,
  },
});