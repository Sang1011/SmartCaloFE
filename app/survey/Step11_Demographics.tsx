import { SCSlider } from "@components/ui/SCSlider";
import color from "@constants/color";
import { globalStyles } from "@constants/fonts";
import AntDesign from "@expo/vector-icons/AntDesign";
import React, { useState } from "react";
import {
  Dimensions,
  Pressable,
  StyleSheet,
  Text,
  View
} from "react-native";
import { Gender } from "../../types/me";
import { SurveyData } from "./index";

const { width } = Dimensions.get("window");

const GENDERS = [
  { label: "Nam", value: Gender.Male },
  { label: "Nữ", value: Gender.Female },
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

  const handleUpdateAge = (age: number) => {
    updateSurveyData((prev) => ({
      ...prev,
      age: Math.round(age),
    }));
  };

  const handleSelectGender = (gender: GenderValue) => {
    updateSurveyData((prev) => ({ ...prev, gender }));
    setDropdownOpen(false);
  };

  const selectedGenderLabel =
    GENDERS.find((g) => g.value === surveyData.gender)?.label || "Giới tính";

  const showAgeError = !surveyData.age || surveyData.age <= 0;
  const currentAge = surveyData.age || 18;

  return (
    <View style={styles.container}>
      <Text style={[styles.title, globalStyles.extraBold]}>
        Hãy cho chúng tôi biết một chút về bạn.
      </Text>

      <View style={styles.formContainer}>
        <View style={styles.inputGroup}>
          <Text style={[styles.label, globalStyles.regular]}>
            Bạn bao nhiêu tuổi?
          </Text>

          <View style={styles.ageDisplayContainer}>
            <Text style={[styles.ageValue, globalStyles.extraBold]}>
              {currentAge}
            </Text>
            <Text style={[styles.ageUnit, globalStyles.semiBold]}>tuổi</Text>
          </View>

          <SCSlider
            style={styles.slider}
            minimumValue={10}
            maximumValue={100}
            step={1}
            value={currentAge}
            onValueChange={handleUpdateAge}
          />

          <View style={styles.sliderLabels}>
            <Text style={[styles.sliderLabel, globalStyles.regular]}>10</Text>
            <Text style={[styles.sliderLabel, globalStyles.regular]}>100</Text>
          </View>

          {showAgeError && (
            <Text style={styles.errorText}>Vui lòng nhập tuổi của bạn</Text>
          )}
        </View>

        <View style={styles.inputGroup}>
          <Text style={[styles.label, globalStyles.regular]}>
            Giới tính của bạn là gì
          </Text>
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
                      style={[
                        styles.dropdownItemText,
                        globalStyles.regular,
                      ]}
                    >
                      {item.label}
                    </Text>
                  </Pressable>
                ))}
              </View>
            )}

            {/* Hoặc dùng Modal nếu muốn */}
            {/* <Modal
              transparent
              visible={isDropdownOpen}
              onRequestClose={() => setDropdownOpen(false)}
            >
              <Pressable
                style={styles.modalOverlay}
                onPress={() => setDropdownOpen(false)}
              >
                <View style={[styles.dropdownList, styles.dropdownModal]}>
                  {GENDERS.map((item) => (
                    <Pressable
                      key={item.value}
                      style={styles.dropdownItem}
                      onPress={() => handleSelectGender(item.value)}
                    >
                      <Text
                        style={[
                          styles.dropdownItemText,
                          globalStyles.regular,
                        ]}
                      >
                        {item.label}
                      </Text>
                    </Pressable>
                  ))}
                </View>
              </Pressable>
            </Modal> */}
          </View>
        </View>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1 },
  title: {
    fontSize: width * 0.07,
    color: color.black,
    marginBottom: 32,
  },
  modalOverlay: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(0,0,0,0.2)',
  },
  dropdownModal: {
    position: 'relative',
    width: width * 0.85,
  },
  formContainer: { gap: 24 },
  inputGroup: { gap: 12 },
  label: { fontSize: width * 0.04, color: "#4F4F4F" },
  ageDisplayContainer: {
    flexDirection: "row",
    alignItems: "baseline",
    justifyContent: "center",
    backgroundColor: color.gray_light,
    borderRadius: 12,
    paddingVertical: 20,
    paddingHorizontal: 16,
    gap: 8,
  },
  ageValue: {
    fontSize: width * 0.12,
    color: color.dark_green,
  },
  ageUnit: {
    fontSize: width * 0.045,
    color: color.grey,
  },
  slider: {
    width: "100%",
    marginVertical: 8,
  },
  sliderLabels: {
    flexDirection: "row",
    justifyContent: "space-between",
    paddingHorizontal: 4,
  },
  sliderLabel: {
    fontSize: width * 0.035,
    color: color.grey,
  },
  errorText: { color: color.red, fontSize: 14, paddingLeft: 4 },
  dropdownContainer: { position: "relative" },
  dropdownSelector: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    backgroundColor: color.gray_light,
    borderWidth: 1,
    borderColor: "#E0E0E0",
    borderRadius: 12,
    paddingHorizontal: 16,
    paddingVertical: 14,
  },
  dropdownSelectorOpen: {
    borderColor: color.dark_green,
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
    backgroundColor: color.white,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: "#E0E0E0",
    shadowColor: color.black,
    shadowOffset: { width: 0, height: 2 },
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