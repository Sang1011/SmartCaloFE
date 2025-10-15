import * as React from "react";
import {
  Pressable,
  StyleSheet,
  TextInput,
  TextInputProps,
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
}

export default function SCInput({
  placeholder,
  value,
  onChangeText,
  variant,
  fontFamily = FONTS.regular,
  fontSize,
  icon,
  color, // Màu chữ
  bgColor, // Màu nền container
  borderColor,
  height,
  width,
  disabled = false,
  ...rest
}: SCInputProps) {
  const inputRef = React.useRef<TextInput>(null);

  const handlePress = () => {
    inputRef.current?.focus();
  };
  return (
    // 1. Áp dụng style màu sắc và kích thước vào Container
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
        secureTextEntry={variant === "password"}
        ref={inputRef}
        style={[
          styles.input,
          {
            fontFamily: fontFamily,
            fontSize: fontSize,
            // 2. Sửa lỗi: Đảm bảo màu chữ luôn là Color.black nếu không được truyền
            color: color || Color.black,
          },
          // 3. Đảm bảo TextInput lấp đầy chiều cao của container
          { height: '100%' } 
        ]}
        {...rest}
      />
    </Pressable>
  );
}

const styles = StyleSheet.create({
  container: {
    // ❌ Đã loại bỏ các giá trị mặc định cho height, bgColor, borderColor ở đây
    paddingHorizontal: 12,
    borderWidth: 1,
    borderRadius: 12,
    // Đảm bảo không có màu chữ ở đây
    flexDirection: "row",
    alignItems: "center", 
    gap: 10,
  },
  input: {
    flex: 1, 
    // Mặc định màu chữ tối (dù là text thường hay ký tự bảo mật)
    color: Color.black, 
    // Quan trọng: Bỏ padding dọc vì đã dùng height: '100%' ở style inline
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
});