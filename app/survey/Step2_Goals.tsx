import AntDesign from "@expo/vector-icons/AntDesign";
import React from "react";
import { Dimensions, Pressable, StyleSheet, Text, View } from "react-native";
import { globalStyles } from "../../constants/fonts";
import { HealthGoal } from "../../types/me"; // enum bạn đã có
import { SurveyData } from "./index";

const { width } = Dimensions.get("window");

// ⚙️ Mapping giữa label hiển thị và enum value thực tế
const GOAL_OPTIONS = [
  { label: "Giảm cân nặng", value: HealthGoal.LoseWeight },
  { label: "Duy trì cân nặng", value: HealthGoal.MaintainWeight },
  { label: "Tăng cân nặng", value: HealthGoal.GainWeight },
  { label: "Tăng cơ bắp", value: HealthGoal.GainMuscle },
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

export default function Step2_Goals({ surveyData, updateSurveyData }: Props) {
  const handleSelectGoal = (goalValue: HealthGoal) => {
    updateSurveyData((prev) => ({
      ...prev,
      goal: goalValue, // 👈 ghi thẳng enum value vào SurveyData.goal
    }));
  };

  return (
    <View style={styles.container}>
      <Text style={[styles.title, globalStyles.extraBold]}>
        Chào {surveyData.name || "bạn"}, hãy bắt đầu với mục tiêu của bạn
      </Text>
      <Text style={[styles.subtitle, globalStyles.semiBold]}>
        Hãy chọn mục tiêu chính của bạn
      </Text>
      <View style={styles.optionsList}>
        {GOAL_OPTIONS.map(({ label, value }) => (
          <SingleSelectOption
            key={value}
            label={label}
            isSelected={Number(surveyData.goal) === value}
            onPress={() => handleSelectGoal(value)}
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
