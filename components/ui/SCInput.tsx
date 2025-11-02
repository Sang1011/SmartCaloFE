import * as React from "react";
import {
  Pressable,
  StyleSheet,
  TextInput,
  TextInputProps,
  TouchableOpacity,
  View,
} from "react-native";
import Color from "../../constants/color";
import { FONTS } from "../../constants/fonts";

export interface SCInputProps extends TextInputProps {
  placeholder?: string;
  value?: string;
  onChangeText?: (text: string) => void;
  variant?: "text" | "password" | "email" | "number";
  fontFamily?: string;
  fontSize?: number;
  icon?: React.ReactNode;
  color?: string; // Màu chữ (text color)
  bgColor?: string; // Màu nền (background color) của container
  borderColor?: string;
  height?: number;
  width?: number;
  disabled?: boolean;
  // Icon cho toggle password (EyeIcon và EyeOffIcon)
  eyeIcon?: React.ReactNode;
  eyeOffIcon?: React.ReactNode;
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
  disabled = false,
  eyeIcon,
  eyeOffIcon,
  ...rest
}: SCInputProps) {
  const inputRef = React.useRef<TextInput>(null);
  const [isPasswordVisible, setIsPasswordVisible] = React.useState(false);

  const handlePress = () => {
    inputRef.current?.focus();
  };

  const togglePasswordVisibility = () => {
    setIsPasswordVisible(!isPasswordVisible);
  };

  return (
    <Pressable
      style={[
        styles.container,
        {
          height: height || 50,
          width: width,
          backgroundColor: bgColor || Color.white,
          borderColor: borderColor || Color.light_gray,
        },
      ]}
      onPress={handlePress}
    >
      {icon && (
        <>
          <View style={styles.iconContainer}>{icon}</View>
          <View style={styles.divider}></View>
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
        editable={!disabled}
        autoCapitalize={variant === "email" ? "none" : "sentences"}
        autoCorrect={variant === "email" ? false : true}
        placeholder={placeholder}
        value={value}
        placeholderTextColor={Color.light_gray}
        onChangeText={onChangeText}
        secureTextEntry={variant === "password" && !isPasswordVisible}
        ref={inputRef}
        style={[
          styles.input,
          {
            fontFamily: fontFamily,
            fontSize: fontSize,
            color: color || Color.black,
          },
          { height: "100%" },
        ]}
        {...rest}
      />

      {/* Toggle Password Icon */}
      {variant === "password" && (
        <TouchableOpacity
          onPress={togglePasswordVisibility}
          style={styles.eyeIconContainer}
          hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}
        >
          {isPasswordVisible ? eyeOffIcon : eyeIcon}
        </TouchableOpacity>
      )}
    </Pressable>
  );
}

const styles = StyleSheet.create({
  container: {
    paddingHorizontal: 12,
    borderWidth: 1,
    borderRadius: 12,
    flexDirection: "row",
    alignItems: "center",
    gap: 10,
  },
  input: {
    flex: 1,
    color: Color.black,
    paddingVertical: 0,
  },
  iconContainer: {
    justifyContent: "center",
    alignItems: "center",
  },
  divider: {
    width: 1,
    backgroundColor: Color.light_gray,
    height: "65%",
    alignSelf: "center",
  },
  eyeIconContainer: {
    justifyContent: "center",
    alignItems: "center",
    padding: 4,
  },
});