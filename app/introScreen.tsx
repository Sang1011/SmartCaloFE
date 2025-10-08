import { HAS_OPENED_APP } from "@constants/app";
import AntDesign from "@expo/vector-icons/AntDesign";
import { navigateCustom } from "@utils/navigation";
import { Image } from "expo-image";
import {
  Dimensions,
  StyleSheet,
  Text,
  View
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import SCButton from "../components/ui/SCButton";
import Wave from "../components/ui/waveBackground";
import color from "../constants/color";
import { FONTS, globalStyles } from "../constants/fonts";

const { width, height } = Dimensions.get("window");

export default function IntroScreen() {
  return (
    <SafeAreaView
      style={styles.screen}
      edges={["top", "left", "right", "bottom"]}
    >
      {/* Logo */}
      <View style={styles.logoBox}>
        <Image
          style={styles.logo}
          source={require("../assets/images/logo_full.png")}
        />
      </View>

      {/* Wave */}
      <View style={styles.waveBox}>
        <Wave />
      </View>

      {/* Content */}
      <View style={styles.boxContent}>
        <Text style={[styles.content, globalStyles.semiBold]}>Chào Mừng</Text>
        <Text style={[styles.description, globalStyles.semiBold]}>
          Phân tích mục tiêu dinh dưỡng, cá nhân hóa bữa ăn của bạn.
        </Text>
      </View>

      {/* Button */}
      <View style={styles.buttonBox}>
        <SCButton
          title="Tiếp tục"
          onPress={() => navigateCustom("/welcomeScreen", { flagKey: HAS_OPENED_APP })}
          fontFamily={FONTS.semiBold}
          style={styles.button}
          iconPos="right"
          icon={<AntDesign name="right" size={14} color={color.white} />}
        />
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  screen: {
    flex: 1,
    position: "relative",
    backgroundColor: color.white,
    width: "100%",
  },
  logoBox: {
    flex: 0.3,
    justifyContent: "flex-end",
    alignItems: "center",
    width: "100%",
  },
  logo: {
    resizeMode: "contain",
    // responsive kích thước
    width: width * 0.8, // chiếm 60% chiều ngang màn hình
    height: height * 0.2, // chiếm 15% chiều cao màn hình
    maxWidth: 300, // giới hạn tối đa
    maxHeight: 170, // giới hạn tối đa
    marginBottom: 20,
  },
  waveBox: {
    flex: 0.4, // 40% màn hình
    overflow: "hidden",
    display: "flex",
    flexDirection: "column",
    justifyContent: "center",
    width: "100%",
  },
  boxContent: {
    flex: 0.2, // 20% màn hình
    paddingHorizontal: 16,
  },
  content: {
    color: color.dark_green,
    fontSize: width * 0.07, // responsive font
    lineHeight: width * 0.1,
  },
  description: {
    color: color.dark_green,
    fontSize: width * 0.04,
    marginTop: 8,
  },
  buttonBox: {
    flex: 0.1,
    justifyContent: "center",
    alignItems: "flex-end",
    paddingRight: 16,
  },
  button: {
    width: width * 0.5, // responsive width
  },
});
