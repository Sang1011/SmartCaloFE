import AntDesign from "@expo/vector-icons/AntDesign";
import React from "react";
import { Dimensions, StyleSheet, View } from "react-native";

import SCButton from "../../components/ui/SCButton";
import color from "../../constants/color";
import { FONTS } from "../../constants/fonts";
import ProgressBar from "./ProgressBar";

interface SurveyLayoutProps {
  children: React.ReactNode;
  currentStep: number;
  totalSteps: number;
  onBack: () => void;
  onNext: () => void;
  isFinalStep?: boolean;
}

const { width } = Dimensions.get("window");

export default function SurveyLayout({
  children,
  currentStep,
  totalSteps,
  onBack,
  onNext,
  isFinalStep = false,
}: SurveyLayoutProps) {
  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <ProgressBar currentStep={currentStep} totalSteps={totalSteps} />
      </View>

      <View style={styles.content}>{children}</View>

      <View style={styles.footer}>
        {currentStep > 1 && (
          <SCButton
            title=""
            onPress={onBack}
            style={styles.backButton}
            icon={<AntDesign name="left" size={20} color={color.dark_green} />}
          />
        )}
        <SCButton
          title={isFinalStep ? "Hoàn thành" : "Tiếp tục"}
          onPress={onNext}
          fontFamily={FONTS.semiBold}
          style={[styles.nextButton, currentStep === 1 && { width: "100%" }]}
          iconPos="right"
          icon={
            !isFinalStep && (
              <AntDesign name="right" size={16} color={color.white} />
            )
          }
        />
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingHorizontal: 20,
    paddingVertical: 10,
  },
  header: {
    flex: 0.1,
    justifyContent: "center",
  },
  content: {
    flex: 0.8,
  },
  footer: {
    flex: 0.1,
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    gap: 15,
  },
  backButton: {
    width: 60,
    backgroundColor: color.light_gray,
  },
  nextButton: {
    flex: 1,
  },
});
