import React from "react";
import { Dimensions, Pressable, StyleSheet, Text, View } from "react-native";
import { SurveyData } from "../../app/survey/surveyScreen";
import { globalStyles } from "../../constants/fonts";

const { width } = Dimensions.get("window");

const HABIT_PROMPTS = {
  suggested: "Đề xuất cho bạn:",
  more: "Thêm các thói quen lành mạnh:",
};

const SUGGESTED_HABITS = [
  "Lên kế hoạch bữa ăn",
  "Chuẩn bị và nấu ăn tại nhà",
  "Ăn uống có ý thức",
  "Ăn nhiều chất xơ hơn",
  "Tập luyện thường xuyên",
  "Ăn uống cân bằng",
];

const MORE_HABITS = [
  "Uống vitamin",
  "Theo dõi lượng calo",
  "Theo dõi vận động",
  "Ăn nhiều trái cây",
  "Ăn nhiều protein",
  "Ăn nhiều rau củ",
  "Uống nhiều nước",
  "Ưu tiên giấc ngủ",
  "Vận động nhiều hơn",
  "Khác",
  "Không chắc",
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
    <Text style={[styles.optionText, globalStyles.semiBold]}>{label}</Text>
  </Pressable>
);

interface Props {
  surveyData: SurveyData;
  updateSurveyData: React.Dispatch<React.SetStateAction<SurveyData>>;
}

export default function Step6_Habits({ surveyData, updateSurveyData }: Props) {
  const handleSelect = (habit: string) => {
    const isCurrentlySelected = surveyData.healthyHabits?.includes(habit);

    let newSelection: string[];

    if (isCurrentlySelected) {
      newSelection = surveyData.healthyHabits!.filter((item) => item !== habit);
    } else {
      newSelection = [...(surveyData.healthyHabits || []), habit];
    }

    updateSurveyData((prev) => ({ ...prev, healthyHabits: newSelection }));
  };

  return (
    <View style={styles.container}>
      <Text style={[styles.title, globalStyles.extraBold]}>
        Thói quen sức khỏe nào quan trọng nhất với bạn?
      </Text>
      <View style={styles.promptContainer}>
        <Text style={[styles.prompt, globalStyles.semiBold]}>
          {HABIT_PROMPTS.suggested}
        </Text>
        <View style={styles.optionsList}>
          {SUGGESTED_HABITS.map((item) => (
            <SingleSelectOption
              key={item}
              label={item}
              isSelected={!!surveyData.healthyHabits?.includes(item)}
              onPress={() => handleSelect(item)}
            />
          ))}
        </View>
      </View>
      <View style={styles.promptContainer}>
        <Text style={[styles.prompt, globalStyles.semiBold]}>
          {HABIT_PROMPTS.more}
        </Text>
        <View style={styles.optionsList}>
          {MORE_HABITS.map((item) => (
            <SingleSelectOption
              key={item}
              label={item}
              isSelected={!!surveyData.healthyHabits?.includes(item)}
              onPress={() => handleSelect(item)}
            />
          ))}
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
    marginBottom: 25,
    textAlign: "center",
  },
  promptContainer: {
    marginBottom: 15,
    color: "#656565",
  },
  prompt: {
    fontSize: width * 0.04,
    color: "#656565",
    marginBottom: 10,
  },
  optionsList: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: 10,
  },
  optionContainer: {
    backgroundColor: "#FFFFFF",
    paddingVertical: 10,
    paddingHorizontal: 15,
    borderRadius: 20,
    borderWidth: 2,
    borderColor: "#787878",
    alignItems: "center",
  },
  optionSelected: {
    borderColor: "#787878",
    backgroundColor: "#D9D9D9",
  },
  optionText: {
    fontSize: width * 0.04,
    color: "#000000",
  },
});
