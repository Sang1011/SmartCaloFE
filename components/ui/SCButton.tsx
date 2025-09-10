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
  iconPos?: "left" | "right"; // vị trí icon
  variant?: "primary" | "outline"; // kiểu button
  fontFamily?: string; // font chữ (Montserrat-Regular, Montserrat-Bold, ...)
  borderRadius?: number; // bo góc
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
          },
          ...(Array.isArray(style) ? style : style ? [style] : []),
        ] as StyleProp<ViewStyle>
      }
      {...rest}
    >
      {icon && iconPos === "left" && <View>{icon}</View>}
      <Text
        style={[
          styles.text,
          {
            color: variantStyles.textColor,
            fontFamily: fontFamily || globalStyles.semiBold.fontFamily,
          },
        ]}
      >
        {title}
      </Text>
      {icon && iconPos === "right" && <View>{icon}</View>}
    </Pressable>
  );
}

const styles = StyleSheet.create({
  button: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    paddingVertical: 14,
    paddingHorizontal: 24,
    gap: 5,
  },
  text: {
    fontSize: 16,
  },
});
