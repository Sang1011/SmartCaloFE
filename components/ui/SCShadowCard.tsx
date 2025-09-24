import React, { ReactNode } from "react";
import { View, StyleSheet, ViewStyle } from "react-native";

interface SCShadowCardProps {
  children?: ReactNode;
  style?: ViewStyle;
  shadowColor?: string;
  shadowOffset?: { width: number; height: number };
  shadowOpacity?: number;
  shadowRadius?: number;
}

export default function SCShadowCard({
  children,
  style,
  shadowColor = "#000",
  shadowOffset = { width: 0, height: 4 },
  shadowOpacity = 0.15,
  shadowRadius = 6,
}: SCShadowCardProps) {
  return (
    <View
      style={[
        styles.card,
        {
          shadowColor,
          shadowOffset,
          shadowOpacity,
          shadowRadius,
        },
        style,
      ]}
    >
      {children}
    </View>
  );
}

const styles = StyleSheet.create({
  card: {
    backgroundColor: "white",
    borderRadius: 12,
    padding: 16,
  },
});
