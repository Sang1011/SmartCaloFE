// EditMealModal.js

import { MealItem } from "@app/viewData";
import Color from "@constants/color";
import { FONTS } from "@constants/fonts";
import MaterialCommunityIcons from "@expo/vector-icons/MaterialCommunityIcons";
import { useState } from "react";
import {
    Modal,
    Pressable,
    ScrollView,
    StyleSheet,
    Text,
    TouchableWithoutFeedback,
    View,
} from "react-native";
import { scale } from "react-native-size-matters";
export interface EditMealModalProps {
    isVisible: boolean;
    onClose: () => void;
    items: MealItem[];
    onDelete: (idsToRemove: number[]) => void;
  }
const EditMealModal = ({ isVisible, onClose, items, onDelete }: EditMealModalProps) => {
  const [itemsToDelete, setItemsToDelete] = useState({});

  const toggleSelect = (id : number) => {
    setItemsToDelete((prev) => ({
      ...prev,
      [id]: !prev[id],
    }));
  };

  const handleConfirm = () => {
    const idsToRemove = Object.keys(itemsToDelete)
      .filter((id) => itemsToDelete[id])
      .map((id) => parseInt(id));

    onDelete(idsToRemove); // Truyền ID cần xóa lên component cha
    setItemsToDelete({});
    onClose();
  };

  const selectedCount = Object.keys(itemsToDelete).filter((id) => itemsToDelete[id]).length;

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
              <Text style={modalStyles.modalTitle}>Chỉnh sửa bữa ăn</Text>

              <ScrollView style={{ maxHeight: scale(250) }}>
                {items.length > 0 ? (
                  items.map((item) => {
                    const isSelected = itemsToDelete[item.id];
                    return (
                      <View key={item.id} style={modalStyles.itemRow}>
                        <View style={modalStyles.itemDetails}>
                          <Text style={modalStyles.itemName}>{item.name}</Text>
                          <Text style={modalStyles.itemQuantity}>
                            {item.quantity}
                          </Text>
                        </View>

                        <Pressable
                          style={modalStyles.checkboxButton}
                          onPress={() => toggleSelect(item.id)}
                        >
                          <MaterialCommunityIcons
                            name={
                              isSelected
                                ? "checkbox-marked-circle"
                                : "checkbox-blank-circle-outline"
                            }
                            size={24}
                            color={
                              isSelected ? Color.red_dark : Color.gray_light
                            }
                          />
                        </Pressable>
                      </View>
                    );
                  })
                ) : (
                  <Text style={modalStyles.emptyText}>
                    Bữa ăn chưa có món nào.
                  </Text>
                )}
              </ScrollView>

              <Pressable
                style={[modalStyles.confirmButton, selectedCount === 0 && modalStyles.confirmButtonDisabled]}
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
  itemRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingVertical: scale(10),
    borderBottomWidth: 1,
    borderBottomColor: Color.light_gray,
  },
  itemDetails: {
    flex: 1,
    flexDirection: "column",
  },
  itemName: {
    fontSize: scale(15),
    fontFamily: FONTS.semiBold,
    color: Color.black,
  },
  itemQuantity: {
    fontSize: scale(12),
    fontFamily: FONTS.regular,
    color: Color.gray,
  },
  checkboxButton: {
    padding: scale(5),
    marginLeft: scale(10),
  },
  confirmButton: {
    backgroundColor: Color.dark_green,
    padding: scale(12),
    borderRadius: 10,
    marginTop: scale(20),
  },
  confirmButtonDisabled: {
    backgroundColor: Color.gray, // Mờ đi khi không có gì được chọn
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

export default EditMealModal;