import AntDesign from "@expo/vector-icons/AntDesign";
import React from "react";
import { Dimensions, Pressable, StyleSheet, Text, View } from "react-native";
import { globalStyles } from "../../constants/fonts";
import { SurveyData } from "./index";

const { width } = Dimensions.get("window");

// Mapping song song giữa label hiển thị và value để lưu
const ACTIVITY_LEVELS = [
  { label: "Ít vận động", value: 0 },
  { label: "Thỉnh thoảng", value: 1 },
  { label: "Thường xuyên", value: 2 },
  { label: "Rất năng động", value: 3 },
  // Có thể thêm nếu cần:
  // { label: "Cực kỳ năng động", value: 4 },
];

interface SingleSelectOptionProps {
  label: string;
  isSelected: boolean;
  onPress: () => void;
}

const SingleSelectOption = ({
  label,
  isSelected,
  onPress,
}: SingleSelectOptionProps) => (
  <Pressable
    onPress={onPress}
    style={[styles.optionContainer, isSelected && styles.optionSelected]}
  >
    <Text style={[styles.optionText, globalStyles.bold]}>{label}</Text>
    <View style={[styles.checkbox, isSelected && styles.checkboxSelected]}>
      {isSelected && <AntDesign name="check" size={16} color={"#D9D9D9"} />}
    </View>
  </Pressable>
);

interface Props {
  surveyData: SurveyData;
  updateSurveyData: React.Dispatch<React.SetStateAction<SurveyData>>;
}

export default function Step10_ActivityLevel({
  surveyData,
  updateSurveyData,
}: Props) {
  const handleSelect = (levelValue: number) => {
    updateSurveyData((prev) => ({ ...prev, activityLevel: levelValue }));
  };

  return (
    <View style={styles.container}>
      <Text style={[styles.title, globalStyles.extraBold]}>
        Tần suất hoạt động cơ bản của bạn là gì?
      </Text>
      <Text style={[styles.subtitle, globalStyles.semiBold]}>
        Hãy chọn mô tả phù hợp nhất với bạn:
      </Text>
      <View style={styles.optionsList}>
        {ACTIVITY_LEVELS.map((item) => (
          <SingleSelectOption
            key={item.value}
            label={item.label}
            isSelected={Number(surveyData.activityLevel) === item.value}
            onPress={() => handleSelect(item.value)}
          />
        ))}
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
    marginBottom: 8,
  },
  subtitle: {
    fontSize: width * 0.04,
    color: "#656565",
    textAlign: "left",
    marginBottom: 24,
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
