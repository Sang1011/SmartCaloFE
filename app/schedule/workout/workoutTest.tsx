import ButtonGoBack from "@components/ui/buttonGoBack";
import SCAnimatedGradientButton from "@components/ui/SCAnimatedGradientButton";
import SCButton from "@components/ui/SCButton";
import color from "@constants/color";
import { FONTS } from "@constants/fonts";
import Entypo from "@expo/vector-icons/Entypo";
import Feather from "@expo/vector-icons/Feather";
import Ionicons from "@expo/vector-icons/Ionicons";
import { navigateCustom } from "@utils/navigation";
import { useEffect, useRef, useState } from "react";
import { Image, StyleSheet, Text, TouchableOpacity, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { WorkoutExcerciseTypeEnum } from "../../../types/workoutExcercise";

export default function WorkoutTest({
  item,
  onNext,
  onPrev,
  canPrev,
}: {
  item: any;
  onNext: () => void;
  onPrev: () => void;
  canPrev: boolean;
}) {
  const [type] = useState(item.type);
  const [isPlaying, setIsPlaying] = useState(false);
  const [timeLeft, setTimeLeft] = useState<number>(item?.duration || 0);
  const [isPaused, setIsPaused] = useState(false);
  const timerRef = useRef<number | null>(null);

  // 🕒 Logic đếm ngược chỉ dành cho bài tập timed
  useEffect(() => {
    if (type === WorkoutExcerciseTypeEnum.TimeBased) {
      if (isPlaying && timeLeft > 0 && !isPaused) {
        timerRef.current = setInterval(() => {
          setTimeLeft((prev) => {
            if (prev <= 1) {
              if (timerRef.current !== null) clearInterval(timerRef.current);
              return 0;
            }
            return prev - 1;
          });
        }, 1000);
      } else {
        if (timerRef.current !== null) clearInterval(timerRef.current);
      }
    }
    return () => clearInterval(timerRef.current!);
  }, [isPlaying, isPaused]);

  useEffect(() => {
    if (type === "timed" && timeLeft === 0 && isPlaying) {
      setIsPlaying(false);
      onNext(); // 👉 Chuyển sang bài tiếp theo
    }
  }, [timeLeft]);

  const handleReset = () => {
    clearInterval(timerRef.current!);
    setIsPlaying(false);
    setTimeLeft(item.duration);
    setIsPaused(false);
  };

  const handlePause = () => {
    setIsPaused(true);
    setIsPlaying(false);
  };

  const handleResume = () => {
    setIsPaused(false);
    setIsPlaying(true);
  };

  // 🧠 Xử lý khi nhấn nút chính
  const handleMainPress = () => {
    if (type === WorkoutExcerciseTypeEnum.RepBased) {
      onNext(); // reps thì bỏ qua đếm, chuyển luôn
      return;
    }

    if (timeLeft === 0) handleReset();
    else if (isPlaying) handlePause();
    else handleResume();
  };

  return (
    <SafeAreaView edges={["top"]} style={styles.container}>
      {/* Back & Settings */}
      <View style={styles.goback}>
        <ButtonGoBack
          bgColor={color.black_50}
          link="/tabs/workouts"
          borderRadius={30}
          width={42}
          height={42}
          logoSize={18}
        />
      </View>
      <View style={styles.settings}>
        <SCButton
          onPress={() => navigateCustom("/schedule/scheduleSettings")}
          bgColor={color.black_50}
          borderRadius={30}
          width={42}
          height={42}
          icon={<Ionicons name="settings" size={18} color={color.white} />}
        />
      </View>

      {/* Content */}
      <View style={styles.content}>
        <View style={styles.gifContainer}>
          <Image
            source={{ uri: item.image }}
            style={{ width: "80%", height: "80%" }}
            resizeMode="contain"
          />
        </View>

        <View style={styles.infoContainer}>
          <Text style={styles.timeText}>
            {type === WorkoutExcerciseTypeEnum.TimeBased
              ? `00:${timeLeft.toString().padStart(2, "0")}`
              : `x${item.reps}`}
          </Text>
          <Text style={styles.exerciseName}>{item.name}</Text>
        </View>

        {/* Buttons */}
        <View style={styles.clickContainer}>
          <SCButton
            bgColor={color.transparent}
            width="20%"
            height={58}
            icon={
              <Ionicons
                name="play-skip-back-circle"
                size={40}
                color={canPrev ? color.black_70 : color.black_30}
              />
            }
            onPress={() => {
              if (canPrev) onPrev();
            }}
          />

          <SCAnimatedGradientButton
            width="60%"
            height={70}
            borderRadius={28}
            icon={
              type === WorkoutExcerciseTypeEnum.TimeBased ? (
                // 🔹 Nếu là bài tập theo thời gian
                timeLeft === 0 ? (
                  <Entypo
                    name="controller-play"
                    size={28}
                    color={color.white}
                  />
                ) : isPlaying ? (
                  <Ionicons name="pause" size={24} color={color.white} />
                ) : (
                  <Entypo
                    name="controller-play"
                    size={28}
                    color={color.white}
                  />
                )
              ) : (
                // 🔹 Nếu là bài tập theo reps
                <Feather name="check" size={32} color={color.white} />
              )
            }
            title={
              type === WorkoutExcerciseTypeEnum.TimeBased
                ? timeLeft === 0
                  ? "LÀM LẠI"
                  : isPlaying
                  ? "TẠM DỪNG"
                  : "BẮT ĐẦU"
                : "HOÀN THÀNH"
            }
            fontSize={22}
            onPress={handleMainPress}
            progress={
              type === WorkoutExcerciseTypeEnum.TimeBased
                ? 1 - timeLeft / item.duration
                : 0 // reps không có progress
            }
          />

          <SCButton
            bgColor={color.transparent}
            width="20%"
            height={58}
            icon={
              <Ionicons
                name="play-skip-forward-circle"
                size={40}
                color={color.black_70}
              />
            }
            onPress={onNext}
          />
        </View>
      </View>

      {/* 🔥 Overlay Tạm Dừng */}
      {isPaused && (
        <View style={styles.pauseOverlay}>
          <Text style={styles.pauseTitle}>TẠM DỪNG</Text>

          <View style={styles.pauseButtons}>
            <TouchableOpacity
              style={[styles.pauseBtn, { backgroundColor: color.white_40 }]}
              onPress={handleReset}
            >
              <Text style={styles.pauseBtnText}>Khởi động lại bài tập này</Text>
            </TouchableOpacity>

            <TouchableOpacity
              style={[styles.pauseBtn, { backgroundColor: color.white_40 }]}
              onPress={() => console.log("🚪 Thoát ra")}
            >
              <Text style={styles.pauseBtnText}>Thoát</Text>
            </TouchableOpacity>

            <TouchableOpacity
              style={[styles.pauseBtn, styles.resumeBtn]}
              onPress={handleResume}
            >
              <Text style={styles.resumeText}>Bắt đầu lại</Text>
            </TouchableOpacity>
          </View>
        </View>
      )}
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, alignItems: "center", backgroundColor: color.white },
  goback: { position: "absolute", top: 60, left: 15, zIndex: 5 },
  settings: { position: "absolute", top: 60, right: 15, zIndex: 5 },
  content: {
    flex: 1,
    justifyContent: "flex-start",
    alignItems: "center",
    width: "100%",
  },
  gifContainer: {
    width: "100%",
    height: 500,
    borderRadius: 20,
    marginBottom: 30,
    justifyContent: "center",
    alignItems: "center",
  },
  infoContainer: {
    width: "90%",
    marginBottom: 30,
    paddingHorizontal: 5,
  },
  timeText: {
    fontSize: 56,
    fontFamily: FONTS.bold,
    textAlign: "left",
    color: color.black,
  },
  exerciseName: {
    fontSize: 20,
    fontFamily: FONTS.medium,
    textAlign: "left",
    color: color.gray,
  },
  clickContainer: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    gap: 15,
    width: "100%",
    paddingHorizontal: 10,
  },
  pauseOverlay: {
    position: "absolute",
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: color.dark_green,
    justifyContent: "center",
    alignItems: "center",
    zIndex: 10,
  },
  pauseTitle: {
    color: color.white,
    fontSize: 36,
    fontFamily: FONTS.bold,
    marginBottom: 60,
  },
  pauseButtons: {
    width: "80%",
    gap: 20,
  },
  pauseBtn: {
    paddingVertical: 16,
    borderRadius: 30,
    alignItems: "center",
  },
  pauseBtnText: {
    color: color.white,
    fontFamily: FONTS.medium,
    fontSize: 18,
  },
  resumeBtn: {
    backgroundColor: color.white,
  },
  resumeText: {
    color: color.dark_green,
    fontFamily: FONTS.bold,
    fontSize: 18,
  },
});
