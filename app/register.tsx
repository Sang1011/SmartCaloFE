import SCButton from "@components/ui/SCButton";
import SCInput from "@components/ui/SCInput";
import color from "@constants/color";
import { FONTS, globalStyles } from "@constants/fonts";
import Fontisto from "@expo/vector-icons/Fontisto";
import MaterialIcons from "@expo/vector-icons/MaterialIcons";
import { navigateCustom } from "@utils/navigation";
import { Image } from "expo-image";
import React, { useState } from "react";
import { Alert, StyleSheet, Text, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

export default function RegisterScreen() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPass, setConfirmPass] = useState("");

  const handleRegister = () => {
    if (!email || !password || !confirmPass) {
      Alert.alert("Thông báo", "Vui lòng nhập đầy đủ thông tin");
      return;
    }
    if (password !== confirmPass) {
      Alert.alert("Lỗi", "Mật khẩu xác nhận không trùng khớp");
      return;
    }

    // TODO: xử lý đăng ký tài khoản
    Alert.alert("Thành công", "Đăng ký thành công!");
    navigateCustom("/login");
  };

  return (
    <SafeAreaView style={styles.screen} edges={["top", "left", "right", "bottom"]}>
      <Image
        source={require("../assets/images/logo.png")}
        style={styles.logo}
        contentFit="contain"
        transition={500}
      />
      <Text style={[styles.title, globalStyles.semiBold]}>Đăng ký</Text>

      <View style={styles.form}>
        <View style={styles.inputContainer}>
          <SCInput
            fontFamily={FONTS.regular}
            placeholder="Nhập email"
            variant="email"
            icon={<Fontisto name="email" size={12} color="black" />}
            onChangeText={setEmail}
            value={email}
          />
          <SCInput
            fontFamily={FONTS.regular}
            placeholder="Nhập mật khẩu"
            variant="password"
            icon={<MaterialIcons name="password" size={12} color="black" />}
            secureTextEntry
            onChangeText={setPassword}
            value={password}
          />
          <SCInput
            fontFamily={FONTS.regular}
            placeholder="Xác nhận mật khẩu"
            variant="password"
            icon={<MaterialIcons name="lock-outline" size={12} color="black" />}
            secureTextEntry
            onChangeText={setConfirmPass}
            value={confirmPass}
          />
        </View>

        <View style={styles.button}>
          <SCButton title="Đăng ký" onPress={handleRegister} />
        </View>
      </View>

      <View style={styles.footer}>
        <Text style={{ fontFamily: FONTS.medium }}>
          Đã có tài khoản?{" "}
          <Text
            style={{ color: color.dark_green, fontFamily: FONTS.medium }}
            onPress={() => navigateCustom("/login")}
          >
            Đăng nhập ngay
          </Text>
        </Text>
      </View>

      <View style={styles.groupImageContainer}>
        <Image
          source={require("../assets/images/logo_group.png")}
          style={styles.logoGroup}
        />
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  screen: {
    flex: 1,
    backgroundColor: color.white,
    alignItems: "center",
    justifyContent: "flex-start",
  },
  logo: {
    marginTop: 40,
    width: "30%",
    aspectRatio: 1,
  },
  title: {
    fontSize: 24,
    marginVertical: 8,
    color: color.dark_green,
  },
  form: {
    width: "100%",
    paddingHorizontal: 20,
    marginTop: 16,
  },
  inputContainer: {
    gap: 12,
  },
  button: {
    width: "90%",
    alignSelf: "center",
    marginTop: 24,
  },
  footer: {
    marginTop: 16,
    alignItems: "center",
  },
  groupImageContainer: {
    position: "absolute",
    bottom: 16,
    alignSelf: "center",
  },
  logoGroup: {
    width: 65,
    height: 25,
    resizeMode: "contain",
  },
});
