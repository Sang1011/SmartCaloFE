import AntDesign from "@expo/vector-icons/AntDesign";
import React from "react";
import {
  Dimensions,
  StyleSheet,
  Text,
  View
} from "react-native";
import { globalStyles } from "../../constants/fonts";
import { SurveyData } from "./index";

const { width } = Dimensions.get("window");

interface Props {
  surveyData: SurveyData;
  updateSurveyData: React.Dispatch<React.SetStateAction<SurveyData>>;
  onNext?: () => void; // thêm callback để bấm Next
}

export default function Step13_Completion({ surveyData, onNext }: Props) {
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
          Chúng tôi sẽ gửi cho bạn những tin tức, đổi mới và ưu đãi mới nhất từ
          Smart Calo.
        </Text>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    paddingHorizontal: 20,
  },
  loadingContainer: {
    justifyContent: "center",
    alignItems: "center",
    gap: 16,
  },
  loadingText: {
    fontSize: width * 0.045,
    color: "#555",
  },
  title: {
    fontSize: width * 0.07,
    color: "#000000",
    marginBottom: 40,
    alignSelf: "flex-start",
  },
  optionItem: {
    display: "flex",
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "flex-start",
    marginBottom: 20,
    gap: 12,
  },
  optionText: {
    fontSize: width * 0.045,
    color: "#333333",
    flexShrink: 1,
  },
  nextButton: {
    backgroundColor: "#6C9C39",
    paddingVertical: 14,
    paddingHorizontal: 40,
    borderRadius: 12,
    marginTop: 40,
  },
  nextButtonText: {
    color: "#FFFFFF",
    fontSize: width * 0.045,
  },
});
