import React from "react";
import {
  Pressable,
  StyleSheet,
  Text,
  View,
  GestureResponderEvent,
  PressableProps,
  StyleProp,
  ViewStyle,
} from "react-native";
import { FONTS, globalStyles } from "../../constants/fonts";
import Color from "../../constants/color";

interface SCButtonProps extends PressableProps {
  title: string;
  onPress: (event: GestureResponderEvent) => void;
  color?: string; // text color
  bgColor?: string; // background color
  icon?: React.ReactNode; // truyền icon vào
  iconPos?: "left" | "right" | "top" | "bottom"; // vị trí icon
  variant?: "primary" | "outline"; // kiểu button
  fontFamily?: string; // font chữ (Montserrat-Regular, Montserrat-Bold, ...)
  borderRadius?: number; // bo góc
  height?: number; // chiều cao
  width?: number; // chiều rộng
  fontSize?: number; // kích thước chữ
  textAlign?: "left" | "center" | "right"; // căn chỉnh chữ
}

export default function SCButton({
  title,
  onPress,
  color,
  bgColor,
  icon,
  iconPos = "right",
  variant = "primary",
  fontFamily = FONTS.semiBold,
  borderRadius = 12,
  style,
  height = 48,
  width = 100,
  fontSize = 16,
  textAlign = "left",
  ...rest
}: SCButtonProps) {
  // style theo variant
  const variantStyles =
    variant === "primary"
      ? {
          backgroundColor: bgColor || Color.dark_green,
          textColor: color || Color.white,
          borderWidth: 0,
        }
      : {
          backgroundColor: bgColor || Color.white,
          textColor: color || Color.dark_green,
          borderWidth: 1,
        };

  return (
    <Pressable
  onPress={onPress}
  style={({ pressed }) =>
    [
      styles.button,
      {
        backgroundColor: variantStyles.backgroundColor,
        borderColor: Color.dark_green,
        borderWidth: variantStyles.borderWidth,
        borderRadius,
        opacity: pressed ? 0.8 : 1,
        height,
        width,
        flexDirection:
          iconPos === "top" || iconPos === "bottom" ? "column" : "row",
        justifyContent: "center",
        alignItems: "center",
      },
      ...(Array.isArray(style) ? style : style ? [style] : []),
    ] as StyleProp<ViewStyle>
  }
  {...rest}
>
  {/* Render icon và text theo vị trí */}
  {icon && (iconPos === "left" || iconPos === "top") && (
    <View style={iconPos === "top" ? { marginBottom: 0 } : { marginRight: 5 }}>
      {icon}
    </View>
  )}

  <Text
    style={[
      styles.text,
      {
        color: variantStyles.textColor,
        fontFamily: fontFamily || globalStyles.semiBold.fontFamily,
        fontSize,
        textAlign,
      },
    ]}
  >
    {title}
  </Text>

  {icon && (iconPos === "right" || iconPos === "bottom") && (
    <View style={iconPos === "bottom" ? { marginTop: 0 } : { marginLeft: 5 }}>
      {icon}
    </View>
  )}
</Pressable>

  );
}

const styles = StyleSheet.create({
  button: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    height: 48,
    paddingHorizontal: 12,
    gap: 5,
  },
  text: {
    maxWidth: "100%",
    textAlignVertical: "center",
  },
});
