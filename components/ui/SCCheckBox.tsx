import Color from "@/constants/color";
import React, { useState } from "react";
import { Pressable, StyleSheet, Text, View } from "react-native";
import Entypo from "@expo/vector-icons/Entypo";
import { FONTS } from "@/constants/fonts";

export interface SCCheckBoxProps {
  label?: string;
  labelPos?: "left" | "right";
  onChange?: (checked: boolean) => void;
  width?: number | string;
  height?: number | string;
  color?: string;
  checkedColor?: string;
  fontFamily?: string;
  checkSize?: number;
  fontSize?: number;
}

export default function SCCheckBox({
  label,
  labelPos = "left",
  onChange,
  width = 18,
  height = 18,
  fontSize = 14,
  color = Color.black_50,
  checkedColor = Color.checkbox,
  fontFamily = FONTS.regular,
  checkSize = 12
}: SCCheckBoxProps) {
  const [checked, setChecked] = useState(false);

  const toggleCheck = () => {
    setChecked(!checked);
    onChange && onChange(!checked);
  };

  return (
    <View style={[styles.container, { flexDirection: labelPos === "left" ? "row-reverse" : "row" }]}>
      {/* Ô vuông checkbox */}
      <Pressable
        style={[
          styles.checkbox,
          {
            width: typeof width === "number" ? width : (typeof width === "string" && width.endsWith("%") ? width as `${number}%` : undefined),
            height: typeof height === "number" ? height : (typeof height === "string" && height.endsWith("%") ? height as `${number}%` : undefined),
            borderColor: checked ? checkedColor : Color.black_50,
          },
        ]}
        onPress={toggleCheck}
      >
        {checked && (
          <View style={[styles.checkmark, { backgroundColor: checkedColor }]}>
            <Entypo
              name="check"
              size={checkSize}
              color={Color.white}
              style={styles.icon}
            />
          </View>
        )}
      </Pressable>

      {/* Label */}
      {label && (
        <Text
          style={{
            fontFamily,
            color: checked ? checkedColor : (color ?? Color.black_50),
            marginLeft: labelPos === "right" ? 6 : 0,
            marginRight: labelPos === "left" ? 6 : 0,
            flexShrink: 1, // Giúp label co giãn trong row
            fontSize
          }}
        >
          {label}
        </Text>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    alignItems: "center",
    marginVertical: 5,
  },
  checkbox: {
    borderWidth: 2,
    justifyContent: "center",
    alignItems: "center",
    borderRadius: 6,
  },
  checkmark: {
    borderRadius: 4,
  },
  icon: {
    transform: [{ scaleY: 0.8 }],
  },
});
