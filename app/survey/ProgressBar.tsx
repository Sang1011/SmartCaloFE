import React from "react";
import { StyleSheet, View } from "react-native";

interface ProgressBarProps {
  totalSteps: number;
  currentStep: number;
}

export default function ProgressBar({
  totalSteps,
  currentStep,
}: ProgressBarProps) {
  return (
    <View style={styles.container}>
      {Array.from({ length: totalSteps }).map((_, index) => (
        <View
          key={index}
          style={[
            styles.segment,
            index < currentStep ? styles.activeSegment : styles.inactiveSegment,
          ]}
        />
      ))}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flexDirection: "row",
    height: 6,
    borderRadius: 3,
    overflow: "hidden",
    gap: 5,
  },
  segment: {
    flex: 1,
    height: "100%",
    borderRadius: 3,
  },
  activeSegment: {
    backgroundColor: "#2CD9A1",
  },
  inactiveSegment: {
    backgroundColor: "#EDEDED",
  },
});
