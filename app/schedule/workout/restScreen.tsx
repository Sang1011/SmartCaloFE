import SCButton from "@components/ui/SCButton";
import color from "@constants/color";
import { FONTS } from "@constants/fonts";
import Ionicons from "@expo/vector-icons/Ionicons";
import { getNumberData } from "@stores";
import { navigateCustom } from "@utils/navigation";
import { useEffect, useState } from "react";
import { StyleSheet, Text, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { WorkoutExcerciseTypeEnum } from "../../../types/workoutExcercise";

interface NormalizedExercise {
  id: string;
  name: string;
  image: string;
  type: WorkoutExcerciseTypeEnum;
  duration?: number;
  reps?: number;
}

export default function RestScreen({ duration, onNext, nextItem }: { duration: number; onNext: () => void, nextItem: NormalizedExercise | null }) {
  const [restTime, setRestTime] = useState(duration);

  useEffect(() => {
    (async () => {
      const savedRest = await getNumberData("restTime", 30);
      setRestTime(savedRest);
    })();
  }, []);

  useEffect(() => {
    if (restTime <= 0) onNext();
    else {
      const timer = setInterval(() => setRestTime(p => p - 1), 1000);
      return () => clearInterval(timer);
    }
  }, [restTime]);

  const handlePlus20Seconds = () => {
    setRestTime((prev) => prev + 20);
  };

  const handleSkipRest = () => {
    onNext();
  };

  // 🧮 Định dạng 00:00
  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins.toString().padStart(2, "0")}:${secs
      .toString()
      .padStart(2, "0")}`;
  };

  return (
    <SafeAreaView edges={["top"]} style={styles.container}>
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

      <View style={styles.content}>
        <Text style={styles.title}>NGHỈ NGƠI</Text>

        {/* Hiển thị thời gian đếm ngược dạng 00:00 */}
        <Text style={styles.time}>{formatTime(restTime)}</Text>

        <View style={styles.buttonGroup}>
          <SCButton
            title="+20s"
            onPress={handlePlus20Seconds}
            bgColor={color.white_40}
            borderRadius={15}
            width={160}
            height={60}
            fontSize={18}
          />
          <SCButton
            title="Bỏ qua"
            onPress={handleSkipRest}
            bgColor={color.white}
            color={color.dark_green}
            borderRadius={15}
            width={160}
            height={60}
            fontSize={18}
            fontFamily={FONTS.bold}
          />
        </View>

        <Text style={styles.nextDes}>
          Tiếp theo: {nextItem?.name} {nextItem?.type === WorkoutExcerciseTypeEnum.RepBased ? `x${nextItem.reps}` : `${nextItem?.duration}:00 giây`}
        </Text>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: "center",
    backgroundColor: color.dark_green,
  },
  settings: { position: "absolute", top: 60, right: 15, zIndex: 5 },
  content: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    width: "100%",
  },
  buttonGroup: {
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
    width: "90%",
    height: 90,
    gap: 15,
  },
  title: {
    fontSize: 20,
    fontFamily: FONTS.semiBold,
    color: color.white,
  },
  time: {
    fontSize: 64,
    fontFamily: FONTS.bold,
    lineHeight: 76,
    color: color.white,
  },
  nextDes: {
    fontSize: 18,
    fontFamily: FONTS.medium,
    color: color.white,
    textAlign: "center",
    paddingHorizontal: 30,
    marginTop: 50,
  },
});
