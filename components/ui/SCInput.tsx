import Color from "../../constants/color";
import { FONTS } from "../../constants/fonts";
import * as React from "react";
import {
  TextInput,
  TextInputProps,
  StyleSheet,
  View,
  Pressable,
} from "react-native";

export interface SCInputProps extends TextInputProps {
  placeholder?: string;
  value?: string;
  onChangeText?: (text: string) => void;
  variant?: "text" | "password" | "email" | "number";
  fontFamily?: string;
  fontSize?: number;
  icon?: React.ReactNode;
  color?: string;
  bgColor?: string;
  borderColor?: string;
  height?: number;
  width?: number;
}

export default function SCInput({
  placeholder,
  value,
  onChangeText,
  variant,
  fontFamily = FONTS.regular,
  fontSize,
  icon,
  color,
  bgColor,
  borderColor,
  height,
  width,
  ...rest
}: SCInputProps) {
  const inputRef = React.useRef<TextInput>(null);

  const handlePress = () => {
    inputRef.current?.focus();
  };
  return (
    <Pressable style={styles.container} onPress={() => handlePress()}>
      {icon && (
        <>
          {" "}
          <View style={styles.iconContainer}>{icon}</View>{" "}
          <View style={styles.divider}></View>{" "}
        </>
      )}

      <TextInput
        keyboardType={
          variant === "number"
            ? "numeric"
            : variant === "email"
            ? "email-address"
            : "default"
        }
        autoCapitalize={variant === "email" ? "none" : "sentences"}
        autoCorrect={variant === "email" ? false : true}
        placeholder={placeholder}
        value={value}
        placeholderTextColor={Color.light_gray}
        onChangeText={onChangeText}
        secureTextEntry={variant === "password"}
        ref={inputRef}
        style={[
          styles.input,
          {
            fontFamily: fontFamily,
            fontSize: fontSize,
            color: color,
            backgroundColor: bgColor,
            borderColor: borderColor,
            height: height,
            width: width,
          },
        ]}
        {...rest}
      />
    </Pressable>
  );
}

const styles = StyleSheet.create({
  container: {
    height: 50,
    paddingVertical: 16,
    paddingHorizontal: 12,
    borderWidth: 1,
    borderRadius: 12,
    color: Color.black,
    backgroundColor: Color.white,
    borderColor: Color.light_gray,
    display: "flex",
    flexDirection: "row",
    justifyContent: "space-around",
    gap: 10,
  },
  input: {
    width: "95%",
  },
  iconContainer: {
    width: "5%",
    justifyContent: "center",
    alignItems: "center",
  },
  divider: {
    width: 1,
    backgroundColor: Color.light_gray,
    height: "100%",
    alignSelf: "center",
  },
});
