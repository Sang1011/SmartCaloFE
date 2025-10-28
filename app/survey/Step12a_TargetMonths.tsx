import { SCSlider } from "@components/ui/SCSlider";
import color from "@constants/color";
import React from "react";
import {
  Dimensions,
  StyleSheet,
  Text,
  View,
} from "react-native";
import { globalStyles } from "../../constants/fonts";
import { SurveyData } from "./index";

const { width } = Dimensions.get("window");

interface Props {
  surveyData: SurveyData;
  updateSurveyData: React.Dispatch<React.SetStateAction<SurveyData>>;
}

export default function Step12a_TargetMonths({
  surveyData,
  updateSurveyData,
}: Props) {
  const handleSliderChange = (value: number) => {
    updateSurveyData((prev) => ({
      ...prev,
      targetMonths: Math.round(value),
    }));
  };

  const targetMonths = surveyData.targetMonths || 1;

  return (
    <View style={styles.container}>
      <Text style={[styles.title, globalStyles.extraBold]}>
        Bạn muốn đạt mục tiêu trong bao lâu?
      </Text>

      <View style={styles.contentContainer}>
        <View style={styles.valueContainer}>
          <Text style={[styles.valueText, globalStyles.extraBold]}>
            {targetMonths}
          </Text>
          <Text style={[styles.unitText, globalStyles.semiBold]}>
            {targetMonths === 1 ? "tháng" : "tháng"}
          </Text>
        </View>

        <View style={styles.sliderContainer}>
          <SCSlider
            style={styles.slider}
            minimumValue={2}
            maximumValue={12}
            step={1}
            value={targetMonths}
            onValueChange={handleSliderChange}
          />
          <View style={styles.labelsContainer}>
            <Text style={[styles.labelText, globalStyles.regular]}>
              2 tháng
            </Text>
            <Text style={[styles.labelText, globalStyles.regular]}>
              12 tháng
            </Text>
          </View>
        </View>

        <View style={styles.infoBox}>
          <Text style={[styles.infoText, globalStyles.regular]}>
            💡 Đề xuất: Một kế hoạch hợp lý từ 3-6 tháng sẽ giúp bạn đạt được mục tiêu một cách bền vững và an toàn.
          </Text>
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
    color: color.black,
    marginBottom: 32,
  },
  contentContainer: {
    gap: 32,
  },
  valueContainer: {
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: color.gray_light,
    borderRadius: 16,
    paddingVertical: 32,
    paddingHorizontal: 24,
  },
  valueText: {
    fontSize: width * 0.15,
    color: color.dark_green,
  },
  unitText: {
    fontSize: width * 0.05,
    color: color.grey,
    marginTop: 8,
  },
  sliderContainer: {
    gap: 12,
  },
  slider: {
    width: "100%",
    marginVertical: 8,
  },
  labelsContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    paddingHorizontal: 4,
  },
  labelText: {
    fontSize: width * 0.035,
    color: color.grey,
  },
  infoBox: {
    backgroundColor: color.macro_span_protein_bg,
    borderRadius: 12,
    padding: 16,
    borderLeftWidth: 4,
    borderLeftColor: color.dark_green,
  },
  infoText: {
    fontSize: width * 0.038,
    color: color.macro_span_protein_color,
    lineHeight: 22,
  },
});