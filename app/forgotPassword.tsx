import SCButton from "@components/ui/SCButton";
import SCInput from "@components/ui/SCInput";
import color from "@constants/color";
import { FONTS, globalStyles } from "@constants/fonts";
import Fontisto from "@expo/vector-icons/Fontisto";
import { forgotPasswordThunk, verifyOTPThunk } from "@features/auth";
import { useAppDispatch } from "@redux/hooks";
import { navigateCustom } from "@utils/navigation";
import { Image } from "expo-image";
import React, { useEffect, useState } from "react";
import { ActivityIndicator, Alert, StyleSheet, Text, TextInput, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

export default function ForgotPasswordScreen() {
  const [email, setEmail] = useState("");
  const [step, setStep] = useState<"email" | "otp">("email");
  const [otp, setOtp] = useState("");
  const [countdown, setCountdown] = useState(0);
  const [isLoading, setIsLoading] = useState(false);
  const dispatch = useAppDispatch();

  // 🔁 Giảm timer mỗi giây
  useEffect(() => {
    if (countdown <= 0) return;
    const timer = setInterval(() => setCountdown((prev: number) => prev - 1), 1000);
    return () => clearInterval(timer);
  }, [countdown]);

  // 📨 Gửi yêu cầu quên mật khẩu
  const handleReset = async () => {
    if (!email.trim()) {
      Alert.alert("Thông báo", "Vui lòng nhập email");
      return;
    }
    setIsLoading(true);
    const result = await dispatch(forgotPasswordThunk({ email }));
    if (forgotPasswordThunk.fulfilled.match(result)) {
      Alert.alert("Thành công", `Mã xác nhận đã được gửi đến ${email}`);
      setStep("otp");
      setCountdown(30);
    }else {
      Alert.alert("Thất bại", `Người dùng không tồn tại`);
    }
    setIsLoading(false);
  };

  // ✅ Xác minh OTP
  const handleVerifyOTP = async () => {
    if (otp.length !== 6) {
      Alert.alert("Lỗi", "Vui lòng nhập đủ 6 số OTP");
      return;
    }

    console.log("email",email);
    console.log("otp",otp);
    setIsLoading(true);
    const result = await dispatch(verifyOTPThunk({ email, otp }));
    if (verifyOTPThunk.fulfilled.match(result)) {
      Alert.alert("Thành công", "Xác minh thành công! Hãy đặt lại mật khẩu.");
      navigateCustom("/resetPassword")
    }
    setIsLoading(false);

  };

  // 🔄 Gửi lại mã OTP
  const handleResend = () => {
    if (countdown > 0) return;
    handleReset(); // gọi lại API quên mật khẩu
  };

  if (isLoading) {
      <View style={{ flex: 1, justifyContent: "center", alignItems: "center" }}>
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
      </View>;
    }

  return (
    <SafeAreaView style={styles.screen}>
      <Image
        source={require("../assets/images/logo.png")}
        style={styles.logo}
        contentFit="contain"
      />

      <Text style={[styles.title, globalStyles.semiBold]}>Quên mật khẩu</Text>

      {step === "email" && (
        <>
          <Text style={styles.desc}>
            Nhập email đã đăng ký để nhận mã xác nhận đặt lại mật khẩu
          </Text>

          <View style={styles.form}>
            <SCInput
              fontFamily={FONTS.regular}
              placeholder="Nhập email"
              variant="email"
              icon={<Fontisto name="email" size={12} color="black" />}
              onChangeText={setEmail}
              value={email}
            />
            <View style={styles.button}>
              <SCButton title="Gửi mã xác nhận" onPress={handleReset}/>
            </View>
          </View>
        </>
      )}

      {step === "otp" && (
        <View style={styles.otpContainer}>
          <Text style={styles.desc}>
            Nhập mã OTP gồm 6 số được gửi đến email {email}
          </Text>
          <TextInput
            style={styles.otpInput}
            placeholder="Nhập mã OTP"
            keyboardType="numeric"
            maxLength={6}
            value={otp}
            onChangeText={setOtp}
          />
          <View style={styles.button}>
            <SCButton title="Xác nhận mã" onPress={handleVerifyOTP}/>
          </View>

          {/* ⏱️ Hiển thị countdown hoặc nút gửi lại */}
          {countdown > 0 ? (
            <Text style={[styles.resend, { opacity: 0.6 }]}>
              Gửi lại mã ({countdown}s)
            </Text>
          ) : (
            <Text style={styles.resend} onPress={handleResend}>
              Gửi lại mã
            </Text>
          )}
        </View>
      )}

      <Text style={styles.back} onPress={() => navigateCustom("/login")}>
        Trở về đăng nhập
      </Text>
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
  },
  button: {
    width: "90%",
    alignSelf: "center",
    marginTop: 16,
  },
  otpContainer: {
    alignItems: "center",
    width: "100%",
    marginTop: 30,
  },
  otpInput: {
    borderWidth: 1,
    borderColor: color.dark_green,
    borderRadius: 10,
    width: "70%",
    textAlign: "center",
    fontSize: 18,
    paddingVertical: 10,
    letterSpacing: 8,
    color: color.black,
    marginVertical: 20,
  },
  resend: {
    color: color.dark_green,
    fontSize: 13,
    marginTop: 10,
    fontFamily: FONTS.medium,
  },
  back: {
    color: color.dark_green,
    fontFamily: FONTS.medium,
    fontSize: 14,
    marginTop: 30,
  },
});
