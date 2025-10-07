import AntDesign from "@expo/vector-icons/AntDesign";
import React, { useState } from "react";
import { Dimensions, Pressable, StyleSheet, Text, View } from "react-native";
import { SurveyData } from "../../app/survey/surveyScreen";
import { globalStyles } from "../../constants/fonts";

const { width } = Dimensions.get("window");

const GOALS = [
  "Giảm cân nặng",
  "Duy trì cân nặng",
  "Tăng cân nặng",
  "Tăng cơ bắp",
  "Sửa đổi chế độ ăn uống",
  "Lập kế hoạch ăn uống",
  "Quản lý căng thẳng",
  "Duy trì hoạt động",
];

interface OptionProps {
  label: string;
  isSelected: boolean;
  onPress: () => void;
}

const SurveyOption = ({ label, isSelected, onPress }: OptionProps) => (
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
  const [selectedGoals, setSelectedGoals] = useState<string[]>(
    surveyData.goals || []
  );

  const handleSelectGoal = (goal: string) => {
    const isCurrentlySelected = selectedGoals.includes(goal);

    let newSelection;
    if (isCurrentlySelected) {
      newSelection = selectedGoals.filter((item) => item !== goal);
    } else {
      // Chỉ cho phép chọn tối đa 3
      if (selectedGoals.length >= 3) return;
      newSelection = [...selectedGoals, goal];
    }

    setSelectedGoals(newSelection);
    updateSurveyData((prev) => ({ ...prev, goals: newSelection }));
  };

  return (
    <View style={styles.container}>
      <Text style={[styles.title, globalStyles.extraBold]}>
        Chào {surveyData.name || "bạn"}, hãy bắt đầu với mục tiêu của bạn
      </Text>
      <Text style={[styles.subtitle, globalStyles.semiBold]}>
        Hãy chọn ra 3 mục tiêu quan trọng với bạn
      </Text>
      <View style={styles.optionsList}>
        {GOALS.map((goal) => (
          <SurveyOption
            key={goal}
            label={goal}
            isSelected={selectedGoals.includes(goal)}
            onPress={() => handleSelectGoal(goal)}
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
