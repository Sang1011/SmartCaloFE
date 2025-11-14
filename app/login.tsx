import SCCheckBox from "@components/ui/SCCheckBox";
import SCInput from "@components/ui/SCInput";
import { REMEMBER_ME, SAVED_EMAIL, SAVED_PASSWORD } from "@constants/app";
import { Feather, MaterialIcons } from '@expo/vector-icons';
import Fontisto from "@expo/vector-icons/Fontisto";
import { loginThunk } from "@features/auth";
import { RootState } from "@redux";
import { useAppDispatch, useAppSelector } from "@redux/hooks";
import {
  getBooleanData,
  getStringData,
  saveBooleanData,
  saveStringData,
} from "@stores";
import { navigateCustom } from "@utils/navigation";
import { Image } from "expo-image";
import React, { useEffect, useState } from "react";
import {
  ActivityIndicator,
  Alert,
  Pressable,
  StyleSheet,
  Text,
  View,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import SCButton from "../components/ui/SCButton";
import color from "../constants/color";
import { FONTS, globalStyles } from "../constants/fonts";
import { useAuth } from "../contexts/AuthContext";
import { RegisterANDLoginResponse } from "../types/auth";
import { FailedResponse, UserStatusLabel } from "../types/me";

export default function LoginScreen() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [rememberMe, setRememberMe] = useState(false);
  const { loginWithGoogle, clearError, isLoading } = useAuth();
  const { user: userLogin, loading: loadingLogin } = useAppSelector(
    (state: RootState) => state.auth
  );
  const dispatch = useAppDispatch();

  useEffect(() => {
    checkRemember();
  }, []);

  useEffect(() => {
    return () => {
      clearError();
    };
  }, [clearError]);

  const checkRemember = async () => {
    const isRemember = await getBooleanData(REMEMBER_ME);
    console.log("REMEMBER_ME:", isRemember);

    if (isRemember) {
      setRememberMe(true);
      const getEmail: string = await getStringData(SAVED_EMAIL);
      const getPassword = await getStringData(SAVED_PASSWORD);
      console.log("Email:", getEmail);
      console.log("Password:", getPassword);
      setEmail(getEmail);
      setPassword(getPassword);
    }
  };

  const handleRememberAccount = async () => {
    await saveBooleanData(REMEMBER_ME, rememberMe);

    if (rememberMe) {
      await saveStringData(SAVED_EMAIL, email);
      await saveStringData(SAVED_PASSWORD, password);
    } else {
      await saveStringData(SAVED_EMAIL, "");
      await saveStringData(SAVED_PASSWORD, "");
    }
  };

  const handleLogin = async () => {
    console.log("login");
    try {
      if (email && password && email.trim() !== "" && password.trim() !== "") {
        await handleRememberAccount();
    
        const resultAction = await dispatch(loginThunk({ email, password }));
    
        if (loginThunk.rejected.match(resultAction)) {
          const errorPayload = resultAction.payload as FailedResponse | string;
    
          let errorMessage = "Đăng nhập thất bại không rõ lý do.";
          if (typeof errorPayload === "object" && errorPayload.detail) {
            errorMessage = errorPayload.detail; // ✅ Lấy thông báo chi tiết từ API
          } else if (typeof errorPayload === "string") {
            errorMessage = errorPayload;
          }
    
          Alert.alert("Lỗi Đăng Nhập", errorMessage);
          return;
        }
    
        // ✅ Nếu thành công, lấy user từ payload
        const loginPayload = resultAction.payload as RegisterANDLoginResponse;
        const loggedInUser = loginPayload?.userDto;
    
        Alert.alert("Thành công", "Đăng nhập thành công!");
        console.log("user từ payload", loggedInUser);
    
        if (loggedInUser) {
          if (loggedInUser.status === UserStatusLabel.PendingOnboarding) {
            navigateCustom("/survey");
          } else if (loggedInUser.status === UserStatusLabel.Active) {
            navigateCustom("/tabs");
          } else {
            Alert.alert(
              "Tài khoản của bạn đang có vấn đề, vui lòng liên hệ qua mail của chúng tôi để giải quyết"
            );
            navigateCustom("/login");
          }
        } else {
          Alert.alert(
            "Lỗi Dữ Liệu",
            "Đăng nhập thành công nhưng không nhận được thông tin người dùng."
          );
        }
      } else {
        Alert.alert("Thông báo", "Vui lòng nhập email và mật khẩu hợp lệ");
      }
    } catch (error: any) {
      Alert.alert(
        "Lỗi Hệ Thống",
        error.message || "Đăng nhập thất bại. Vui lòng thử lại."
      );
    }
    
  };

  const handleGoogleLogin = async () => {
    try {
      const success = await loginWithGoogle();
      if (success) {
        navigateCustom("/survey"); // chỉ navigate khi login thành công
      }
    } catch (error: any) {
      console.warn("Google login error from LOGIN:", error);
      Alert.alert("Lỗi", error.message || "Đăng nhập thất bại");
    }
  };

  return (
    <SafeAreaView
      style={styles.screen}
      edges={["top", "left", "right", "bottom"]}
    >
      {isLoading || loadingLogin ? (
        <View style={styles.loadingContainer}>
          <ActivityIndicator size="large" color={color.dark_green} />
          <Text style={styles.loadingText}>Đang tải dữ liệu...</Text>
        </View>
      ) : (
        <>
          <Image
            source={require("../assets/images/logo.png")}
            style={styles.logo}
            contentFit="contain" // giống resizeMode="contain"
            transition={500} // hiệu ứng fade-in
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
                variant="password"
                placeholder="Nhập mật khẩu"
                value={password}
                onChangeText={setPassword}
                icon={<MaterialIcons name="password" size={12} color="black" />}
                eyeIcon={<Feather name="eye" size={20} color={color.gray} />}
                eyeOffIcon={<Feather name="eye-off" size={20} color={color.gray} />}
              />
            </View>
            <View style={styles.checkboxContainer}>
              <SCCheckBox
                fontFamily={FONTS.medium}
                fontSize={12}
                label="Duy trì đăng nhập"
                labelPos="right"                
                checked={rememberMe}
                onChange={(value) => setRememberMe(value)}
              />
              <Pressable onPress={() => navigateCustom("/forgotPassword")}>
                <Text
                  style={{
                    fontSize: 12,
                    color: color.dark_green,
                    fontFamily: FONTS.semiBold,
                  }}
                >
                  Quên mật khẩu?
                </Text>
              </Pressable>
            </View>
            <View style={styles.button}>
              <SCButton
                title="Đăng nhập"
                onPress={() => {
                  console.log("Đăng nhập với:", {
                    email,
                    password,
                    rememberMe,
                  });
                  handleLogin();
                }}
              />
            </View>
          </View>
          <View style={styles.registerContainer}>
            <Text style={{ fontFamily: FONTS.medium }}>
              Chưa có tài khoản?{" "}
              <Text
                style={{ color: color.dark_green, fontFamily: FONTS.medium }}
                onPress={() => navigateCustom("/register")}
              >
                Đăng ký ngay
              </Text>
            </Text>
            {/* <View style={styles.ORContainer}>
              <View style={styles.divider}></View>
              <Text style={styles.OR}>hoặc</Text>
              <View style={styles.divider}></View>
            </View> */}
            <Text style={styles.text}>
              Chúng tôi chỉ chia sẻ thông tin khi có sự đồng ý của bạn
            </Text>
          </View>
          <View style={styles.groupImageContainer}>
            <Image
              source={require("../assets/images/logo_group.png")}
              style={styles.logoGroup}
            />
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
    width: "100%",
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
    position: "relative",
    marginHorizontal: "auto",
  },
  logo: {
    marginTop: 40,
    width: "30%",
    aspectRatio: 1,
    resizeMode: "contain",
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
  loadingContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: color.white,
  },
  loadingText: {
    marginTop: 12,
    color: color.dark_green,
    fontFamily: FONTS.medium,
    fontSize: 15,
  },
  inputContainer: {
    gap: 12,
  },
  checkboxContainer: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingHorizontal: 20,
  },
  button: {
    width: "90%",
    alignSelf: "center",
    marginTop: 24,
  },
  registerContainer: {
    marginTop: 8,
    alignItems: "center",
    width: "100%",
  },
  ORContainer: {
    marginHorizontal: "auto",
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    marginVertical: 24,
  },
  divider: {
    width: "50%",
    height: StyleSheet.hairlineWidth,
    backgroundColor: "#aaa",
  },
  OR: {
    marginHorizontal: 8,
    fontFamily: FONTS.medium,
    fontSize: 14,
    textTransform: "uppercase",
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
    fontFamily: FONTS.medium,
    fontSize: 10,
    color: color.black,
    textAlign: "center",
    marginTop: 10,
  },
  groupImageContainer: {
    position: "absolute",
    bottom: 16,
    alignSelf: "center", // thay translateX thủ công
  },
  logoGroup: {
    width: 65,
    height: 25,
    resizeMode: "contain",
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
  subtitle: {
    fontFamily: FONTS.regular,
    fontSize: 12,
    color: color.white,
    textAlign: "center",
  },
  link: {
    fontFamily: FONTS.bold,
    fontSize: 10,
    color: color.dark_green,
  },
});
