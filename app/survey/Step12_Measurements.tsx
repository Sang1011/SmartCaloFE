import { SCSlider } from "@components/ui/SCSlider";
import color from "@constants/color";
import React, { useEffect } from "react";
import {
  Dimensions,
  StyleSheet,
  Text,
  View,
} from "react-native";
import { globalStyles } from "../../constants/fonts";
import { HealthGoal } from "../../types/me";
import { SurveyData } from "./index";

const { width } = Dimensions.get("window");

interface Props {
  surveyData: SurveyData;
  updateSurveyData: React.Dispatch<React.SetStateAction<SurveyData>>;
}

export default function Step12_Measurements({
  surveyData,
  updateSurveyData,
}: Props) {
  useEffect(() => {
    // Gán mặc định targetWeight = weight khi người dùng nhập cân nặng
    if (surveyData.weight && !surveyData.targetWeight) {
      updateSurveyData((prev) => ({
        ...prev,
        targetWeight: prev.weight,
      }));
    }
  }, [surveyData.weight]);

  const handleHeightChange = (value: number) => {
    updateSurveyData((prev) => ({
      ...prev,
      height: Math.round(value),
    }));
  };

  const handleWeightChange = (value: number) => {
    const rounded = Math.round(value * 2) / 2; // Làm tròn đến 0.5
    updateSurveyData((prev) => ({
      ...prev,
      weight: rounded,
      targetWeight: rounded, // reset targetWeight
    }));
  };

  const handleTargetWeightChange = (value: number) => {
    const rounded = Math.round(value * 2) / 2; // Làm tròn đến 0.5
    updateSurveyData((prev) => ({
      ...prev,
      targetWeight: rounded,
    }));
  };

  // Validate LoseWeight / GainWeight
  const validateTargetWeight = () => {
    const { goal, weight, targetWeight } = surveyData;
    if (!weight || !targetWeight) return true; // Không hiện lỗi nếu chưa nhập

    if (goal === HealthGoal.LoseWeight) return targetWeight < weight;
    if (goal === HealthGoal.GainWeight) return targetWeight > weight;
    return true;
  };

  const isTargetValid = validateTargetWeight();

  const currentHeight = surveyData.height || 150;
  const currentWeight = surveyData.weight || 50;
  const baseWeight = surveyData.weight || 50;
  const currentTarget = surveyData.targetWeight ?? baseWeight;
  
  const minWeight = Math.max(30, baseWeight - 20);
  const maxWeight = Math.min(200, baseWeight + 20);

  return (
    <View style={styles.container}>
      <Text style={[styles.title, globalStyles.extraBold]}>
        Chỉ thêm vài câu hỏi nữa.
      </Text>

      <View style={styles.formContainer}>
        {/* Chiều cao */}
        <View style={styles.inputGroup}>
          <Text style={[styles.label, globalStyles.regular]}>
            Chiều cao của bạn?
          </Text>
          
          <View style={styles.valueDisplayContainer}>
            <Text style={[styles.valueText, globalStyles.extraBold]}>
              {currentHeight}
            </Text>
            <Text style={[styles.unitText, globalStyles.semiBold]}>cm</Text>
          </View>

          <SCSlider
            style={styles.slider}
            minimumValue={100}
            maximumValue={220}
            step={1}
            value={currentHeight}
            onValueChange={handleHeightChange}
          />

          <View style={styles.sliderLabels}>
            <Text style={[styles.sliderLabel, globalStyles.regular]}>100 cm</Text>
            <Text style={[styles.sliderLabel, globalStyles.regular]}>220 cm</Text>
          </View>
        </View>

        {/* Cân nặng hiện tại */}
        <View style={styles.inputGroup}>
          <Text style={[styles.label, globalStyles.regular]}>
            Cân nặng hiện tại của bạn?
          </Text>
          
          <View style={styles.valueDisplayContainer}>
            <Text style={[styles.valueText, globalStyles.extraBold]}>
              {currentWeight}
            </Text>
            <Text style={[styles.unitText, globalStyles.semiBold]}>kg</Text>
          </View>

          <SCSlider
            style={styles.slider}
            minimumValue={20}
            maximumValue={200}
            step={0.5}
            value={currentWeight}
            onValueChange={handleWeightChange}
          />

          <View style={styles.sliderLabels}>
            <Text style={[styles.sliderLabel, globalStyles.regular]}>20 kg</Text>
            <Text style={[styles.sliderLabel, globalStyles.regular]}>200 kg</Text>
          </View>
        </View>

        {/* Cân nặng mục tiêu */}
        {surveyData.weight && (
          <View style={styles.inputGroup}>
            <Text style={[styles.label, globalStyles.regular]}>
              Cân nặng mục tiêu của bạn?
            </Text>

            <View style={styles.valueDisplayContainer}>
              <Text style={[styles.valueText, globalStyles.extraBold]}>
                {currentTarget}
              </Text>
              <Text style={[styles.unitText, globalStyles.semiBold]}>kg</Text>
            </View>

            <SCSlider
              style={styles.slider}
              minimumValue={minWeight}
              maximumValue={maxWeight}
              step={0.5}
              value={currentTarget}
              onValueChange={handleTargetWeightChange}
            />

            <View style={styles.sliderLabels}>
              <Text style={[styles.sliderLabel, globalStyles.regular]}>
                {minWeight} kg
              </Text>
              <Text style={[styles.sliderLabel, globalStyles.regular]}>
                {maxWeight} kg
              </Text>
            </View>

            {!isTargetValid && (
              <Text style={styles.errorText}>
                {surveyData.goal === HealthGoal.LoseWeight
                  ? "⚠️ Cân nặng mục tiêu phải thấp hơn cân nặng hiện tại."
                  : "⚠️ Cân nặng mục tiêu phải cao hơn cân nặng hiện tại."}
              </Text>
            )}
          </View>
        )}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1 },
  title: {
    fontSize: width * 0.07,
    color: color.black,
    marginBottom: 32,
  },
  formContainer: { gap: 28 },
  inputGroup: { gap: 12 },
  label: { fontSize: width * 0.04, color: "#4F4F4F" },
  valueDisplayContainer: {
    flexDirection: "row",
    alignItems: "baseline",
    justifyContent: "center",
    backgroundColor: color.gray_light,
    borderRadius: 12,
    paddingVertical: 20,
    paddingHorizontal: 16,
    gap: 8,
  },
  valueText: {
    fontSize: width * 0.11,
    color: color.dark_green,
  },
  unitText: {
    fontSize: width * 0.045,
    color: color.grey,
  },
  slider: {
    width: "100%",
    marginVertical: 8,
  },
  sliderLabels: {
    flexDirection: "row",
    justifyContent: "space-between",
    paddingHorizontal: 4,
  },
  sliderLabel: {
    fontSize: width * 0.035,
    color: color.grey,
  },
  errorText: { 
    color: color.red, 
    fontSize: 14, 
    paddingLeft: 4,
    marginTop: 4,
  },
});