import SCButton from "@components/ui/SCButton";
import SCInput from "@components/ui/SCInput";
import color from "@constants/color";
import { FONTS, globalStyles } from "@constants/fonts";
import MaterialIcons from "@expo/vector-icons/MaterialIcons";
import { resetPasswordThunk } from "@features/auth";
import Feather from "@node_modules/@expo/vector-icons/Feather";
import { useSelector } from "@node_modules/react-redux/dist/react-redux";
import { RootState } from "@redux";
import { useAppDispatch, useAppSelector } from "@redux/hooks";
import { navigateCustom } from "@utils/navigation";
import { Image } from "expo-image";
import React, { useState } from "react";
import { ActivityIndicator, Alert, StyleSheet, Text, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

export default function ResetPasswordScreen() {
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const dispatch = useAppDispatch();
  const resetToken = useAppSelector((state) => state.auth.resetToken);
  const { loading } = useSelector((state: RootState) => state.auth);

  const handleResetPassword = async () => {
    if (!password || !confirmPassword) {
      Alert.alert("Lỗi", "Vui lòng nhập đầy đủ mật khẩu");
      return;
    }

    if (password.length < 6) {
      Alert.alert("Lỗi", "Mật khẩu phải có ít nhất 6 ký tự");
      return;
    }

    if (password !== confirmPassword) {
      Alert.alert("Lỗi", "Mật khẩu xác nhận không khớp");
      return;
    }

    try {
      if (!resetToken) {
        Alert.alert(
          "Lỗi",
          "Không tìm thấy mã xác thực, vui lòng thử lại quá trình quên mật khẩu"
        );
        navigateCustom("/login");
      }

      const result = await dispatch(
        resetPasswordThunk({ resetToken, newPassword: password })
      ).unwrap();

      if (result?.success) {
        Alert.alert("Thành công", "Đặt lại mật khẩu thành công!");
        navigateCustom("/login");
      } else {
        Alert.alert("Lỗi", "Không thể đặt lại mật khẩu, vui lòng thử lại");
      }
    } catch (error: any) {
      Alert.alert("Lỗi", error || "Không thể đặt lại mật khẩu");
    }
  };

  return (
    <SafeAreaView style={styles.screen}>
      {loading ? (
        <View
          style={{ flex: 1, justifyContent: "center", alignItems: "center" }}
        >
          <Text
            style={{
              fontSize: 24,
              fontFamily: FONTS.bold,
              color: color.dark_green,
            }}
          >
            LOADING...
          </Text>
          <ActivityIndicator size="large" color={color.dark_green} />
        </View>
      ) : (
        <>
          <Image
            source={require("../assets/images/logo.png")}
            style={styles.logo}
            contentFit="contain"
          />

          <Text style={[styles.title, globalStyles.semiBold]}>
            Đặt lại mật khẩu
          </Text>
          <Text style={styles.desc}>
            Nhập mật khẩu mới để hoàn tất quá trình đặt lại
          </Text>

          <View style={styles.form}>
            <SCInput
              fontFamily={FONTS.regular}
              placeholder="Nhập mật khẩu mới"
              variant="password"
              icon={
                <MaterialIcons name="lock-outline" size={14} color="black" />
              }
              onChangeText={setPassword}
              eyeIcon={<Feather name="eye" size={20} color={color.gray} />}
              eyeOffIcon={
                <Feather name="eye-off" size={20} color={color.gray} />
              }
              value={password}
            />
            <SCInput
              fontFamily={FONTS.regular}
              placeholder="Xác nhận mật khẩu mới"
              variant="password"
              icon={<MaterialIcons name="lock" size={14} color="black" />}
              onChangeText={setConfirmPassword}
              eyeIcon={<Feather name="eye" size={20} color={color.gray} />}
              eyeOffIcon={
                <Feather name="eye-off" size={20} color={color.gray} />
              }
              value={confirmPassword}
            />
            <View style={styles.button}>
              <SCButton
                title="Đặt lại mật khẩu"
                onPress={handleResetPassword}
              />
            </View>
          </View>
        </>
      )}
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  screen: {
    flex: 1,
    backgroundColor: color.white,
    alignItems: "center",
    paddingHorizontal: 20,
  },
  logo: {
    marginTop: 40,
    width: "30%",
    aspectRatio: 1,
  },
  title: {
    fontSize: 24,
    color: color.dark_green,
    marginTop: 10,
  },
  desc: {
    fontSize: 12,
    fontFamily: FONTS.regular,
    textAlign: "center",
    color: color.black,
    marginVertical: 8,
    width: "90%",
  },
  form: {
    width: "100%",
    marginTop: 16,
    gap: 12,
  },
  button: {
    width: "90%",
    alignSelf: "center",
    marginTop: 24,
  },
  back: {
    color: color.dark_green,
    fontFamily: FONTS.medium,
    fontSize: 14,
    marginTop: 20,
  },
});
