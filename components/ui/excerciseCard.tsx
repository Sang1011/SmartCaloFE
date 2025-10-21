import color from "@constants/color";
import { FONTS } from "@constants/fonts";
import { LinearGradient } from "expo-linear-gradient";
import { DimensionValue, Image, StyleSheet, Text, View, } from "react-native";
import SCButton from "./SCButton";

interface ExerciseCardProps{
  title: string;
  progress?: {
    current: number;
    total: number;
  };
  totalProgress?: number;
  image?: string; // require image
  haveButton?: boolean;
  width?: DimensionValue;
  border?: number;
  paddingTop?: number;
  marginBottom?: number;
  day?: number;
  notHaveProgress?: boolean;
  des?: string;
  onPress? : () => void;
}

export default function ExerciseCard({
  title,
  progress = { current: 0, total: 100 },
  image,
  haveButton = true,
  width = "90%",
  border = 16,
  paddingTop,
  marginBottom = 16,
  totalProgress,
  notHaveProgress = false,
  des,
  day,
  onPress
}: ExerciseCardProps) {
  const progressPercent = Math.min(
    (progress.current / progress.total) * 100,
    100
  );

  return (
    <View style={[styles.cardWrapper, { width }, { marginBottom }]}>
      <LinearGradient
        colors={[color.scan_button_inner_left, color.scan_button_inner_right]}
        style={[styles.container, { borderRadius: border }]}
        start={{ x: 0, y: 0 }}
        end={{ x: 1, y: 1 }}
      >
        <View
          style={{
            flex: 1,
            flexDirection: "row",
            alignItems: "center",
            paddingTop: paddingTop,
          }}
        >
          {/* Left content */}
          <View style={styles.leftContent}>
            <Text style={styles.title}>{title}</Text>
            {des && <Text style={styles.des}>{des}</Text>}

            {/* Day */}
            {day && <Text style={styles.day}>Ngày {day}</Text>}

            {/* Progress */}
            {! day || notHaveProgress &&(
            <View style={styles.progressWrapper}>
              {totalProgress ? (
                <Text style={styles.progressText}>{totalProgress} ngày</Text>
              ) : (
                <Text style={styles.progressText}>
                  {progress.current} / {progress.total} ngày
                </Text>
              )}

              <View style={styles.progressBar}>
                <View
                  style={[
                    styles.progressFill,
                    { width: `${progressPercent}%` },
                  ]}
                />
              </View>
            </View>
            )}
          </View>

          {/* Right image */}
          <View style={styles.rightContent}>
            {image ? (
              <Image src={image} style={styles.image} resizeMode="contain" />
            ) : (
              <Image source={require("../../assets/images/dumbbell.png")} style={styles.image} resizeMode="contain" />
            )}
          </View>
        </View>

        {/* Button */}
        {haveButton && (
          <View style={{ width: "100%" }}>
            <SCButton
              title="Xem chi tiết"
              onPress={() => {
                if (onPress) onPress();
              }}
              bgColor={color.white}
              color={color.dark_green}
              fontSize={16}
              fontFamily={FONTS.semiBold}
            />
          </View>
        )}
      </LinearGradient>
    </View>
  );
}

const styles = StyleSheet.create({
  cardWrapper: {
    height: 220,
    alignSelf: "center",
  },
  container: {
    flex: 1,
    padding: 16,
    justifyContent: "space-between",
    alignItems: "center",
    overflow: "hidden",
  },
  leftContent: { flex: 0.5 },
  title: {
    fontSize: 14,
    color: color.white,
    fontFamily: FONTS.bold,
    marginBottom: 8,
  },
  des: {
    fontSize: 12,
    color: color.white,
    fontFamily: FONTS.regular,
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
  progressWrapper: { marginBottom: 16 },
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
  rightContent: { flex: 0.4, alignItems: "flex-end", justifyContent: "center" },
  image: { width: 140, height: 140, marginLeft: 12 },
});
