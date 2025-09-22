import { navigateWithFlag } from "@utils/navigation";
import { Dimensions, StyleSheet, Text, View } from "react-native";
import SCButton from "../components/ui/SCButton";
import SCCarousel from "../components/ui/SCCarousel";
import color from "../constants/color";
import { globalStyles } from "../constants/fonts";


const { height } = Dimensions.get("window");

export default function Welcome() {
  return (
    <View style={{ flex: 1, backgroundColor: "white" }}>
      {/* Title*/}
      <Text style={[styles.title, styles.boldText, globalStyles.black]}>
        <Text style={[styles.title, styles.limeText, globalStyles.black]}>
          Smart {""}
      </Text>
        Calo
      </Text>

      {/* Description*/}
      <Text style={[styles.description, globalStyles.medium]}>
        Một ứng dụng để quản lý cân nặng và dinh dưỡng
      </Text>

      {/* Carousel */}
      <SCCarousel />

      {/* Group Button */}
      <View style={styles.groupButton}>
        <View style={styles.buttonRegister}>
          <SCButton title="Đăng ký" onPress={() => console.log("Register pressed")} />
        </View>
        <View style={styles.buttonLogin}>
          <SCButton title="Đăng nhập" variant="outline" onPress={() => navigateWithFlag("/login")} />
        </View>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  title: {
    fontSize: 40,
    marginTop: height * 0.07,
    lineHeight: (1.5 * 40),
    textAlign: "center"
  },
  limeText: {
    color: color.lime,
  },
  boldText: {
    color: color.dark_green,
  },
  description: {
    color: color.dark_green,
    fontSize: 12,
    marginBottom: 25,
    lineHeight: (1.5 * 12),
    textAlign: "center"
  },
  groupButton: {
    flexDirection: "column",
    alignItems: "center",
    gap: 5,
    width: "100%"
  },
  buttonRegister: {
    width: "90%"
  },
  buttonLogin: {
    width: "90%"
  },
  
});
