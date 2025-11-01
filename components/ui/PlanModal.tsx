import SCButton from "@components/ui/SCButton";
import color from "@constants/color";
import { FONTS } from "@constants/fonts";
import AntDesign from "@expo/vector-icons/AntDesign";
import FontAwesome5 from "@expo/vector-icons/FontAwesome5";
import Ionicons from "@expo/vector-icons/Ionicons";
import React, { useEffect, useState } from "react";
import {
    ActivityIndicator,
    Alert,
    Modal,
    ScrollView,
    StyleSheet,
    Text,
    TextInput,
    TouchableOpacity,
    View,
} from "react-native";
import { HealthGoal } from "../../types/me";

export const healthGoalOptions = [
  { label: "Duy trì cân nặng và tăng cường dinh dưỡng", labelEN: "MaintainWeight", value: HealthGoal.MaintainWeight },
  { label: "Giảm cân", labelEN: "LoseWeight", value: HealthGoal.LoseWeight },
  { label: "Tăng cân", labelEN: "GainWeight", value: HealthGoal.GainWeight },
  { label: "Tăng cơ", labelEN: "GainMuscle", value: HealthGoal.GainMuscle },
];

interface PlanModalProps {
  visible: boolean;
  onClose: () => void;
  onSubmit: (
    weight: number,
    targetWeight: number,
    targetMonths: number,
    goal: HealthGoal
  ) => Promise<void>;
  isNewPlan?: boolean;
  currentWeight?: number;
  currentTargetWeight?: number;
  currentTargetMonths?: number;
  currentGoal?: HealthGoal;
}

export default function PlanModal({
  visible,
  onClose,
  onSubmit,
  isNewPlan = false,
  currentWeight = 0,
  currentTargetWeight = 0,
  currentTargetMonths = 1,
  currentGoal = HealthGoal.MaintainWeight,
}: PlanModalProps) {
  const [weight, setWeight] = useState<string>("");
  const [targetWeight, setTargetWeight] = useState<string>("");
  const [targetMonths, setTargetMonths] = useState<string>("");
  const [selectedGoal, setSelectedGoal] = useState<HealthGoal>(currentGoal);
  const [loading, setLoading] = useState<boolean>(false);

  // ✅ Initialize form khi modal mở
  useEffect(() => {
    if (visible) {
      if (isNewPlan) {
        // Tạo kế hoạch mới - reset form
        setWeight("");
        setTargetWeight("");
        setTargetMonths("1");
        setSelectedGoal(HealthGoal.MaintainWeight);
      } else {
        // Chỉnh sửa - load dữ liệu hiện tại
        setWeight(currentWeight.toString());
        setTargetWeight(currentTargetWeight.toString());
        setTargetMonths(currentTargetMonths.toString());
        setSelectedGoal(currentGoal);
      }
    }
  }, [visible, isNewPlan, currentWeight, currentTargetWeight, currentTargetMonths, currentGoal]);

  const validateForm = (): boolean => {
    const w = parseFloat(weight);
    const tw = parseFloat(targetWeight);
    const tm = parseInt(targetMonths);

    if (!weight || isNaN(w) || w <= 0) {
      Alert.alert("Lỗi", "Vui lòng nhập cân nặng hiện tại hợp lệ");
      return false;
    }

    if (!targetWeight || isNaN(tw) || tw <= 0) {
      Alert.alert("Lỗi", "Vui lòng nhập cân nặng mục tiêu hợp lệ");
      return false;
    }

    if (!targetMonths || isNaN(tm) || tm <= 0 || tm > 12) {
      Alert.alert("Lỗi", "Vui lòng nhập số tháng từ 1 đến 12");
      return false;
    }

    // ✅ Validation theo mục tiêu
    if (selectedGoal === HealthGoal.LoseWeight && tw >= w) {
      Alert.alert("Lỗi", "Cân nặng mục tiêu phải nhỏ hơn cân nặng hiện tại khi giảm cân");
      return false;
    }

    if (selectedGoal === HealthGoal.GainWeight && tw <= w) {
      Alert.alert("Lỗi", "Cân nặng mục tiêu phải lớn hơn cân nặng hiện tại khi tăng cân");
      return false;
    }

    return true;
  };

  const handleSubmit = async () => {
    if (!validateForm()) return;

    try {
      setLoading(true);
      await onSubmit(
        parseFloat(weight),
        parseFloat(targetWeight),
        parseInt(targetMonths),
        selectedGoal
      );
      onClose();
    } catch (error) {
      console.warn("Error submitting plan:", error);
    } finally {
      setLoading(false);
    }
  };

  const getGoalLabel = (goal: HealthGoal): string => {
    const found = healthGoalOptions.find((opt) => opt.value === goal);
    return found ? found.label : healthGoalOptions[0].label;
  };

  return (
    <Modal
      visible={visible}
      transparent={true}
      animationType="slide"
      onRequestClose={loading ? undefined : onClose}
    >
      <View style={styles.overlay}>
        <View style={styles.modalContainer}>
          {/* Header */}
          <View style={styles.header}>
            <Text style={styles.headerTitle}>
              {isNewPlan ? "Tạo kế hoạch mới" : "Chỉnh sửa kế hoạch"}
            </Text>
            {!loading && (
              <TouchableOpacity onPress={onClose} style={styles.closeButton}>
                <Ionicons name="close" size={24} color={color.dark_green} />
              </TouchableOpacity>
            )}
          </View>

          <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>
            {/* Current Weight */}
            <View style={styles.inputGroup}>
              <Text style={styles.label}>
                <FontAwesome5 name="weight" size={14} color={color.dark_green} /> Cân nặng hiện tại (kg)
              </Text>
              <TextInput
                style={styles.input}
                value={weight}
                onChangeText={setWeight}
                keyboardType="decimal-pad"
                placeholder="Nhập cân nặng hiện tại"
                placeholderTextColor={color.gray}
                editable={!loading}
              />
            </View>

            {/* Target Weight */}
            <View style={styles.inputGroup}>
              <Text style={styles.label}>
                <AntDesign name="export" size={14} color={color.dark_green} /> Cân nặng mục tiêu (kg)
              </Text>
              <TextInput
                style={styles.input}
                value={targetWeight}
                onChangeText={setTargetWeight}
                keyboardType="decimal-pad"
                placeholder="Nhập cân nặng mục tiêu"
                placeholderTextColor={color.gray}
                editable={!loading}
              />
            </View>

            {/* Target Months */}
            <View style={styles.inputGroup}>
              <Text style={styles.label}>
                <Ionicons name="timer-outline" size={16} color={color.dark_green} /> Số tháng (1-12)
              </Text>
              <TextInput
                style={styles.input}
                value={targetMonths}
                onChangeText={setTargetMonths}
                keyboardType="number-pad"
                placeholder="Nhập số tháng"
                placeholderTextColor={color.gray}
                editable={!loading}
              />
            </View>

            {/* Health Goal Selection */}
            <View style={styles.inputGroup}>
              <Text style={styles.label}>
                <AntDesign name="flag" size={14} color={color.dark_green} /> Mục tiêu sức khỏe
              </Text>
              {healthGoalOptions.map((option) => (
                <TouchableOpacity
                  key={option.value}
                  style={[
                    styles.goalOption,
                    selectedGoal === option.value && styles.goalOptionSelected,
                  ]}
                  onPress={() => !loading && setSelectedGoal(option.value)}
                  disabled={loading}
                >
                  <View style={styles.radioOuter}>
                    {selectedGoal === option.value && <View style={styles.radioInner} />}
                  </View>
                  <Text
                    style={[
                      styles.goalText,
                      selectedGoal === option.value && styles.goalTextSelected,
                    ]}
                  >
                    {option.label}
                  </Text>
                </TouchableOpacity>
              ))}
            </View>

            {/* Submit Button */}
            <View style={styles.buttonContainer}>
              {loading ? (
                <View style={styles.loadingContainer}>
                  <ActivityIndicator size="large" color={color.dark_green} />
                  <Text style={styles.loadingText}>Đang cập nhật...</Text>
                </View>
              ) : (
                <>
                  <SCButton
                    title={isNewPlan ? "Tạo kế hoạch" : "Cập nhật"}
                    bgColor={color.dark_green}
                    color={color.white}
                    borderRadius={12}
                    height={50}
                    fontSize={16}
                    fontFamily={FONTS.semiBold}
                    onPress={handleSubmit}
                  />
                  <SCButton
                    title="Hủy"
                    bgColor={color.white}
                    color={color.dark_green}
                    borderRadius={12}
                    height={50}
                    fontSize={16}
                    fontFamily={FONTS.medium}
                    onPress={onClose}
                    style={{ marginTop: 12, marginBottom: 38, borderWidth: 1, borderColor: color.dark_green }}
                  />
                </>
              )}
            </View>
          </ScrollView>
        </View>
      </View>
    </Modal>
  );
}

const styles = StyleSheet.create({
  overlay: {
    flex: 1,
    backgroundColor: "rgba(0, 0, 0, 0.5)",
    justifyContent: "flex-end",
  },
  modalContainer: {
    backgroundColor: color.white,
    borderTopLeftRadius: 24,
    borderTopRightRadius: 24,
    maxHeight: "90%",
    paddingTop: 20,
  },
  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingHorizontal: 20,
    paddingBottom: 16,
    borderBottomWidth: 1,
    borderBottomColor: color.border,
  },
  headerTitle: {
    fontSize: 20,
    fontFamily: FONTS.bold,
    color: color.dark_green,
  },
  closeButton: {
    padding: 4,
  },
  content: {
    paddingHorizontal: 20,
    paddingTop: 20,
  },
  inputGroup: {
    marginBottom: 20,
  },
  label: {
    fontSize: 14,
    fontFamily: FONTS.semiBold,
    color: color.dark_green,
    marginBottom: 8,
  },
  input: {
    borderWidth: 1,
    borderColor: color.border,
    borderRadius: 8,
    paddingHorizontal: 16,
    paddingVertical: 12,
    fontSize: 16,
    fontFamily: FONTS.regular,
    color: color.dark_green,
    backgroundColor: color.white,
  },
  goalOption: {
    flexDirection: "row",
    alignItems: "center",
    paddingVertical: 12,
    paddingHorizontal: 16,
    borderWidth: 1,
    borderColor: color.border,
    borderRadius: 8,
    marginBottom: 8,
    backgroundColor: color.white,
  },
  goalOptionSelected: {
    borderColor: color.dark_green,
    backgroundColor: color.background,
  },
  radioOuter: {
    width: 20,
    height: 20,
    borderRadius: 10,
    borderWidth: 2,
    borderColor: color.dark_green,
    justifyContent: "center",
    alignItems: "center",
    marginRight: 12,
  },
  radioInner: {
    width: 10,
    height: 10,
    borderRadius: 5,
    backgroundColor: color.dark_green,
  },
  goalText: {
    flex: 1,
    fontSize: 14,
    fontFamily: FONTS.regular,
    color: color.dark_green,
  },
  goalTextSelected: {
    fontFamily: FONTS.semiBold,
  },
  buttonContainer: {
    paddingTop: 8,
    paddingBottom: 24,
  },
  loadingContainer: {
    alignItems: "center",
    justifyContent: "center",
    paddingVertical: 32,
  },
  loadingText: {
    marginTop: 12,
    fontSize: 14,
    fontFamily: FONTS.medium,
    color: color.dark_green,
  },
});