import color from "@constants/color";
import React, { useState } from "react";
import {
  Dimensions,
  Pressable,
  StyleSheet,
  Text,
  TextInput,
  View,
} from "react-native";
import { globalStyles } from "../../constants/fonts";
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
  });

  const handleUpdateHeight = (heightStr: string) => {
    // Cập nhật giá trị người dùng nhập
    const parsed = parseFloat(heightStr);

    updateSurveyData((prev) => ({
      ...prev,
      height: heightStr === "" ? undefined : parsed,
    }));

    // Kiểm tra hợp lệ
    if (heightStr === "" || isNaN(parsed) || parsed <= 0) {
      setErrors((prev) => ({ ...prev, height: true }));
    } else {
      setErrors((prev) => ({ ...prev, height: false }));
    }
  };

  const handleUpdateWeight = (weightStr: string) => {
    const parsed = parseFloat(weightStr);

    updateSurveyData((prev) => ({
      ...prev,
      weight: weightStr === "" ? undefined : parsed,
    }));

    if (weightStr === "" || isNaN(parsed) || parsed <= 0) {
      setErrors((prev) => ({ ...prev, weight: true }));
    } else {
      setErrors((prev) => ({ ...prev, weight: false }));
    }
  };

  return (
    <View style={styles.container}>
      <Text style={[styles.title, globalStyles.extraBold]}>
        Chỉ thêm vài câu hỏi nữa.
      </Text>

      <View style={styles.formContainer}>
        {/* Height Input */}
        <View style={styles.inputGroup}>
          <Text style={[styles.label, globalStyles.regular]}>
            Chiều cao của bạn ?
          </Text>
          <View style={styles.inputRow}>
            <TextInput
              style={[styles.input, globalStyles.semiBold]}
              value={
                surveyData.height !== undefined
                  ? surveyData.height.toString()
                  : ""
              }
              onChangeText={handleUpdateHeight}
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

        {/* Weight Input */}
        <View style={styles.inputGroup}>
          <Text style={[styles.label, globalStyles.regular]}>
            Cân nặng của bạn ?
          </Text>
          <View style={styles.inputRow}>
            <TextInput
              style={[styles.input, globalStyles.semiBold]}
              value={
                surveyData.weight !== undefined
                  ? surveyData.weight.toString()
                  : ""
              }
              onChangeText={handleUpdateWeight}
              keyboardType="numeric"
              placeholderTextColor={color.black_50}
              placeholder="Nhập cân nặng"
            />
            <Pressable style={styles.unitButton}>
              <Text style={[styles.unitButtonText, globalStyles.bold]}>kg</Text>
            </Pressable>
          </View>
          {errors.weight && (
            <Text style={styles.errorText}>Vui lòng nhập cân nặng hợp lệ</Text>
          )}
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
    marginBottom: 32,
  },
  formContainer: {
    gap: 24,
  },
  inputGroup: {
    gap: 8,
  },
  label: {
    fontSize: width * 0.04,
    color: "#4F4F4F",
  },
  inputRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: 12,
  },
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
    alignSelf: "stretch",
    justifyContent: "center",
  },
  unitButtonText: {
    color: "#FFFFFF",
    fontSize: width * 0.04,
  },
  errorText: {
    color: "red",
    fontSize: 14,
    paddingLeft: 4,
  },
});
