import React from "react";
import {
  GestureResponderEvent,
  Pressable,
  PressableProps,
  StyleProp,
  StyleSheet,
  Text,
  View,
  ViewStyle,
} from "react-native";
import Color from "../../constants/color";
import { FONTS, globalStyles } from "../../constants/fonts";

interface SCButtonProps extends PressableProps {
  title?: string;
  onPress: (event: GestureResponderEvent) => void;
  color?: string; // text color
  bgColor?: string; // background color
  gradientMode?: "vertical" | "horizontal"; // gradient direction
  gradient?: { start: string; end: string }; // gradient background
  icon?: React.ReactNode; // icon component
  iconPos?: "left" | "right" | "top" | "bottom"; // icon position
  variant?: "primary" | "outline"; // button type
  fontFamily?: string;
  borderRadius?: number;
  height?: number;
  width?: number | string;
  fontSize?: number;
  textAlign?: "left" | "center" | "right";
  gap?: number;
}

export default function SCButton({
  title,
  onPress,
  color,
  bgColor,
  icon,
  gap = 5,
  iconPos = "right",
  variant = "primary",
  fontFamily = FONTS.semiBold,
  borderRadius = 12,
  style,
  height = 48,
  width = "100%",
  fontSize = 16,
  textAlign = "left",
  gradientMode = "horizontal",
  gradient,
  ...rest
}: SCButtonProps) {
  // styles theo variant
  const variantStyles =
    variant === "primary"
      ? {
          backgroundColor: bgColor || Color.dark_green,
          textColor: color || Color.white,
          borderWidth: 0,
        }
      : {
          backgroundColor: bgColor || Color.transparent,
          textColor: color || Color.dark_green,
          borderWidth: 1,
        };

  const getButtonStyle = (pressed: boolean): StyleProp<ViewStyle> => [
    styles.button,
    {
      backgroundColor: variantStyles.backgroundColor,
      borderColor: Color.dark_green,
      borderWidth: variantStyles.borderWidth,
      borderRadius,
      opacity: pressed ? 0.8 : 1,
      height,
      width,
      gap,
      flexDirection:
        iconPos === "top" || iconPos === "bottom" ? "column" : "row",
      justifyContent: "center", // icon + text hay chỉ icon
      alignItems: "center",
    } as ViewStyle,
    ...(
      Array.isArray(style)
        ? style.filter((s) => typeof s !== "function")
        : style && typeof style !== "function"
        ? [style]
        : []
    ),
  ];

  return (
    <Pressable
      onPress={onPress}
      style={({ pressed }) => getButtonStyle(pressed)}
      {...rest}
    >
      {/* icon bên trái / trên */}
      {icon && (iconPos === "left" || iconPos === "top") && (
        <View
          style={
            iconPos === "top"
              ? { marginBottom: title ? 5 : 0 }
              : { marginRight: title ? 5 : 0 }
          }
        >
          {icon}
        </View>
      )}

      {/* text */}
      {title && (
        <Text
          style={{
            color: variantStyles.textColor,
            fontFamily: fontFamily || globalStyles.semiBold.fontFamily,
            width: "80%",
            fontSize,
            textAlign,
          }}
        >
          {title}
        </Text>
      )}

      {/* icon bên phải / dưới */}
      {icon && (iconPos === "right" || iconPos === "bottom") && (
        <View
          style={
            iconPos === "bottom"
              ? { marginTop: title ? 5 : 0 }
              : { marginLeft: title ? 5 : 0 }
          }
        >
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
    paddingHorizontal: 12
  },
  text: {
    maxWidth: "100%",
    textAlignVertical: "center",
  },
});
