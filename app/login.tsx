import { Image } from "expo-image";
import { Link, router } from "expo-router";
import React, { useEffect, useState } from "react";
import {
  ActivityIndicator,
  Alert,
  StyleSheet,
  Text,
  View,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import SCButton from "../components/ui/SCButton";
import color from "../constants/color";
import { FONTS } from "../constants/fonts";
import { useAuth } from '../contexts/AuthContext';
import { navigateCustom } from "@utils/navigation";
import { HAS_LOGGED_IN } from "@constants/app";

export default function LoginScreen() {
  const { 
    loginWithGoogle, 
    isLoading, 
    clearError,
  } = useAuth();

  useEffect(() => {
    return () => {
      clearError();
    };
  }, [clearError]);

  const handleGoogleLogin = async () => {
    try {
      await loginWithGoogle();
      navigateCustom("/survey", { flagKey: HAS_LOGGED_IN, value: true });
    } catch (error: any) {
      console.error('Google login error from LOGIN:', error);
      
      if (error.message.includes('đã bị hủy')) {
        Alert.alert('Thông báo', 'Bạn đã hủy đăng nhập bằng Google');
      } else if (error.message.includes('Google Play')) {
        Alert.alert('Lỗi', 'Dịch vụ Google Play không khả dụng');
      } else {
        Alert.alert('Lỗi', error.message || 'Đăng nhập thất bại. Vui lòng thử lại.');
      }
    }
  };

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
        <Text style={styles.title}>
          Bắt đầu hành trình chăm sóc sức khỏe của bạn với SmartCalo
        </Text>
        <Text style={styles.subtitle}>
          Đăng nhập vào SmartCalo thông qua những tài khoản mạng xã hội dưới đây
        </Text>
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
                isLoading ? (
                  <ActivityIndicator size="small" color={color.white} />
                ) : (
                  <Image
                    source={require("../assets/images/googleIcon.png")}
                    style={{ width: 20, height: 20 }}
                  />
                )
              }
              title={isLoading ? "Đang đăng nhập..." : "Tiếp tục với google"}
              onPress={() => {
                handleGoogleLogin();
              }}
              disabled={isLoading}
            />
          </View>
        </View>
        <Text style={styles.text}>
          Bằng việc tiếp tục, bạn đồng ý với các{" "}
          <Link href="/terms" style={styles.link}>
            Điều khoản sử dụng
          </Link>{" "}
          và{" "}
          <Link href="/privacy" style={styles.link}>
            Chính sách bảo mật
          </Link>{" "}
          của chúng tôi
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
  title: {
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
    textAlign: "center",
  },
  link: {
    fontFamily: FONTS.bold,
    fontSize: 10,
    color: color.dark_green,
  },
  groupImageContainer: {
    position: "absolute",
    bottom: 25,
    alignSelf: "center",
  },
  logoGroup: {
    width: 65,
    height: 25,
    resizeMode: "contain",
  },
});
