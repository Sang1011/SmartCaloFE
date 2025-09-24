import AntDesign from "@expo/vector-icons/AntDesign";
import React from "react";
import { Dimensions, Pressable, StyleSheet, Text, View } from "react-native";
import color from "../../constants/color";
import { globalStyles } from "../../constants/fonts";
import { SurveyData } from "./surveyScreen";

const { width } = Dimensions.get("window");

const FREQUENCY = [
  "Không bao giờ",
  "Hiếm khi",
  "Thỉnh thoảng",
  "Thường xuyên",
  "Luôn luôn",
];

interface MultiSelectOptionProps {
  label: string;
  isSelected: boolean;
  onPress: () => void;
}

const MultiSelectOption = ({
  label,
  isSelected,
  onPress,
}: MultiSelectOptionProps) => (
  <Pressable
    onPress={onPress}
    style={[styles.optionContainer, isSelected && styles.optionSelected]}
  >
    <Text style={[styles.optionText, globalStyles.medium]}>{label}</Text>
    <View style={[styles.checkbox, isSelected && styles.checkboxSelected]}>
      {isSelected && <AntDesign name="check" size={16} color={color.white} />}
    </View>
  </Pressable>
);

interface Props {
  surveyData: SurveyData;
  updateSurveyData: React.Dispatch<React.SetStateAction<SurveyData>>;
}

export default function Step8_PlanningFrequency({
  surveyData,
  updateSurveyData,
}: Props) {
  const selectedFrequencies = Array.isArray(surveyData.planningFrequency)
    ? surveyData.planningFrequency
    : [];

  const handleSelect = (item: string) => {
    const updatedFrequencies = selectedFrequencies.includes(item)
      ? selectedFrequencies.filter((i) => i !== item)
      : [...selectedFrequencies, item];

    updateSurveyData((prev) => ({
      ...prev,
      planningFrequency: updatedFrequencies,
    }));
  };

  return (
    <View style={styles.container}>
      <Text style={[styles.title, globalStyles.extraBold]}>
        Bạn lên kế hoạch cho bữa ăn trước bao lâu?
      </Text>
      <Text style={[styles.subtitle, globalStyles.regular]}>
        Chọn tất cả những điều áp dụng:
      </Text>
      <View style={styles.optionsList}>
        {FREQUENCY.map((item) => (
          <MultiSelectOption
            key={item}
            label={item}
            isSelected={selectedFrequencies.includes(item)}
            onPress={() => handleSelect(item)}
          />
        ))}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingHorizontal: 20,
    paddingVertical: 10,
  },
  title: {
    fontSize: width * 0.06,
    color: "#000000",
    marginBottom: 8,
  },
  subtitle: {
    fontSize: width * 0.04,
    color: "#656565",
    marginBottom: 20,
  },
  optionsList: {
    gap: 12,
  },
  optionContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    backgroundColor: "#EEEEEE",
    padding: 18,
    borderRadius: 12,
    borderWidth: 2,
    borderColor: "transparent",
  },
  optionSelected: {
    borderColor: "transparent",
    backgroundColor: "#EEEEEE",
  },
  optionText: {
    fontSize: width * 0.04,
  },
  checkbox: {
    width: 24,
    height: 24,
    borderRadius: 12,
    borderWidth: 2,
    borderColor: "#000000",
    justifyContent: "center",
    alignItems: "center",
  },
  checkboxSelected: {
    backgroundColor: "#6C9C39",
    borderColor: "#6C9C39",
  },
});
