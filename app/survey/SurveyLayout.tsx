import AntDesign from "@expo/vector-icons/AntDesign";
import React from "react";
import { ScrollView, StyleSheet, View } from "react-native";
import { GestureHandlerRootView } from "react-native-gesture-handler";

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
  isNextDisabled?: boolean;
}

export default function SurveyLayout({
  children,
  currentStep,
  totalSteps,
  onBack,
  onNext,
  isFinalStep = false,
  isNextDisabled = false,
}: SurveyLayoutProps) {
  return (
    <GestureHandlerRootView style={{ flex: 1 }}>
      <View style={styles.container}>
        <View style={styles.header}>
          <ProgressBar currentStep={currentStep} totalSteps={totalSteps} />
        </View>

        <ScrollView
          style={styles.content}
          contentContainerStyle={styles.contentContainer}
          showsVerticalScrollIndicator={false}
        >
          {children}
        </ScrollView>

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
            onPress={isNextDisabled ? () => {} : onNext}
            fontFamily={FONTS.semiBold}
            style={[
              styles.nextButton,
              currentStep === 1 && { width: "100%" },
              isNextDisabled && styles.disabledButton,
            ]}
            iconPos="right"
            icon={
              !isFinalStep && (
                <AntDesign name="right" size={16} color={color.white} />
              )
            }
          />
        </View>
      </View>
    </GestureHandlerRootView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingHorizontal: 20,
    paddingVertical: 10,
  },
  header: {
  },
  content: {
    flex: 1,
    marginTop: 10
  },
  contentContainer: {
    flexGrow: 1,
    justifyContent: "center",
  },
  footer: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingTop: 10,
    borderTopWidth: 1,
    borderTopColor: "#F2F2F2",
  },
  backButton: {
    width: "20%",
    backgroundColor: "transparent",
    borderWidth: 1,
    borderColor: color.dark_green,
  },
  nextButton: {
    width: "78%",
  },
  disabledButton: {
    backgroundColor: "#564d4dd2",
    opacity: 0.7,
  },
});