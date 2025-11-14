import SCButton from "@components/ui/SCButton";
import SCInput from "@components/ui/SCInput";
import color from "@constants/color";
import { FONTS, globalStyles } from "@constants/fonts";
import Feather from "@expo/vector-icons/Feather";
import Fontisto from "@expo/vector-icons/Fontisto";
import MaterialIcons from "@expo/vector-icons/MaterialIcons";
import { loginThunk } from "@features/auth";
import { useAppDispatch } from "@redux/hooks";
import { checkAppVersion, isAppAccessible } from "@utils/environmentService"; // ✅ IMPORT
import { navigateCustom } from "@utils/navigation";
import Constants from 'expo-constants'; // ✅ Để lấy version
import { Image } from "expo-image";
import React, { useEffect, useState } from "react";
import { ActivityIndicator, Alert, StyleSheet, Text, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { FailedResponse } from "../types/me";

export default function LoginScreen() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [isCheckingEnv, setIsCheckingEnv] = useState(true); // ✅ Loading khi check env
  const [appAccessible, setAppAccessible] = useState(false);
  
  const dispatch = useAppDispatch();

  // ✅ CHECK ENVIRONMENT KHI COMPONENT MOUNT
  useEffect(() => {
    checkEnvironment();
  }, []);

  const checkEnvironment = async () => {
    try {
      // ✅ Lấy version hiện tại của app
      const appVersion = Constants.expoConfig?.version || '1.1.0';
      console.log('📱 App version:', appVersion);

      // ✅ Check version trước
      const versionCheck = await checkAppVersion(appVersion);
      if (!versionCheck.allowed) {
        Alert.alert(
          '🔄 Cần cập nhật',
          versionCheck.message || 'Vui lòng cập nhật ứng dụng.',
          [{ text: 'OK' }]
        );
        setAppAccessible(false);
        setIsCheckingEnv(false);
        return;
      }

      // ✅ Check app status
      const envCheck = await isAppAccessible();
      
      if (!envCheck.accessible) {
        Alert.alert(
          envCheck.status === 'maintenance' ? '🔧 Bảo trì' : '🚫 Ứng dụng đóng',
          envCheck.message || 'Vui lòng quay lại sau.',
          [{ text: 'OK' }]
        );
        setAppAccessible(false);
      } else {
        setAppAccessible(true);
      }
    } catch (error) {
      console.error('❌ Lỗi check environment:', error);
      // Fail-safe: cho phép truy cập nếu có lỗi
      setAppAccessible(true);
    } finally {
      setIsCheckingEnv(false);
    }
  };

  const handleLogin = async () => {
    // ✅ Kiểm tra lại environment trước khi login
    const envCheck = await isAppAccessible();
    if (!envCheck.accessible) {
      Alert.alert('Thông báo', envCheck.message || 'Ứng dụng hiện không khả dụng');
      return;
    }

    if (!email || !password) {
      Alert.alert("Thông báo", "Vui lòng nhập đầy đủ thông tin");
      return;
    }

    if (password.length < 6) {
      Alert.alert("Lỗi", "Mật khẩu phải có ít nhất 6 ký tự.");
      return;
    }

    setIsLoading(true);

    try {
      const resultAction = await dispatch(
        loginThunk({ email, password })
      );

      if (loginThunk.rejected.match(resultAction)) {
        const errorPayload = resultAction.payload as FailedResponse | string;

        let errorMessage = "Đăng nhập thất bại không rõ lý do.";
        if (typeof errorPayload === "object" && errorPayload.detail) {
          errorMessage = errorPayload.detail;
        } else if (typeof errorPayload === "string") {
          errorMessage = errorPayload;
        }

        Alert.alert("Lỗi Đăng Nhập", errorMessage);
        return;
      }

      // Đăng nhập thành công
      navigateCustom("/");
    } catch (e) {
      console.warn("Async Login Error:", e);
      Alert.alert("Lỗi hệ thống", "Đã xảy ra lỗi không mong muốn.");
    } finally {
      setIsLoading(false);
    }
  };

  // ✅ LOADING KHI CHECK ENVIRONMENT
  if (isCheckingEnv) {
    return (
      <View style={styles.loadingContainer}>
        <Text style={styles.loadingText}>ĐANG KIỂM TRA...</Text>
        <ActivityIndicator size="large" color={color.dark_green} />
      </View>
    );
  }

  // ✅ NẾU APP ĐÓNG -> HIỂN THỊ MÀN HÌNH THÔNG BÁO
  if (!appAccessible) {
    return (
      <SafeAreaView
        style={styles.screen}
        edges={["top", "left", "right", "bottom"]}
      >
        <Image
          source={require("../assets/images/logo.png")}
          style={styles.logo}
          contentFit="contain"
          transition={500}
        />
        <View style={styles.closedContainer}>
          <Text style={styles.closedTitle}>🚫 Ứng dụng đang đóng</Text>
          <Text style={styles.closedMessage}>
            Ứng dụng hiện không khả dụng.{"\n"}
            Vui lòng quay lại sau.
          </Text>
          <SCButton 
            title="Thử lại" 
            onPress={() => {
              setIsCheckingEnv(true);
              checkEnvironment();
            }}
            style={styles.retryButton}
          />
        </View>
      </SafeAreaView>
    );
  }

  // ✅ LOADING KHI ĐĂNG NHẬP
  if (isLoading) {
    return (
      <View style={styles.loadingContainer}>
        <Text style={styles.loadingText}>ĐANG ĐĂNG NHẬP...</Text>
        <ActivityIndicator size="large" color={color.dark_green} />
      </View>
    );
  }

  return (
    <SafeAreaView
      style={styles.screen}
      edges={["top", "left", "right", "bottom"]}
    >
      <Image
        source={require("../assets/images/logo.png")}
        style={styles.logo}
        contentFit="contain"
        transition={500}
      />
      <Text style={[styles.title, globalStyles.semiBold]}>Đăng nhập</Text>

      <View style={styles.form}>
        <View style={styles.inputContainer}>
          <SCInput
            fontFamily={FONTS.regular}
            placeholder="Nhập email"
            variant="email"
            icon={<Fontisto name="email" size={12} color="black" />}
            onChangeText={(text) => setEmail(text)}
            value={email}
          />
          <SCInput
            fontFamily={FONTS.regular}
            placeholder="Nhập mật khẩu"
            variant="password"
            eyeIcon={<Feather name="eye" size={20} color={color.gray} />}
            eyeOffIcon={<Feather name="eye-off" size={20} color={color.gray} />}
            icon={<MaterialIcons name="password" size={12} color="black" />}
            secureTextEntry={true}
            onChangeText={(text) => setPassword(text)}
            value={password}
          />
        </View>

        <View style={styles.button}>
          <SCButton title="Đăng nhập" onPress={handleLogin} />
        </View>
      </View>

      <View style={styles.footer}>
        <Text style={{ fontFamily: FONTS.medium }}>
          Chưa có tài khoản?{" "}
          <Text
            style={{ color: color.dark_green, fontFamily: FONTS.medium }}
            onPress={() => navigateCustom("/register")}
          >
            Đăng ký ngay
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
  loadingContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: color.white,
  },
  loadingText: {
    fontSize: 24,
    fontFamily: FONTS.bold,
    color: color.dark_green,
    marginBottom: 12,
  },
  closedContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    paddingHorizontal: 40,
  },
  closedTitle: {
    fontSize: 24,
    fontFamily: FONTS.bold,
    color: color.dark_green,
    marginBottom: 16,
    textAlign: "center",
  },
  closedMessage: {
    fontSize: 16,
    fontFamily: FONTS.regular,
    color: color.gray,
    textAlign: "center",
    marginBottom: 32,
    lineHeight: 24,
  },
  retryButton: {
    width: "80%",
  },
});