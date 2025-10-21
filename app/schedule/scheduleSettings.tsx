import SCButton from "@components/ui/SCButton";
import color from "@constants/color";
import { FONTS } from "@constants/fonts";
import Feather from "@expo/vector-icons/Feather";
import { navigateCustom } from "@utils/navigation";
import { useLocalSearchParams } from "expo-router";
import { useEffect, useState } from "react";
import { Alert, StyleSheet, Text, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { getNumberData, saveNumberData } from "../../stores/asyncStorage";

export default function ScheduleSettingsScreen() {
  const [restTime, setRestTime] = useState(30);
  const [countdown, setCountdown] = useState(10);

  // Giới hạn
  const REST_MIN = 10;
  const REST_MAX = 120;
  const COUNTDOWN_MIN = 5;
  const COUNTDOWN_MAX = 15;

  // Lấy dữ liệu ban đầu
  useEffect(() => {
    (async () => {
      const savedRest = await getNumberData("restTime", 30);
      const savedCountdown = await getNumberData("countdown", 10);
      setRestTime(savedRest);
      setCountdown(savedCountdown);
    })();
  }, []);

  const handleConfirmChanges = async () => {
    await saveNumberData("restTime", restTime);
    await saveNumberData("countdown", countdown);
    Alert.alert("✅ Thành công", "Đã cập nhật cài đặt thành công!");
  };

  // Hàm cập nhật giá trị
  const updateValue = async (
    key: string,
    value: number,
    setter: (val: number) => void
  ) => {
    if (key === "restTime") {
      if (value < REST_MIN || value > REST_MAX) {
        return;
      }
    } else if (key === "countdown") {
      if (value < COUNTDOWN_MIN || value > COUNTDOWN_MAX) {
        return;
      }
    }

    setter(value);
    await saveNumberData(key, value);
  };

  const [programCheckId, setProgramCheckId] = useState<string>("");
  const [workoutId, setWorkoutId] = useState<string>("");
  const [dayNumber, setDayNumber] = useState<number>(1);

  const { programId, scheduleId, day } = useLocalSearchParams<{
    programId: string;
    scheduleId: string;
    day: string;
  }>();

  useEffect(() => {
    if (programId) {
      setProgramCheckId(programId);
    }

    if (scheduleId) {
      setWorkoutId(scheduleId);
    }
    if (day) {
      setDayNumber(Number(day));
    }
  }, []);

  return (
    <SafeAreaView edges={["top"]} style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <SCButton
          icon={<Feather name="arrow-left" size={24} color="black" />}
          width={65}
          bgColor={color.transparent}
          onPress={() =>
            navigateCustom("/schedule/scheduleDetail", {
              params: {
                programId: programCheckId,
                scheduleId: workoutId,
                day: dayNumber,
              },
            })
          }
        />
        <Text style={styles.headerTitle}>Cài đặt tập luyện</Text>
      </View>

      {/* Nội dung */}
      <View style={styles.displayBody}>
        <View style={styles.musicContainer}>
          {/* Hẹn giờ nghỉ ngơi */}
          <View style={styles.musicRow}>
            <Text style={styles.sectionTitle}>Hẹn giờ nghỉ ngơi</Text>
            <View style={styles.adjustRow}>
              <SCButton
                onPress={() =>
                  updateValue("restTime", restTime - 5, setRestTime)
                }
                title="-"
                width={32}
                height={32}
                color={color.gray}
                bgColor={
                  restTime <= REST_MIN ? color.light_gray : color.background
                }
                disabled={restTime <= REST_MIN}
              />
              <Text style={styles.valueText}>{restTime}s</Text>
              <SCButton
                onPress={() =>
                  updateValue("restTime", restTime + 5, setRestTime)
                }
                title="+"
                width={32}
                height={32}
                color={color.gray}
                bgColor={
                  restTime >= REST_MAX ? color.light_gray : color.background
                }
                disabled={restTime >= REST_MAX}
              />
            </View>
          </View>

          {/* Đếm ngược trước khi tập */}
          <View style={styles.musicRow}>
            <Text style={styles.sectionTitle}>Đếm ngược trước khi tập</Text>
            <View style={styles.adjustRow}>
              <SCButton
                onPress={() =>
                  updateValue("countdown", countdown - 5, setCountdown)
                }
                title="-"
                width={32}
                height={32}
                color={color.gray}
                bgColor={
                  countdown <= COUNTDOWN_MIN
                    ? color.light_gray
                    : color.background
                }
                disabled={countdown <= COUNTDOWN_MIN}
              />
              <Text style={styles.valueText}>{countdown}s</Text>
              <SCButton
                onPress={() =>
                  updateValue("countdown", countdown + 5, setCountdown)
                }
                title="+"
                width={32}
                height={32}
                color={color.gray}
                bgColor={
                  countdown >= COUNTDOWN_MAX
                    ? color.light_gray
                    : color.background
                }
                disabled={countdown >= COUNTDOWN_MAX}
              />
            </View>
          </View>
        </View>
        <View style={styles.confirmContainer}>
          <SCButton
            title="Xác nhận thay đổi"
            width="80%"
            height={45}
            color={color.white}
            bgColor={color.dark_green}
            onPress={handleConfirmChanges}
          />
        </View>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: color.background,
    alignItems: "center",
  },
  header: {
    flexDirection: "row",
    alignItems: "center",
    width: "100%",
    paddingHorizontal: 5,
    gap: 20,
    marginBottom: 20,
  },
  headerTitle: {
    fontSize: 18,
    fontFamily: FONTS.bold,
  },
  displayBody: {
    width: "100%",
    flex: 1,
    alignItems: "center",
    gap: 15,
  },
  musicContainer: {
    width: "98%",
    backgroundColor: color.white,
    borderRadius: 15,
    padding: 15,
    elevation: 3,
  },
  musicRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingVertical: 10,
  },
  sectionTitle: {
    fontSize: 17,
    fontFamily: FONTS.bold,
  },
  adjustRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: 10,
  },
  valueText: {
    fontSize: 16,
    fontFamily: FONTS.medium,
  },
  confirmContainer: {
    marginTop: 20,
    width: "100%",
    alignItems: "center",
  },
});
