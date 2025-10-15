import AntDesign from "@expo/vector-icons/AntDesign";
import React from "react";
import { Dimensions, Pressable, StyleSheet, Text, View } from "react-native";
import { globalStyles } from "../../constants/fonts";
import { SurveyData } from "./index";

const { width } = Dimensions.get("window");

const WILLINGNESS_LEVELS = [
  "Không hứng thú lắm",
  "Hiếm khi",
  "Thỉnh thoảng",
  "Thường xuyên",
  "Luôn luôn",
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

export default function Step9_Willingness({
  surveyData,
  updateSurveyData,
}: Props) {
  const selectedWillingness = surveyData.willingness || "";

  const handleSelect = (item: string) => {
    const newWillingness = selectedWillingness === item ? "" : item;

    updateSurveyData((prev) => ({
      ...prev,
      willingness: newWillingness,
    }));
  };

  return (
    <View style={styles.container}>
      <Text style={[styles.title, globalStyles.extraBold]}>
        Bạn sẵn lòng thử những điều mới như thế nào?
      </Text>
      <View style={styles.optionsList}>
        {WILLINGNESS_LEVELS.map((item) => (
          <SingleSelectOption
            key={item}
            label={item}
            isSelected={selectedWillingness === item}
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
  },
  title: {
    fontSize: width * 0.07,
    color: "#000000",
    marginBottom: 8,
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
