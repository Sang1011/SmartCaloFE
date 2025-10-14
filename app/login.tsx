import SCCheckBox from "@components/ui/SCCheckBox";
import SCInput from "@components/ui/SCInput";
import { HAS_LOGGED_IN, REMEMBER_ME, SAVED_EMAIL, SAVED_PASSWORD } from "@constants/app";
import Fontisto from "@expo/vector-icons/Fontisto";
import MaterialIcons from "@expo/vector-icons/MaterialIcons";
import { getBooleanData, getStringData, saveBooleanData, saveStringData } from "@stores";
import { navigateCustom } from "@utils/navigation";
import { Image } from "expo-image";
import React, { useEffect, useState } from "react";
import { Alert, Pressable, StyleSheet, Text, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import SCButton from "../components/ui/SCButton";
import color from "../constants/color";
import { FONTS, globalStyles } from "../constants/fonts";
import { useAuth } from "../contexts/AuthContext";

export default function LoginScreen() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [rememberMe, setRememberMe] = useState(false);
  const { loginWithGoogle, isLoading, clearError, login } = useAuth();
 
  useEffect(() => {
    checkRemember()
  }, [])

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
      const getEmail:string = await getStringData(SAVED_EMAIL);
      const getPassword = await getStringData(SAVED_PASSWORD);
      console.log("Email:", getEmail);
      console.log("Password:", getPassword);
      setEmail(getEmail);
      setPassword(getPassword)
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
        console.log("logisssn");
        await handleRememberAccount();
        console.log("logis213");
        await login(email, password);
        console.log("logis2222");
      } else {
        Alert.alert("Thông báo", "Vui lòng nhập email và mật khẩu hợp lệ");
      }
    } catch (error: any) {
      Alert.alert("Lỗi", error.message || "Đăng nhập thất bại. Vui lòng thử lại.");
    }
  };

  const handleGoogleLogin = async () => {
    try {
      await loginWithGoogle();
      navigateCustom("/survey", { flagKey: HAS_LOGGED_IN, value: true });
    } catch (error: any) {
      console.error("Google login error from LOGIN:", error);

      if (error.message.includes("đã bị hủy")) {
        Alert.alert("Thông báo", "Bạn đã hủy đăng nhập bằng Google");
      } else if (error.message.includes("Google Play")) {
        Alert.alert("Lỗi", "Dịch vụ Google Play không khả dụng");
      } else {
        Alert.alert(
          "Lỗi",
          error.message || "Đăng nhập thất bại. Vui lòng thử lại."
        );
      }
    }
  };

  return (
    <SafeAreaView
      style={styles.screen}
      edges={["top", "left", "right", "bottom"]}
    >
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
            fontFamily={FONTS.regular}
            placeholder="Nhập mật khẩu"
            variant="password"
            onChangeText={(text) => setPassword(text)}
            secureTextEntry={true}
            value={password}
            icon={<MaterialIcons name="password" size={12} color="black" />}
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
              console.log("Đăng nhập với:", { email, password, rememberMe });
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
        <View style={styles.ORContainer}>
          <View style={styles.divider}></View>
          <Text style={styles.OR}>hoặc</Text>
          <View style={styles.divider}></View>
        </View>
        <View style={styles.groupButton}>
          <View style={styles.google}>
            <SCButton
              variant="outline"
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
              onPress={() => handleGoogleLogin()}
            />
          </View>
        </View>
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
    marginTop: 5,
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
