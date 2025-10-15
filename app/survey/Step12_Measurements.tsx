import { setCredentials } from "@features/auth";
import { RootState } from "@redux";
import { useAppDispatch, useAppSelector } from "@redux/hooks";
import React from "react";
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
  const user = useAppSelector((state: RootState) => state.auth.user);
  const dispatch = useAppDispatch();

  const handleUpdateHeight = (heightStr: string) => {
    if (/^\d*\.?\d*$/.test(heightStr)) {
      const height = heightStr ? parseFloat(heightStr) : undefined;
      updateSurveyData((prev) => ({ ...prev, height }));

      if (user && height !== undefined) {
        dispatch(
          setCredentials({
            ...user,
            height,
          })
        );
      }
    }
  };

  const handleUpdateWeight = (weightStr: string) => {
    if (/^\d*\.?\d*$/.test(weightStr)) {
      const weight = weightStr ? parseFloat(weightStr) : undefined;
      updateSurveyData((prev) => ({ ...prev, weight }));

      if (user && weight !== undefined) {
        dispatch(
          setCredentials({
            ...user,
            weight,
          })
        );
      }
    }
  };

  const showHeightError = surveyData.height === undefined;
  const showWeightError = surveyData.weight === undefined;

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
              value={surveyData.height?.toString() ?? ""}
              onChangeText={handleUpdateHeight}
              keyboardType="numeric"
              placeholder="Nhập chiều cao"
              placeholderTextColor="#BDBDBD"
            />
            <Pressable style={styles.unitButton}>
              <Text style={[styles.unitButtonText, globalStyles.bold]}>cm</Text>
            </Pressable>
          </View>
          {showHeightError && (
            <Text style={styles.errorText}>Vui lòng nhập chiều cao</Text>
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
              value={surveyData.weight?.toString() ?? ""}
              onChangeText={handleUpdateWeight}
              keyboardType="numeric"
              placeholder="Nhập cân nặng"
              placeholderTextColor="#BDBDBD"
            />
            <Pressable style={styles.unitButton}>
              <Text style={[styles.unitButtonText, globalStyles.bold]}>kg</Text>
            </Pressable>
          </View>
          {showWeightError && (
            <Text style={styles.errorText}>Vui lòng nhập cân nặng</Text>
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
