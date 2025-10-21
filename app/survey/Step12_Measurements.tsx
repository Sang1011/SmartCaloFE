import color from "@constants/color";
import { Ionicons } from "@expo/vector-icons";
import React, { useEffect, useState } from "react";
import {
  Dimensions,
  Pressable,
  StyleSheet,
  Text,
  TextInput,
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
  const [errors, setErrors] = useState({
    height: false,
    weight: false,
    targetWeight: false,
  });

  const [heightInput, setHeightInput] = useState(
    surveyData.height ? surveyData.height.toString() : ""
  );
  const [weightInput, setWeightInput] = useState(
    surveyData.weight ? surveyData.weight.toString() : ""
  );

  useEffect(() => {
    // Gán mặc định targetWeight = weight khi người dùng nhập cân nặng
    if (surveyData.weight && !surveyData.targetWeight) {
      updateSurveyData((prev) => ({
        ...prev,
        targetWeight: prev.weight,
      }));
    }
  }, [surveyData.weight]);

  const validateNumber = (value: string) => {
    const parsed = parseFloat(value);
    return !(value === "" || isNaN(parsed) || parsed <= 0);
  };

  // 🧩 Validate LoseWeight / GainWeight
  const validateTargetWeight = () => {
    const { goal, weight, targetWeight } = surveyData;
    if (!weight || !targetWeight) return false;

    if (goal === HealthGoal.LoseWeight) return targetWeight < weight;
    if (goal === HealthGoal.GainWeight) return targetWeight > weight;
    return true;
  };

  const handleChange = (field: "height" | "weight", value: string) => {
    if (field === "height") setHeightInput(value);
    if (field === "weight") setWeightInput(value);

    const parsed = parseFloat(value);
    const isValid = validateNumber(value);

    updateSurveyData((prev) => ({
      ...prev,
      [field]: value === "" ? undefined : parsed,
      // reset lại targetWeight nếu đổi cân nặng
      targetWeight: field === "weight" ? parsed : prev.targetWeight,
    }));

    setErrors((prev) => ({
      ...prev,
      [field]: !isValid,
    }));
  };

  const adjustTargetWeight = (delta: number) => {
    updateSurveyData((prev) => {
      const base = prev.weight || 0;
      let newTarget = (prev.targetWeight || base) + delta;
      const min = base - 10;
      const max = base + 10;

      if (newTarget < min) newTarget = min;
      if (newTarget > max) newTarget = max;

      return { ...prev, targetWeight: newTarget };
    });
  };

  const isTargetValid = validateTargetWeight();

  const baseWeight = surveyData.weight || 0;
  const currentTarget = surveyData.targetWeight ?? baseWeight;
  const minLimit = baseWeight - 10;
  const maxLimit = baseWeight + 10;

  const disableMinus = currentTarget <= minLimit;
  const disablePlus = currentTarget >= maxLimit;

  return (
    <View style={styles.container}>
      <Text style={[styles.title, globalStyles.extraBold]}>
        Chỉ thêm vài câu hỏi nữa.
      </Text>

      <View style={styles.formContainer}>
        <View style={styles.inputGroup}>
          <Text style={[styles.label, globalStyles.regular]}>
            Chiều cao của bạn?
          </Text>
          <View style={styles.inputRow}>
            <TextInput
              style={[styles.input, globalStyles.semiBold]}
              value={heightInput}
              onChangeText={(v) => handleChange("height", v)}
              keyboardType="numeric"
              placeholder="Nhập chiều cao"
              placeholderTextColor={color.black_50}
            />
            <Pressable style={styles.unitButton}>
              <Text style={[styles.unitButtonText, globalStyles.bold]}>cm</Text>
            </Pressable>
          </View>
          {errors.height && (
            <Text style={styles.errorText}>Vui lòng nhập chiều cao hợp lệ</Text>
          )}
        </View>

        <View style={styles.inputGroup}>
          <Text style={[styles.label, globalStyles.regular]}>
            Cân nặng hiện tại của bạn?
          </Text>
          <View style={styles.inputRow}>
            <TextInput
              style={[styles.input, globalStyles.semiBold]}
              value={weightInput}
              onChangeText={(v) => handleChange("weight", v)}
              keyboardType="numeric"
              placeholder="Nhập cân nặng hiện tại"
              placeholderTextColor={color.black_50}
            />
            <Pressable style={styles.unitButton}>
              <Text style={[styles.unitButtonText, globalStyles.bold]}>kg</Text>
            </Pressable>
          </View>
          {errors.weight && (
            <Text style={styles.errorText}>Vui lòng nhập cân nặng hợp lệ</Text>
          )}
        </View>

        {surveyData.weight && (
          <View style={styles.inputGroup}>
            <Text style={[styles.label, globalStyles.regular]}>
              Cân nặng mục tiêu của bạn?
            </Text>

            <View
              style={[styles.inputRow, { justifyContent: "space-between" }]}
            >
              <Pressable
                style={[
                  styles.stepButton,
                  disableMinus && styles.stepButtonDisabled,
                ]}
                disabled={disableMinus}
                onPress={() => adjustTargetWeight(-1)}
              >
                <Ionicons
                  name="remove"
                  size={28}
                  color={disableMinus ? "#888" : "#fff"}
                />
              </Pressable>

              <Text style={[styles.weightText, globalStyles.semiBold]}>
                {currentTarget} kg
              </Text>

              <Pressable
                style={[
                  styles.stepButton,
                  disablePlus && styles.stepButtonDisabled,
                ]}
                disabled={disablePlus}
                onPress={() => adjustTargetWeight(1)}
              >
                <Ionicons
                  name="add"
                  size={28}
                  color={disablePlus ? "#888" : "#fff"}
                />
              </Pressable>
            </View>

            {!isTargetValid && (
              <Text style={styles.errorText}>
                {surveyData.goal === HealthGoal.LoseWeight
                  ? "Cân nặng mục tiêu phải thấp hơn cân nặng hiện tại."
                  : "Cân nặng mục tiêu phải cao hơn cân nặng hiện tại."}
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
    color: "#000000",
    marginBottom: 32,
  },
  formContainer: { gap: 24 },
  inputGroup: { gap: 8 },
  label: { fontSize: width * 0.04, color: "#4F4F4F" },
  inputRow: { flexDirection: "row", alignItems: "center", gap: 12 },
  input: {
    flex: 1,
    backgroundColor: "#F2F2F2",
    borderWidth: 1,
    borderColor: "#E0E0E0",
    borderRadius: 12,
    paddingHorizontal: 16,
    paddingVertical: 14,
    fontSize: width * 0.04,
  },
  unitButton: {
    backgroundColor: "#6C9C39",
    borderRadius: 12,
    paddingHorizontal: 20,
    paddingVertical: 14,
  },
  unitButtonText: { color: "#FFFFFF", fontSize: width * 0.04 },
  stepButton: {
    backgroundColor: "#6C9C39",
    width: 48,
    height: 48,
    borderRadius: 12,
    alignItems: "center",
    justifyContent: "center",
  },
  stepButtonDisabled: {
    backgroundColor: "#BDBDBD",
  },
  stepButtonText: {
    color: "#FFFFFF",
    fontSize: 24,
    fontWeight: "700",
  },
  weightText: { fontSize: width * 0.05, color: "#333" },
  errorText: { color: "red", fontSize: 14, paddingLeft: 4 },
});
