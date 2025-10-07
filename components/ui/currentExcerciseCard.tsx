import { StyleSheet, Text, View, TouchableOpacity, Image } from "react-native";
import { LinearGradient } from "expo-linear-gradient";
import { Ionicons } from "@expo/vector-icons";
import color from "@constants/color";
import { FONTS } from "@constants/fonts";
import SCButton from "./SCButton";

interface Props {
  title: string;
  day: string;
  info: string;
  progress: {
    current: number;
    total: number;
  };
  image?: any;
}

export default function CurrentExerciseCard({
  title,
  day,
  info,
  progress,
  image,
}: Props) {
  return (
    <LinearGradient
      colors={[color.scan_button_inner_left, color.scan_button_inner_right]}
      style={styles.container}
      start={{ x: 0, y: 0 }}
      end={{ x: 1, y: 1 }}
    >
      <View style={{ flex: 1, flexDirection: "row"}}>
        {/* Left content */}
        <View style={styles.leftContent}>
          <Text style={styles.title}>{title}</Text>
          <Text style={styles.day}>{day}</Text>
          <Text style={styles.info}>{info}</Text>

          {/* Progress */}
          <View style={styles.progressWrapper}>
            <Text style={styles.progressText}>
              {progress.current} / {progress.total} ngày
            </Text>
            <View style={styles.progressBar}>
              <View
                style={[
                  styles.progressFill,
                  { width: `${(progress.current / progress.total) * 100}%` },
                ]}
              />
            </View>
          </View>
        </View>

        {/* Right image */}
        <View style={styles.rightContent}>
          <Image source={image} style={styles.image} resizeMode="contain" />
        </View>
      </View>

      <View style={{ width: "100%" }}>
        <SCButton
          title={progress.current === 1 ? "Bắt đầu" : "Tiếp tục"}
          onPress={() => console.log("Bắt đầu bài tập")}
          bgColor={color.white}
          color={color.dark_green}
          fontSize={16}
          fontFamily={FONTS.semiBold}
          icon={
            progress.current === 1 ? (
              <Ionicons name="play" size={20} color={color.dark_green} />
            ) : (
              <Ionicons
                name="arrow-forward"
                size={20}
                color={color.dark_green}
              />
            )
          }
        />
      </View>
    </LinearGradient>
  );
}

const styles = StyleSheet.create({
  container: {
    borderRadius: 16,
    padding: 16,
    marginBottom: 32,
    justifyContent: "space-between",
    alignItems: "center",
    overflow: "hidden",
  },
  leftContent: {
    flex: 1,
  },
  title: {
    fontSize: 14,
    color: color.white,
    fontFamily: FONTS.bold,
    marginBottom: 8,
  },
  day: {
    fontSize: 22,
    color: color.white,
    fontFamily: FONTS.black,
    marginBottom: 6,
  },
  info: {
    fontSize: 12,
    color: color.white,
    fontFamily: FONTS.regular,
    marginBottom: 6,
  },
  progressWrapper: {
    marginBottom: 16,
  },
  progressText: {
    fontSize: 12,
    color: color.white,
    marginBottom: 4,
    fontFamily: FONTS.medium,
  },
  progressBar: {
    height: 6,
    width: "100%",
    backgroundColor: "rgba(255,255,255,0.3)",
    borderRadius: 3,
  },
  progressFill: {
    height: "100%",
    backgroundColor: color.white,
    borderRadius: 3,
  },
  button: {
    backgroundColor: color.white,
    borderRadius: 12,
    paddingVertical: 12,
    paddingHorizontal: 20,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
  },
  buttonText: {
    fontSize: 16,
    color: color.dark_green,
    fontFamily: FONTS.semiBold,
    marginRight: 8,
  },
  rightContent: {
    flex: 1,
    alignItems: "flex-end",
    justifyContent: "center",
  },
  image: {
    width: 140,
    height: 140,
    marginLeft: 12,
  },
});
