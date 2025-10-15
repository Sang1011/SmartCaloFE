import AntDesign from "@expo/vector-icons/AntDesign";
import { setCredentials } from "@features/auth";
import { RootState } from "@redux";
import { useAppDispatch, useAppSelector } from "@redux/hooks";
import React, { useState } from "react";
import {
  Dimensions,
  Pressable,
  StyleSheet,
  Text,
  TextInput,
  View,
} from "react-native";
import { globalStyles } from "../../constants/fonts";
import { SurveyData } from "./index";

const { width } = Dimensions.get("window");

const GENDERS = [
  { label: "Nam", value: "male" as const },
  { label: "Nữ", value: "female" as const },
  { label: "Khác", value: "other" as const },
];

type GenderValue = (typeof GENDERS)[number]["value"];

interface Props {
  surveyData: SurveyData;
  updateSurveyData: React.Dispatch<React.SetStateAction<SurveyData>>;
}

export default function Step11_Demographics({
  surveyData,
  updateSurveyData,
}: Props) {
  const [isDropdownOpen, setDropdownOpen] = useState(false);
  const user = useAppSelector((state: RootState) => state.auth.user);
  const dispatch = useAppDispatch();

  const handleUpdateAge = (age: string) => {
    if (/^\d*$/.test(age)) {
      // Chuyển đổi age từ string sang number
      const ageNumber = parseInt(age, 10) || 0; 
      
      // 1. Cập nhật surveyData
      updateSurveyData((prev) => ({ ...prev, age: ageNumber }));
      
      // 2. Cập nhật Redux user
      if (user) {
        dispatch(
          setCredentials({
            ...user,
            age: ageNumber, // Gán age là number
          })
        );
      }
    }
  };

  const handleSelectGender = (gender: GenderValue) => {
    updateSurveyData((prev) => ({ ...prev, gender }));
    setDropdownOpen(false);
  };

  const selectedGenderLabel =
    GENDERS.find((g) => g.value === surveyData.gender)?.label || "Giới tính";

  // Sửa lỗi ở đây: surveyData.age là number, chỉ nên kiểm tra giá trị
  const showAgeError = surveyData.age === 0;

  return (
    <View style={styles.container}>
      <Text style={[styles.title, globalStyles.extraBold]}>
        Hãy cho chúng tôi biết một chút về bạn.
      </Text>

      <View style={styles.formContainer}>
        <View style={styles.inputGroup}>
          <Text style={[styles.label, globalStyles.regular]}>
            Bạn bao nhiêu tuổi ?
          </Text>
          <TextInput
            style={[styles.input, globalStyles.semiBold]}
            // Chuyển age (number) sang string để hiển thị trong TextInput
            value={surveyData.age?.toString()}
            onChangeText={handleUpdateAge}
            keyboardType="numeric"
            placeholder="Nhập tuổi của bạn"
            placeholderTextColor="#BDBDBD"
          />
          {showAgeError && (
            <Text style={styles.errorText}>Vui lòng nhập tuổi của bạn</Text>
          )}
        </View>

        {/* Gender Dropdown */}
        <View style={styles.inputGroup}>
          <Text style={[styles.label, globalStyles.regular]}>
            Giới tính của bạn là gì
          </Text>
          {/* Dropdown component... */}
          <View style={styles.dropdownContainer}>
            <Pressable
              style={[
                styles.dropdownSelector,
                isDropdownOpen && styles.dropdownSelectorOpen,
              ]}
              onPress={() => setDropdownOpen(!isDropdownOpen)}
            >
              <Text
                style={[styles.dropdownSelectedText, globalStyles.semiBold]}
              >
                {selectedGenderLabel}
              </Text>
              <AntDesign
                name={isDropdownOpen ? "up" : "down"}
                size={16}
                color="#828282"
              />
            </Pressable>

            {isDropdownOpen && (
              <View style={styles.dropdownList}>
                {GENDERS.map((item) => (
                  <Pressable
                    key={item.value}
                    style={styles.dropdownItem}
                    onPress={() => handleSelectGender(item.value)}
                  >
                    <Text
                      style={[styles.dropdownItemText, globalStyles.regular]}
                    >
                      {item.label}
                    </Text>
                  </Pressable>
                ))}
              </View>
            )}
          </View>
        </View>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  title: {
    fontSize: width * 0.07,
    color: "#000000",
    marginBottom: 32,
  },
  formContainer: {
    gap: 24,
  },
  inputGroup: {
    gap: 8,
  },
  label: {
    fontSize: width * 0.04,
    color: "#4F4F4F",
  },
  input: {
    backgroundColor: "#F2F2F2",
    borderWidth: 1,
    borderColor: "#E0E0E0",
    borderRadius: 12,
    paddingHorizontal: 16,
    paddingVertical: 14,
    fontSize: width * 0.04,
  },
  errorText: {
    color: "red",
    fontSize: 14,
    paddingLeft: 4,
  },
  // Dropdown styles
  dropdownContainer: {
    position: "relative",
  },
  dropdownSelector: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    backgroundColor: "#F2F2F2",
    borderWidth: 1,
    borderColor: "#E0E0E0",
    borderRadius: 12,
    paddingHorizontal: 16,
    paddingVertical: 14,
  },
  dropdownSelectorOpen: {
    borderColor: "#6C9C39",
    borderWidth: 1.5,
  },
  dropdownSelectedText: {
    fontSize: width * 0.04,
    color: "#333",
  },
  dropdownList: {
    position: "absolute",
    top: "110%",
    width: "100%",
    backgroundColor: "#FFFFFF",
    borderRadius: 12,
    borderWidth: 1,
    borderColor: "#E0E0E0",
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.1,
    shadowRadius: 3.84,
    elevation: 5,
    zIndex: 10,
  },
  dropdownItem: {
    paddingHorizontal: 16,
    paddingVertical: 14,
  },
  dropdownItemText: {
    fontSize: width * 0.04,
    color: "#333",
  },
});