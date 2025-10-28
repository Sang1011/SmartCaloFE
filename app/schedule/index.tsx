import ButtonGoBack from "@components/ui/buttonGoBack";
import ExerciseCard from "@components/ui/excerciseCard";
import ScheduleSlotItem from "@components/ui/ScheduleSlotItem";
import color from "@constants/color";
import { FONTS } from "@constants/fonts";
import { fetchProgramById } from "@features/programs";
import { fetchWorkoutsByProgram } from "@features/workouts";
import { RootState } from "@redux";
import { useAppDispatch, useAppSelector } from "@redux/hooks";
import { navigateCustom } from "@utils/navigation";
import { useLocalSearchParams } from "expo-router";
import { useEffect, useState } from "react";
import {
  ActivityIndicator,
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  View,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

export default function ScheduleScreen() {
  const fakeScheduleData = Array.from({ length: 30 }, (_, i) => ({
    day: i + 1,
    isCompleted: i < 5,
    exerciseCount: Math.floor(Math.random() * 5) + 5,
  }));

  const { programId } = useLocalSearchParams<{
    programId: string;
  }>();

  const { selectedProgram, loading } = useAppSelector(
    (state: RootState) => state.program
  );
  const dispatch = useAppDispatch();
  const [proramCheckId, setProramCheckId] = useState<string>("");

  const { workouts } = useAppSelector((state: RootState) => state.workout);

  useEffect(() => {
    console.log("selectedProgram", selectedProgram);
  }, [selectedProgram]);

  useEffect(() => {
    console.log("workouts", workouts);
  }, [workouts]);

  // 🧭 Lấy ID từ params và fetch món ăn
  useEffect(() => {
    if (programId) {
      setProramCheckId(programId);
      dispatch(fetchProgramById(programId));
      dispatch(fetchWorkoutsByProgram({ programId: programId }));
    }
  }, [programId, dispatch]);

  const workoutItems = workouts.slice(0, 2);

  return (
    <SafeAreaView edges={["top"]} style={styles.container}>
      {loading ? (
        // ✅ Hiển thị loading khi đang tải
        <View style={styles.loadingContainer}>
          <ActivityIndicator size="large" color={color.dark_green} />
          <Text style={styles.loadingText}>Đang tải dữ liệu...</Text>
        </View>
      ) : (
        <>
          <View style={styles.goback}>
            <ButtonGoBack bgColor={color.transparent} link="/tabs/workouts" />
          </View>
          {selectedProgram && (
            <ExerciseCard
              title={selectedProgram.name}
              image={selectedProgram.imageUrl}
              haveButton={false}
              width={"100%"}
              border={0}
              marginBottom={0}
            />
          )}

          <View style={styles.scheduleList}>
            <ScrollView style={styles.scheduleContent}>
              {fakeScheduleData.map((item, index) => {
                // ✅ LOGIC CHU KỲ (Workout 1, Workout 2, Day Off)
                const cycleIndex = index % 3; // Lấy phần dư: 0, 1, 2, 0, 1, 2...

                // Xác định dữ liệu bài tập cho ngày này
                let workoutData = undefined; // Thay null bằng undefined để dùng Optional Chaining tốt hơn
                let isDayOff = false;

                if (workoutItems.length < 2) {
                  // Nếu chưa có đủ 2 bài tập, coi tất cả là ngày nghỉ (hoặc đang loading/lỗi)
                  isDayOff = true;
                } else if (cycleIndex === 0) {
                  // Ngày 1, 4, 7... -> Workout 1
                  workoutData = workoutItems[0];
                } else if (cycleIndex === 1) {
                  // Ngày 2, 5, 8... -> Workout 2
                  workoutData = workoutItems[1];
                } else if (cycleIndex === 2) {
                  // Ngày 3, 6, 9... -> Ngày nghỉ
                  isDayOff = true;
                }

                return (
                  <Pressable
                    key={index}
                    onPress={() => {
                      // 🎯 Truyền workoutId an toàn hơn
                      if (!isDayOff && workoutData) {
                        navigateCustom("/schedule/scheduleDetail", {
                          params: {
                            programId: proramCheckId,
                            scheduleId: workoutData.id,
                            day: item.day,
                          },
                        });
                      }
                    }}
                  >
                    <ScheduleSlotItem
                      day={item.day}
                      // Lấy totalDuration hoặc exerciseCount từ workoutData nếu không phải ngày nghỉ
                      totalDurationMin={
                        isDayOff ? 0 : workoutData?.totalDurationMin
                      }
                      dayOff={isDayOff} // Truyền prop ngày nghỉ
                    />
                  </Pressable>
                );
              })}
            </ScrollView>
          </View>
        </>
      )}
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    display: "flex",
    alignItems: "center",
    flexDirection: "column",
    position: "relative",
  },
  goback: {
    position: "absolute",
    top: 50,
    left: 10,
    zIndex: 5,
  },
  loadingContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: color.white,
  },
  loadingText: {
    marginTop: 12,
    color: color.dark_green,
    fontFamily: FONTS.medium,
    fontSize: 15,
  },
  scheduleList: {
    width: "100%",
    height: "78%",
    backgroundColor: color.background,
    position: "absolute",
    bottom: 0,
    borderTopLeftRadius: 25,
    borderTopRightRadius: 25,
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
    flexDirection: "column",
  },
  scheduleContent: {
    width: "100%",
    height: "100%",
    marginVertical: 25,
  },
  slotItem: {
    padding: 20,
    height: 75,
    backgroundColor: color.white,
    borderRadius: 15,
    display: "flex",
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
  },
  dayItem: {
    flex: 0.3,
    height: "100%",
    display: "flex",
    flexDirection: "column",
    justifyContent: "center",
    alignItems: "center",
  },
  completed: {
    flex: 0.2,
    height: "100%",
    display: "flex",
    flexDirection: "column",
    justifyContent: "center",
    alignItems: "center",
  },
  marked: {
    flex: 0.5,
    height: "100%",
    display: "flex",
    justifyContent: "flex-end",
    flexDirection: "row",
    alignItems: "center",
  },
  buttonCheck: {
    width: 48,
    height: 48,
    display: "flex",
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
  },
});
