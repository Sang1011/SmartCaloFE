import AntDesign from "@expo/vector-icons/AntDesign";
import React, { useState } from "react";
import { Dimensions, Pressable, StyleSheet, Text, View } from "react-native";
import { SurveyData } from "../../app/survey/surveyScreen";
import { globalStyles } from "../../constants/fonts";

const { width } = Dimensions.get("window");

const OBSTACLES = [
  "Thiếu thời gian",
  "Chế độ ăn khó để tuân theo",
  "Chế độ ăn thiếu sự đa dạng",
  "Căng thẳng khi lựa chọn",
  "Kỳ nghỉ / Sự kiện / Xã giao",
  "Ăn uống theo cảm xúc",
  "Vấn đề tài chính",
  "Thiếu sự hỗ trợ",
  "Thói quen ăn uống",
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

export default function Step4_Obstacles({
  surveyData,
  updateSurveyData,
}: Props) {
  const [selected, setSelected] = useState<string[]>(
    surveyData.obstacles || []
  );

  const handleSelect = (item: string) => {
    const isCurrentlySelected = selected.includes(item);

    let newSelection;
    if (isCurrentlySelected) {
      newSelection = selected.filter((i) => i !== item);
    } else {
      newSelection = [...selected, item];
    }

    setSelected(newSelection);
    updateSurveyData((prev) => ({ ...prev, obstacles: newSelection }));
  };

  return (
    <View style={styles.container}>
      <Text style={[styles.title, globalStyles.extraBold]}>
        Trong quá khứ, điều gì đã cản trở bạn duy trì cân nặng?
      </Text>
      <Text style={[styles.subtitle, globalStyles.semiBold]}>
        Chọn tất cả những điều áp dụng:
      </Text>
      <View style={styles.optionsList}>
        {OBSTACLES.map((item) => (
          <SurveyOption
            key={item}
            label={item}
            isSelected={selected.includes(item)}
            onPress={() => handleSelect(item)}
          />
        ))}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1 },
  title: { fontSize: width * 0.07, color: "#000000", marginBottom: 8 },
  subtitle: { fontSize: width * 0.04, color: "#656565", marginBottom: 20 },
  optionsList: { gap: 12 },
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
  optionText: { fontSize: width * 0.04 },
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
