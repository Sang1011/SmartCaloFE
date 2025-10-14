import SCButton from "@components/ui/SCButton";
import color from "@constants/color";
import { FONTS } from "@constants/fonts";
import { navigateCustom } from "@utils/navigation";
import { useEffect } from "react";
import { StyleSheet, View } from "react-native";
import Animated, {
  FadeInDown,
  FadeInUp,
  useAnimatedStyle,
  useSharedValue,
  withRepeat,
  withSequence,
  withTiming
} from "react-native-reanimated";
import { SafeAreaView } from "react-native-safe-area-context";

export default function SuccessScreen() {
  const scale = useSharedValue(1);

  // 🎯 hiệu ứng pulse nhẹ cho nút
  useEffect(() => {
    scale.value = withRepeat(
      withSequence(withTiming(1.05, { duration: 600 }), withTiming(1, { duration: 600 })),
      -1,
      true
    );
  }, []);

  const animatedBtnStyle = useAnimatedStyle(() => ({
    transform: [{ scale: scale.value }],
  }));

  return (
    <SafeAreaView edges={["top"]} style={styles.container}>
      <View style={styles.settings}></View>

      <View style={styles.content}>
        {/* ✅ icon bay lên */}

        {/* ✨ tiêu đề + phụ đề xuất hiện */}
        <Animated.Text entering={FadeInDown.duration(700)} style={styles.title}>
          BÀI TẬP HOÀN THÀNH
        </Animated.Text>

        <Animated.Text entering={FadeInUp.delay(300).duration(700)} style={styles.subtitle}>
          Chúc mừng bạn đã hoàn thành bài tập!
        </Animated.Text>

        {/* 💚 nút có hiệu ứng nhịp nhẹ */}
        <Animated.View style={[{ marginTop: 40, width: "90%" }, animatedBtnStyle]}>
          <SCButton
            title="Kết thúc"
            onPress={() => navigateCustom("/tabs/explore")}
            bgColor={color.white_30}
            color={color.white}
            borderRadius={30}
            height={60}
            fontSize={18}
            fontFamily={FONTS.bold}
          />
        </Animated.View>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: color.dark_green,
  },
  settings: { position: "absolute", top: 60, right: 15, zIndex: 5 },
  content: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    width: "100%",
    paddingHorizontal: 20,
  },
  title: {
    fontFamily: FONTS.bold,
    fontSize: 26,
    color: color.white,
    marginTop: 15,
  },
  subtitle: {
    fontFamily: FONTS.regular,
    fontSize: 18,
    color: color.white_70,
    marginTop: 20,
    textAlign: "center",
  },
});
