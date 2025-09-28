import SCInput from "../components/ui/SCInput";
import color from "../constants/color";
import { FONTS, globalStyles } from "../constants/fonts";
import { Image } from "expo-image";
import { StyleSheet, Text, View, Pressable } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import Fontisto from "@expo/vector-icons/Fontisto";
import MaterialIcons from "@expo/vector-icons/MaterialIcons";
import SCCheckBox from "../components/ui/SCCheckBox";
import SCButton from "../components/ui/SCButton";
import { navigateCustom } from "@utils/navigation";
import { IS_LOGGED_IN } from "@constants/app";
import React, { useState } from "react";
import { Link } from "expo-router";
export default function LoginScreen() {
  const [keepLogin, setKeepLogin] = useState(false);
  return (
    <SafeAreaView
      style={styles.screen}
      edges={["top", "left", "right", "bottom"]}
    >
      <Image
        source={require("../assets/images/backgroundLogin.jpeg")}
        style={styles.background}
        contentFit="fill"
      />
      <View style={styles.textContainer}>
        <Text style={styles.title}>Bắt đầu hành trình chăm sóc sức khỏe của bạn với SmartCalo</Text>
        <Text style={styles.subtitle}>Đăng nhập vào SmartCalo thông qua những tài khoản mạng xã hội dưới đây</Text>
      </View>
      <View style={styles.registerContainer}>
        <View style={styles.groupButton}>
          <View style={styles.google}>
            <SCButton
              variant="primary"
              bgColor="rgba(255, 255, 255, 0.1)"
              iconPos="left"
              style={styles.buttonCus}
              borderRadius={50}
              icon={
                <Image
                  source={require("../assets/images/googleIcon.png")}
                  style={{ width: 20, height: 20 }}
                />
              }
              title="Tiếp tục với google"
              onPress={() => {
                console.log("Đăng ký với google");
                navigateCustom("/tabs");
              }}
            />
          </View>
          <View style={styles.facebook}>
            <SCButton
              variant="primary"
              bgColor="rgba(255, 255, 255, 0.1)"
              iconPos="left"
              style={styles.buttonCus}
              borderRadius={50}
              icon={
                <Image
                  source={require("../assets/images/facebookIcon.png")}
                  style={{ width: 20, height: 20 }}
                />
              }
              title="Tiếp tục với facebook"
              onPress={() => console.log("Đăng ký với facebook")}
            />
          </View>
        </View>
        <Text style={styles.text}>
          Bằng việc tiếp tục, bạn đồng ý với các <Link href="/terms" style={styles.link}>Điều khoản sử dụng</Link> và <Link href="/privacy" style={styles.link}>Chính sách bảo mật</Link> của chúng tôi
        </Text>
      </View>
      <View style={styles.groupImageContainer}>
        <Image
          source={require("../assets/images/logo_group_outline.png")}
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
    width: "100%",
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
    justifyContent: "center",
    position: "relative",
    marginHorizontal: "auto",
  },
  background: {
    width: "110%",
    height: "110%",
    position: "absolute",
    top: 0,
    left: 0,
  },
  textContainer: {
    paddingHorizontal: 25,
    paddingVertical: 10,
    display: "flex",
    flexDirection: "column",
    gap: 10,
    justifyContent: "center",
    alignItems: "center",
  },
  title:{
    fontFamily: FONTS.bold,
    fontSize: 18,
    color: color.white,
    textAlign: "center",
  },
  subtitle: {
    fontFamily: FONTS.regular,
    fontSize: 12,
    color: color.white,
    textAlign: "center",
  },
  registerContainer: {
    marginTop: 8,
    alignItems: "center",
    width: "100%",
  },
  groupButton: {
    width: "100%",
    alignItems: "center",
    gap: 10,
  },
  google: {
    width: "80%",
  },
  facebook: {
    width: "80%",
  },
  buttonCus: {
    fontFamily: FONTS.medium,
    fontSize: 14,
    height: 41,
  },
  text: {
    marginTop: 10,
    paddingHorizontal: 25,
    fontFamily: FONTS.medium,
    fontSize: 10,
    color: color.white,
    textAlign: "center"
  },
  link: {
    fontFamily: FONTS.bold,
    fontSize: 10,
    color: color.dark_green,
  },
  groupImageContainer: {
    position: "absolute",
    bottom: 25,
    alignSelf: "center", // thay translateX thủ công
  },
  logoGroup: {
    width: 65,
    height: 25,
    resizeMode: "contain",
  },
});
