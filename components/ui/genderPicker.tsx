import color from "@constants/color";
import React, { useState } from "react";
import { Modal, Pressable, StyleSheet, Text, View } from "react-native";
import { Gender } from "../../types/me";

interface GenderPickerProps {
  value: Gender;
  onSelect: (gender: Gender) => void;
  disabled?: boolean;
  isEditing?: boolean;
}

const GenderPicker: React.FC<GenderPickerProps> = ({
    value,
    onSelect,
    disabled,
    isEditing,
  }) => {
    const [isVisible, setIsVisible] = useState(false);
  
    const handleSelect = (gender: Gender) => {
      onSelect(gender);
      setIsVisible(false);
    };
  
    const displayValue =
      value === Gender.Male ? "Nam" : value === Gender.Female ? "Nữ" : "Chưa chọn";
  
    return (
      <>
        <Pressable
          style={[
            styles.dropdown,
            isEditing && styles.dropdownEditing,
            disabled && styles.dropdownDisabled,
          ]}
          onPress={() => !disabled && setIsVisible(true)}
        >
          <Text
            style={[
              styles.value,
              disabled && { color: color.grey },
            ]}
          >
            {displayValue}
          </Text>
        </Pressable>
  
        <Modal
          transparent
          animationType="fade"
          visible={isVisible}
          onRequestClose={() => setIsVisible(false)}
        >
          <Pressable style={styles.overlay} onPress={() => setIsVisible(false)}>
            <View style={styles.modal}>
              <Pressable onPress={() => handleSelect(Gender.Male)}>
                <Text style={styles.option}>Nam</Text>
              </Pressable>
              <Pressable onPress={() => handleSelect(Gender.Female)}>
                <Text style={styles.option}>Nữ</Text>
              </Pressable>
            </View>
          </Pressable>
        </Modal>
      </>
    );
  };
  
  const styles = StyleSheet.create({
    dropdown: {
      paddingVertical: 6,
      minWidth: 80,
    },
    dropdownEditing: {
      borderColor: color.dark_green,
      backgroundColor: "#F3F8FF",
      borderBottomWidth: 0.5,
    },
    dropdownDisabled: {
    //   opacity: 0.5,
    },
    value: {
      fontSize: 14,
      color: color.black,
      textAlign: "right",
    },
    overlay: {
      flex: 1,
      backgroundColor: "rgba(0,0,0,0.4)",
      justifyContent: "center",
      alignItems: "center",
    },
    modal: {
      backgroundColor: color.white,
      borderRadius: 10,
      width: "70%",
      padding: 20,
    },
    option: {
      fontSize: 16,
      paddingVertical: 10,
      textAlign: "center",
      color: color.black,
    },
  });
  
  export default GenderPicker;