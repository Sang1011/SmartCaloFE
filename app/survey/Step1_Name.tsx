import React from "react";
import { Dimensions, StyleSheet, Text, TextInput, View } from "react-native";
import { globalStyles } from "../../constants/fonts";
import { SurveyData } from "./index";

const { width } = Dimensions.get("window");

interface Props {
  surveyData: SurveyData;
  updateSurveyData: React.Dispatch<React.SetStateAction<SurveyData>>;
}

export default function Step1_Name({ surveyData, updateSurveyData }: Props) {
  const handleNameChange = (name: string) => {
    updateSurveyData((prev) => ({ ...prev, name }));
  };

  const showError = surveyData.name !== undefined && !surveyData.name.trim();

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
      {/* Nhả lỗi ở đây */}
      {showError && (
        <Text style={styles.errorText}>Vui lòng nhập tên của bạn</Text>
      )}
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
  },
  subtitle: {
    fontSize: width * 0.04,
    color: "#656565",
    marginTop: 8,
    marginBottom: 20,
  },
  input: {
    backgroundColor: "#F2F2F2",
    borderWidth: 1,
    borderColor: "#E0E0E0",
    borderRadius: 12,
    paddingHorizontal: 16,
    paddingVertical: 14,
    fontSize: width * 0.045,
  },
  errorText: {
    color: "red",
    marginTop: 8,
    fontSize: 14,
  },
});
