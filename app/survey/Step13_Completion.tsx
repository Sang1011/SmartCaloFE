import AntDesign from "@expo/vector-icons/AntDesign";
import React from "react";
import { Dimensions, StyleSheet, Text, View } from "react-native";
import { globalStyles } from "../../constants/fonts";
import { SurveyData } from "./index";

const { width } = Dimensions.get("window");

interface Props {
  surveyData: SurveyData;
  updateSurveyData: React.Dispatch<React.SetStateAction<SurveyData>>;
}

export default function Step13_Completion({ surveyData }: Props) {
  const userName = surveyData.name || "bạn";

  return (
    <View style={styles.container}>
      <Text style={[styles.title, globalStyles.extraBold]}>
        Chúc mừng bạn, {userName}!
      </Text>

      <View style={styles.optionItem}>
        <AntDesign name="check-circle" size={24} color="#2CD9A1" />
        <Text style={[styles.optionText, globalStyles.regular]}>
          Luôn theo dõi lời nhắc.
        </Text>
      </View>

      <View style={styles.optionItem}>
        <AntDesign name="check-circle" size={24} color="#2CD9A1" />
        <Text style={[styles.optionText, globalStyles.regular]}>
          Gửi cho tôi những tin tức, đổi mới và ưu đãi mới nhất từ Smart Calo.
        </Text>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    alignItems: "flex-start",
    paddingHorizontal: 20,
  },
  title: {
    fontSize: width * 0.07,
    color: "#000000",
    marginBottom: 40,
    alignSelf: "flex-start",
  },
  optionItem: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 20,
    gap: 12,
  },
  optionText: {
    fontSize: width * 0.045,
    color: "#333333",
    flexShrink: 1,
  },
});
