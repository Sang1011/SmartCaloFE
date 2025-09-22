import React from "react";
import { Dimensions, StyleSheet, Text, TextInput, View } from "react-native";
import { SurveyData } from "../../app/survey/surveyScreen";
import color from "../../constants/color";
import { globalStyles } from "../../constants/fonts";

const { width } = Dimensions.get("window");

interface Props {
  surveyData: SurveyData;
  updateSurveyData: React.Dispatch<React.SetStateAction<SurveyData>>;
}

export default function Step1_Name({ surveyData, updateSurveyData }: Props) {
  const handleNameChange = (name: string) => {
    updateSurveyData((prev) => ({ ...prev, name }));
  };

  return (
    <View style={styles.container}>
      <Text style={[styles.title, globalStyles.extraBold]}>
        Đầu tiên, chúng tôi có thể gọi bạn là gì?
      </Text>
      <Text style={[styles.subtitle, globalStyles.bold]}>
        Chúng tôi muốn biết thêm về bạn
      </Text>
      <TextInput
        style={[styles.input, globalStyles.semiBold]}
        placeholder="Nhập tên của bạn"
        value={surveyData.name}
        onChangeText={handleNameChange}
        placeholderTextColor={"#656565"}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
  },
  title: {
    fontSize: width * 0.07,
    color: "#000000",
    marginBottom: 8,
  },
  subtitle: {
    fontSize: width * 0.04,
    color: "#656565",
    marginBottom: 30,
  },
  input: {
    borderWidth: 1,
    borderColor: color.light_gray,
    borderRadius: 12,
    padding: 15,
    fontSize: width * 0.04,
  },
});
