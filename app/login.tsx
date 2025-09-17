import SCInput from "../components/ui/SCInput";
import color from "../constants/color";
import { FONTS, globalStyles } from "../constants/fonts";
import { Image } from "expo-image";
import { StyleSheet, Dimensions, Text, View, Pressable } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import Fontisto from "@expo/vector-icons/Fontisto";
import MaterialIcons from "@expo/vector-icons/MaterialIcons";
import SCCheckBox from "../components/ui/SCCheckBox";
import SCButton from "../components/ui/SCButton";
import { navigateWithFlag } from "@utils/navigation";
import { IS_LOGGED_IN } from "@constants/app";

export default function LoginScreen() {
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
          />
          <SCInput
            fontFamily={FONTS.regular}
            placeholder="Nhập mật khẩu"
            variant="password"
            icon={<MaterialIcons name="password" size={12} color="black" />}
          />
        </View>
        <View style={styles.checkboxContainer}>
          <SCCheckBox
            fontFamily={FONTS.medium}
            fontSize={12}
            label="Duy trì đăng nhập"
            labelPos="right"
          />
          <Pressable onPress={() => console.log("Quên mật khẩu?")}>
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
        {/* <View style={styles.button}>
          <SCButton
            title="Đăng nhập"
            onPress={() => navigateWithFlag("/(survey)/step1", IS_LOGGED_IN)}
          />
        </View> */}
        <View style={styles.button}>
          <SCButton
            title="Đăng nhập"
            onPress={() => navigateWithFlag("/home", IS_LOGGED_IN)}
          />
        </View>
      </View>
      <View style={styles.registerContainer}>
        <Text style={{ fontFamily: FONTS.medium }}>
          Chưa có tài khoản?{" "}
          <Text style={{ color: color.dark_green, fontFamily: FONTS.medium }}>
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
              onPress={() => console.log("Đăng ký")}
            />
          </View>
          <View style={styles.facebook}>
            <SCButton
              variant="outline"
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
              onPress={() => console.log("Đăng ký")}
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
    marginHorizontal: "auto"
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
    bottom: 25,
    alignSelf: "center", // thay translateX thủ công
  },
  logoGroup: {
    width: 65,
    height: 25,
    resizeMode: "contain",
  },
});
