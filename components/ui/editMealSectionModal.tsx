// EditMealsModal.js

import Color from "@constants/color";
import { FONTS } from "@constants/fonts";
import Entypo from "@expo/vector-icons/Entypo";
import MaterialCommunityIcons from "@expo/vector-icons/MaterialCommunityIcons";
import { useMemo, useState } from "react";
import {
  LayoutAnimation, // Dùng cho hiệu ứng mở/đóng item
  Modal,
  Platform,
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  TouchableWithoutFeedback,
  UIManager,
  View,
} from "react-native";
import { scale } from "react-native-size-matters";

// Bật LayoutAnimation cho Android
if (
  Platform.OS === "android" &&
  UIManager.setLayoutAnimationEnabledExperimental
) {
  UIManager.setLayoutAnimationEnabledExperimental(true);
}

// Định nghĩa Props
interface MealItem {
  id: string;
  name: string;
  calories: number;
}
interface MealSection {
  id: string;
  name: string;
  totalCalories: number;
  items: MealItem[];
}
interface EditMealsModalProps {
  isVisible: boolean;
  onClose: () => void;
  mealSections: MealSection[];
  // onSave nhận về các sections còn lại sau khi đã xóa/chỉnh sửa
  onSave: (sectionsToKeep: MealSection[]) => void;
}

const EditMealsModal: React.FC<EditMealsModalProps> = ({
  isVisible,
  onClose,
  mealSections,
  onSave,
}) => {
  // State lưu trữ trạng thái chọn xóa của TỪNG món ăn/bữa ăn
  // Key là ID của item hoặc section, value là boolean (được chọn để xóa)
  const [selectedToDelete, setSelectedToDelete] = useState<
    Record<string, boolean>
  >({});
  const [expandedSection, setExpandedSection] = useState<string | null>(null);

  // Tính toán số lượng đã chọn để xóa
  const selectedCount = useMemo(() => {
    return Object.values(selectedToDelete).filter(Boolean).length;
  }, [selectedToDelete]);

  // Hàm đồng bộ trạng thái khi chọn một Item hoặc Section
  const toggleSelect = (
    id: string,
    isSection: boolean,
    itemIds: string[] = []
  ) => {
    // Bắt đầu animation
    LayoutAnimation.easeInEaseOut();

    setSelectedToDelete((prev) => {
      const newState = { ...prev };
      const isCurrentlySelected = !!prev[id];

      if (isSection) {
        // 1. Nếu là Section, đảo ngược trạng thái của Section đó
        newState[id] = !isCurrentlySelected;

        // 2. Đồng bộ trạng thái của tất cả Items trong Section đó
        itemIds.forEach((itemId) => {
          newState[itemId] = !isCurrentlySelected;
        });
      } else {
        // 1. Nếu là Item, chỉ đảo ngược trạng thái của Item đó
        newState[id] = !isCurrentlySelected;

        // 2. Cần kiểm tra lại trạng thái của Section cha (Nếu tất cả items đều được chọn/bỏ chọn)
        const sectionId = mealSections.find((s) =>
          s.items.some((i) => i.id === id)
        )?.id;
        if (sectionId) {
          const allItemsInCurrentState =
            mealSections
              .find((s) => s.id === sectionId)
              ?.items.map((i) => i.id) || [];

          const allItemsSelected = allItemsInCurrentState.every(
            (itemId) => !!newState[itemId]
          );
          const allItemsDeselected = allItemsInCurrentState.every(
            (itemId) => !newState[itemId]
          );

          if (allItemsSelected || allItemsDeselected) {
            // Nếu tất cả item cùng trạng thái, đồng bộ Section
            newState[sectionId] = allItemsSelected;
          } else {
            // Nếu item không đồng nhất, đảm bảo Section không được chọn
            newState[sectionId] = false;
          }
        }
      }
      return newState;
    });
  };

  // Hàm thực hiện xóa và trả về dữ liệu mới
  const handleConfirm = () => {
    const sectionsToKeep: MealSection[] = mealSections
      .map((section) => {
        // Nếu toàn bộ section được chọn để xóa, bỏ qua section này
        if (selectedToDelete[section.id]) {
          return { ...section, items: [] }; // Giữ lại section với items rỗng
        }

        // Lọc ra các món ăn không được chọn để xóa
        const itemsToKeep = section.items.filter(
          (item) => !selectedToDelete[item.id]
        );

        return {
          ...section,
          items: itemsToKeep,
        };
      })
      .filter((section) => section.items.length > 0); // Lọc bỏ các section đã rỗng

    onSave(sectionsToKeep);
    setSelectedToDelete({}); // Reset state
    onClose();
  };

  // Toggle mở/đóng phần tử Accordion
  const toggleExpand = (sectionId: string) => {
    LayoutAnimation.easeInEaseOut();
    setExpandedSection((prev) => (prev === sectionId ? null : sectionId));
  };

  const renderCheckbox = (id: string, color: string) => {
    const isSelected = !!selectedToDelete[id];
    return (
      <Pressable
        style={modalStyles.checkboxButton}
        onPress={() => toggleSelect(id, false)}
      >
        <MaterialCommunityIcons
          name={
            isSelected
              ? "checkbox-marked-circle"
              : "checkbox-blank-circle-outline"
          }
          size={24}
          color={isSelected ? color : Color.gray}
        />
      </Pressable>
    );
  };

  return (
    <Modal
      visible={isVisible}
      transparent
      animationType="fade"
      onRequestClose={onClose}
    >
      <TouchableWithoutFeedback onPress={onClose}>
        <View style={modalStyles.overlay}>
          <TouchableWithoutFeedback>
            <View style={modalStyles.modalContainer}>
              <Text style={modalStyles.modalTitle}>Chỉnh sửa Bữa Ăn</Text>

              <ScrollView style={modalStyles.scrollView}>
                {mealSections.length > 0 ? (
                  mealSections.map((section) => {
                    const isSectionSelected = !!selectedToDelete[section.id];
                    const isExpanded = expandedSection === section.id;
                    const sectionIcon = isExpanded
                      ? "chevron-up"
                      : "chevron-down";

                    return (
                      <View key={section.id} style={modalStyles.sectionCard}>
                        {/* Header Bữa Ăn (Section) */}
                        <View style={modalStyles.sectionHeader}>
                          <Pressable
                            style={modalStyles.sectionCheckbox}
                            onPress={() =>
                              toggleSelect(
                                section.id,
                                true,
                                section.items.map((i) => i.id)
                              )
                            }
                          >
                            <MaterialCommunityIcons
                              name={
                                isSectionSelected
                                  ? "checkbox-marked-circle"
                                  : "checkbox-blank-circle-outline"
                              }
                              size={24}
                              color={
                                isSectionSelected ? Color.dark_green : Color.gray
                              }
                            />
                          </Pressable>

                          <View style={modalStyles.sectionDetails}>
                            <Text style={modalStyles.sectionName}>
                              {section.name}
                            </Text>
                            <Text style={modalStyles.sectionCalories}>
                              {section.totalCalories} Cal
                            </Text>
                          </View>

                          <Pressable
                            style={modalStyles.expandButton}
                            onPress={() => toggleExpand(section.id)}
                          >
                            <Entypo
                              name="chevron-down"
                              size={24}
                              color={Color.gray}
                            />
                          </Pressable>
                        </View>

                        {/* Body Items (Accordion Content) */}
                        {isExpanded && (
                          <View style={modalStyles.itemsContainer}>
                            {section.items.map((item, index) => (
                              <View
                                key={item.id}
                                style={[
                                  modalStyles.itemRow,
                                  index < section.items.length - 1 &&
                                    modalStyles.itemSeparator,
                                ]}
                              >
                                <View style={modalStyles.itemDetails}>
                                  <Text style={modalStyles.itemName}>
                                    {item.name}
                                  </Text>
                                  <Text style={modalStyles.itemCalories}>
                                    {item.calories} Cal
                                  </Text>
                                </View>
                                {renderCheckbox(item.id, Color.dark_green)}
                              </View>
                            ))}
                          </View>
                        )}
                      </View>
                    );
                  })
                ) : (
                  <Text style={modalStyles.emptyText}>
                    Không có bữa ăn nào để chỉnh sửa.
                  </Text>
                )}
              </ScrollView>

              <Pressable
                style={[
                  modalStyles.confirmButton,
                  selectedCount === 0 && modalStyles.confirmButtonDisabled,
                ]}
                onPress={handleConfirm}
                disabled={selectedCount === 0}
              >
                <Text style={modalStyles.confirmButtonText}>
                  Xác nhận xóa ({selectedCount})
                </Text>
              </Pressable>
            </View>
          </TouchableWithoutFeedback>
        </View>
      </TouchableWithoutFeedback>
    </Modal>
  );
};

// =================================================================
// Styles cho Modal
// =================================================================
const modalStyles = StyleSheet.create({
  overlay: {
    flex: 1,
    backgroundColor: Color.black_50,
    justifyContent: "center",
    alignItems: "center",
  },
  modalContainer: {
    width: "90%",
    backgroundColor: Color.white,
    borderRadius: 16,
    padding: scale(20),
  },
  modalTitle: {
    fontSize: scale(18),
    fontFamily: FONTS.bold,
    color: Color.dark_green,
    marginBottom: scale(15),
    textAlign: "center",
  },
  scrollView: {
    maxHeight: scale(400),
  },
  sectionCard: {
    marginBottom: scale(10),
    borderWidth: 1,
    borderColor: Color.light_gray,
    borderRadius: 8,
    overflow: "hidden", // Quan trọng cho LayoutAnimation
  },
  sectionHeader: {
    flexDirection: "row",
    alignItems: "center",
    paddingVertical: scale(12),
    paddingHorizontal: scale(5),
    backgroundColor: Color.gray_light, // Nền nhẹ cho header section
  },
  sectionCheckbox: {
    paddingHorizontal: scale(10),
  },
  sectionDetails: {
    flex: 1,
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingRight: scale(10),
  },
  sectionName: {
    fontSize: scale(15),
    fontFamily: FONTS.semiBold,
    color: Color.black,
  },
  sectionCalories: {
    fontSize: scale(14),
    fontFamily: FONTS.regular,
    color: Color.gray,
  },
  expandButton: {
    paddingHorizontal: scale(10),
  },

  // Items (Nội dung Accordion)
  itemsContainer: {
    backgroundColor: Color.white,
    paddingHorizontal: scale(10),
  },
  itemRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingVertical: scale(10),
  },
  itemSeparator: {
    borderBottomWidth: 1,
    borderBottomColor: Color.light_gray,
  },
  itemDetails: {
    flex: 1,
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  itemName: {
    width: "80%",
    fontSize: scale(12),
    fontFamily: FONTS.regular,
    color: Color.black,
  },
  itemCalories: {
    fontSize: scale(13),
    fontFamily: FONTS.regular,
    color: Color.gray,
  },
  checkboxButton: {
    padding: scale(5),
    marginLeft: scale(10),
  },

  // Footer/Button
  confirmButton: {
    backgroundColor: Color.dark_green,
    padding: scale(12),
    borderRadius: 10,
    marginTop: scale(20),
  },
  confirmButtonDisabled: {
    backgroundColor: Color.gray,
  },
  confirmButtonText: {
    color: Color.white,
    fontSize: scale(16),
    fontFamily: FONTS.semiBold,
    textAlign: "center",
  },
  emptyText: {
    fontSize: scale(14),
    fontFamily: FONTS.regular,
    color: Color.gray,
    textAlign: "center",
    paddingVertical: scale(20),
  },
});

export default EditMealsModal;
