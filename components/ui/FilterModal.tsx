import color from "@constants/color";
import { FONTS } from "@constants/fonts";
import { Ionicons } from "@expo/vector-icons";
import { allTimeFilters, allTypes, TimeFilter, TypeFilter, UseFilterStateType } from "@hooks/useFilterState";
import React from "react";
import {
    ActivityIndicator,
    Modal,
    ScrollView,
    StyleSheet,
    Text,
    TextInput,
    TouchableOpacity,
    View,
} from "react-native";

// Prop type cho FilterModal
interface FilterModalProps {
  isVisible: boolean;
  onClose: () => void;
  onApplyFilter: () => void;
  onClearAllAndApply: () => void;
  filterState: UseFilterStateType;
}

// === Các Component phụ trợ cho Modal (Được giữ lại hoặc đưa vào file này) ===

const FilterSection: React.FC<{
  title: string;
  children: React.ReactNode;
  onClear?: () => void;
  isClearVisible?: boolean;
}> = ({ title, children, onClear, isClearVisible = false }) => (
  <View style={modalStyles.sectionContainer}>
    <View style={modalStyles.sectionHeader}>
      <Text style={[modalStyles.sectionTitle, { fontFamily: FONTS.bold }]}>
        {title}
      </Text>
      {isClearVisible && onClear && (
        <TouchableOpacity onPress={onClear}>
          <Text style={modalStyles.clearFilterText}>Xóa lọc</Text>
        </TouchableOpacity>
      )}
    </View>
    <View style={modalStyles.sectionContent}>{children}</View>
  </View>
);

const CheckBox: React.FC<{
  label: string;
  isChecked: boolean;
  onPress: () => void;
}> = ({ label, isChecked, onPress }) => (
  <TouchableOpacity style={modalStyles.checkboxContainer} onPress={onPress}>
    <Ionicons
      name={isChecked ? "checkbox-outline" : "square-outline"}
      size={20}
      color={isChecked ? color.dark_green : color.gray_dark}
    />
    <Text style={modalStyles.checkboxLabel}>{label}</Text>
  </TouchableOpacity>
);

const RadioBox: React.FC<{
  label: string;
  isSelected: boolean;
  onPress: () => void;
}> = ({ label, isSelected, onPress }) => (
  <TouchableOpacity style={modalStyles.radioContainer} onPress={onPress}>
    <Ionicons
      name={isSelected ? "radio-button-on" : "radio-button-off"}
      size={20}
      color={isSelected ? color.dark_green : color.gray_dark}
    />
    <Text style={modalStyles.radioLabel}>{label}</Text>
  </TouchableOpacity>
);

// === Component Filter Modal Chính ===

export const FilterModal: React.FC<FilterModalProps> = ({
  isVisible,
  onClose,
  onApplyFilter,
  onClearAllAndApply,
  filterState,
}) => {
  const {
    includedIngredients,
    excludedIngredients,
    selectedTimeFilter,
    selectedTypeFilter,
    setSelectedTimeFilter,
    setSelectedTypeFilter,
    toggleIngredient,
    uniqueIngredients,
    searchIncludedText,
    setSearchIncludedText,
    searchExcludedText,
    setSearchExcludedText,
    showAllIngredients,
    isExpandingIngredientsIncluded,
    isExpandingIngredientsExcluded,
    getFilteredIngredients,
    handleToggleShowAllIngredients,
  } = filterState;

  // Nguyên liệu hiển thị cho từng mục
  const includedDisplayList = getFilteredIngredients(searchIncludedText);
  const excludedDisplayList = getFilteredIngredients(searchExcludedText);

  return (
    <Modal
      visible={isVisible}
      transparent
      animationType="fade"
      onRequestClose={onClose}
    >
      <View style={modalStyles.modalOverlay}>
        <View style={modalStyles.modalContainer}>
          <Text
            style={[modalStyles.modalTitle, { fontFamily: FONTS.semiBold }]}
          >
            Bộ lọc nâng cao
          </Text>
          <ScrollView showsVerticalScrollIndicator={false}>
            {/* 1. Phần Nguyên liệu Bao gồm */}
            <FilterSection title="Bao gồm nguyên liệu (Included)">
              <TextInput
                style={modalStyles.ingredientSearchInput}
                placeholder="Tìm kiếm nguyên liệu..."
                placeholderTextColor={color.gray_dark}
                value={searchIncludedText}
                onChangeText={setSearchIncludedText}
              />
              <View style={modalStyles.optionsContainer}>
                {isExpandingIngredientsIncluded &&
                searchIncludedText.length === 0 ? (
                  <ActivityIndicator
                    size="small"
                    color={color.dark_green}
                    style={{ marginVertical: 10 }}
                  />
                ) : (
                  includedDisplayList.map((ing) => (
                    <CheckBox
                      key={`inc-${ing}`}
                      label={ing}
                      isChecked={includedIngredients.includes(ing)}
                      onPress={() => toggleIngredient(ing, "included")}
                    />
                  ))
                )}
              </View>
              {/* Nút Xem tất cả/Thu gọn */}
              {uniqueIngredients.length > 5 &&
                searchIncludedText.length === 0 && (
                  <TouchableOpacity
                    style={modalStyles.showAllButton}
                    onPress={() => handleToggleShowAllIngredients("included")}
                    disabled={isExpandingIngredientsIncluded}
                  >
                    <Text style={modalStyles.showAllText}>
                      {isExpandingIngredientsIncluded
                        ? "Đang tải..."
                        : showAllIngredients
                        ? "Thu gọn"
                        : "Xem tất cả"}
                    </Text>
                  </TouchableOpacity>
                )}
            </FilterSection>

            {/* 2. Phần Loại trừ Nguyên liệu */}
            <FilterSection title="Loại trừ nguyên liệu (Excluded)">
              <TextInput
                style={modalStyles.ingredientSearchInput}
                placeholder="Tìm kiếm nguyên liệu..."
                placeholderTextColor={color.gray_dark}
                value={searchExcludedText}
                onChangeText={setSearchExcludedText}
              />
              <View style={modalStyles.optionsContainer}>
                {isExpandingIngredientsExcluded &&
                searchExcludedText.length === 0 ? (
                  <ActivityIndicator
                    size="small"
                    color={color.dark_green}
                    style={{ marginVertical: 10 }}
                  />
                ) : (
                  excludedDisplayList.map((ing) => (
                    <CheckBox
                      key={`exc-${ing}`}
                      label={ing}
                      isChecked={excludedIngredients.includes(ing)}
                      onPress={() => toggleIngredient(ing, "excluded")}
                    />
                  ))
                )}
              </View>
              {/* Nút Xem tất cả/Thu gọn */}
              {uniqueIngredients.length > 5 &&
                searchExcludedText.length === 0 && (
                  <TouchableOpacity
                    style={modalStyles.showAllButton}
                    onPress={() => handleToggleShowAllIngredients("excluded")}
                    disabled={isExpandingIngredientsExcluded}
                  >
                    <Text style={modalStyles.showAllText}>
                      {isExpandingIngredientsExcluded
                        ? "Đang tải..."
                        : showAllIngredients
                        ? "Thu gọn"
                        : "Xem tất cả"}
                    </Text>
                  </TouchableOpacity>
                )}
            </FilterSection>

            {/* 3. Phần Lọc theo Thời gian */}
            <FilterSection
              title="Thời gian nấu (Cooking Time)"
              onClear={() => {
                setSelectedTimeFilter(null);
                onApplyFilter(); // Áp dụng ngay sau khi xóa lọc cá nhân
              }}
              isClearVisible={!!selectedTimeFilter}
            >
              {allTimeFilters.map((time) => (
                <RadioBox
                  key={time}
                  label={time}
                  isSelected={selectedTimeFilter === time}
                  onPress={() => setSelectedTimeFilter(time as TimeFilter)}
                />
              ))}
            </FilterSection>

            {/* 4. Phần Lọc theo Loại (Type) */}
            <FilterSection
              title="Loại món ăn (Type)"
              onClear={() => {
                setSelectedTypeFilter(null);
                onApplyFilter(); // Áp dụng ngay sau khi xóa lọc cá nhân
              }}
              isClearVisible={!!selectedTypeFilter}
            >
              {allTypes.map((type) => (
                <RadioBox
                  key={type}
                  label={type}
                  isSelected={selectedTypeFilter === type}
                  onPress={() => setSelectedTypeFilter(type as TypeFilter)}
                />
              ))}
            </FilterSection>
          </ScrollView>

          {/* Nút Hành động */}
          <View style={modalStyles.buttonGroup}>
            {/* Nút Xóa tất cả (Clear All) */}
            <TouchableOpacity
              style={[modalStyles.actionButton, modalStyles.clearAllButton]}
              onPress={onClearAllAndApply}
            >
              <Text style={modalStyles.clearAllButtonText}>Xóa tất cả</Text>
            </TouchableOpacity>

            {/* Nút Quay lại (Cancel/Close) */}
            <TouchableOpacity
              style={[modalStyles.actionButton, modalStyles.backButton]}
              onPress={onClose}
            >
              <Text style={modalStyles.buttonText}>Đóng</Text>
            </TouchableOpacity>

            {/* Nút Tìm kiếm (Apply) */}
            <TouchableOpacity
              style={[modalStyles.actionButton, modalStyles.searchButton]}
              onPress={onApplyFilter}
            >
              <Text style={modalStyles.buttonText}>Tìm kiếm</Text>
            </TouchableOpacity>
          </View>
        </View>
      </View>
    </Modal>
  );
};

// === Styles cho Modal ===
const modalStyles = StyleSheet.create({
  // ... (Giữ nguyên hoặc cập nhật styles từ code gốc của bạn)
  sectionContainer: {
    marginBottom: 15,
    paddingBottom: 10,
    borderBottomWidth: 1,
    borderBottomColor: color.light_gray,
  },
  sectionHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  sectionContent: {},
  sectionTitle: {
    fontSize: 15,
    color: color.black,
  },
  clearFilterText: {
    fontSize: 13,
    color: color.gray_dark,
    fontFamily: FONTS.medium,
    textDecorationLine: "underline",
  },
  ingredientSearchInput: {
    backgroundColor: color.background,
    borderRadius: 8,
    paddingHorizontal: 10,
    paddingVertical: 8,
    fontSize: 14,
    color: color.black,
    marginBottom: 10,
  },
  optionsContainer: {
    flexDirection: "row",
    flexWrap: "wrap",
    justifyContent: "space-between",
  },
  checkboxContainer: {
    flexDirection: "row",
    alignItems: "center",
    width: "48%",
    marginBottom: 8,
  },
  radioContainer: {
    flexDirection: "row",
    alignItems: "center",
    width: "48%",
    marginBottom: 8,
  },
  checkboxLabel: {
    marginLeft: 6,
    fontSize: 13,
    color: color.black,
  },
  radioLabel: {
    marginLeft: 6,
    fontSize: 13,
    color: color.black,
  },
  showAllButton: {
    marginTop: 5,
    alignSelf: "flex-start",
  },
  showAllText: {
    fontSize: 12,
    color: color.gray_dark,
    fontFamily: FONTS.medium,
  },
  // Modal general styles
  modalOverlay: {
    flex: 1,
    backgroundColor: "rgba(0,0,0,0.7)",
    justifyContent: "center",
    alignItems: "center",
  },
  modalContainer: {
    backgroundColor: color.white,
    borderRadius: 12,
    padding: 20,
    width: "90%",
    maxHeight: "80%",
  },
  modalTitle: {
    fontSize: 18,
    color: color.dark_green,
    marginBottom: 15,
    textAlign: "center",
  },
  // Button Group Styles
  buttonGroup: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginTop: 20,
    paddingTop: 10,
  },
  actionButton: {
    paddingVertical: 10,
    borderRadius: 8,
    alignItems: "center",
    width: "30%",
  },
  clearAllButton: {
    backgroundColor: color.red,
  },
  backButton: {
    backgroundColor: color.gray_dark,
  },
  searchButton: {
    backgroundColor: color.dark_green,
  },
  buttonText: {
    color: color.white,
    fontFamily: FONTS.semiBold,
    fontSize: 13,
  },
  clearAllButtonText: {
    color: color.white,
    fontFamily: FONTS.semiBold,
    fontSize: 13,
  },
});
