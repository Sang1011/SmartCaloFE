import ButtonGoBack from "@components/ui/buttonGoBack";
import ExerciseCard from "@components/ui/excerciseCard";
import SCButton from "@components/ui/SCButton";
import ScheduleBody from "@components/ui/scheduleBody";
import color from "@constants/color";
import { FONTS } from "@constants/fonts";
import MaterialIcons from "@expo/vector-icons/MaterialIcons";
import { fetchExerciseById } from "@features/excercises";
import { fetchProgramById } from "@features/programs";
import { fetchCurrentUserThunk } from "@features/users";
import { fetchWorkoutsExcericeByWorkout } from "@features/workouExcercise";
import { fetchWorkoutById } from "@features/workouts";
import { RootState } from "@redux";
import { useAppDispatch, useAppSelector } from "@redux/hooks";
import { navigateCustom } from "@utils/navigation";
import { useLocalSearchParams } from "expo-router";
import { useEffect, useState } from "react";
import {
  ActivityIndicator,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { Exercise } from "../../types/excercise";
import { WorkoutExcerciseDTO } from "../../types/workoutExcercise";


export default function ScheduleDetailScreen() {
  const [programCheckId, setProgramCheckId] = useState<string>("");
  const [workoutId, setWorkoutId] = useState<string>("");
  const [dayNumber, setDayNumber] = useState<number>(1);
  const [loading, setLoading] = useState<boolean>(true);


  const dispatch = useAppDispatch();
  const { currentWorkout } = useAppSelector(
    (state: RootState) => state.workout
  );
  const { selectedProgram } = useAppSelector(
    (state: RootState) => state.program
  );

  const { workoutExcercise } = useAppSelector(
    (state: RootState) => state.workoutExcercise
  );
  const { user } = useAppSelector((state: RootState) => state.user);

  const { programId, scheduleId, day } = useLocalSearchParams<{
    programId: string;
    scheduleId: string;
    day: string;
  }>();

  const [workoutExcericeList, setWorkoutExcericeList] = useState<WorkoutExcerciseDTO[]>([]);


  const handleFetchManyRequest = async (
    workoutExcercise: WorkoutExcerciseDTO[]
  ) => {
    if (!workoutExcercise || workoutExcercise.length === 0) return;
  
    try {
      // Gọi tất cả API song song và merge dữ liệu
      const responses = await Promise.all(
        workoutExcercise.map(async (item) => {
          const result = await dispatch(fetchExerciseById(item.exerciseId));
  
          if (fetchExerciseById.fulfilled.match(result)) {
            const exercise = result.payload as Exercise;
  
            // 👉 Gộp dữ liệu từ cả hai nguồn
            return {
              ...item,
              sets: item.sets,
              reps: item.reps,
              exerciseName: exercise.name, 
              exerciseGifUrl: exercise.gifUrl,
              metValue: item.metValue,
              durationMin: item.durationMin,
              type: item.type,
            };
          } else {
            console.warn(`❌ Không fetch được exercise có ID: ${item.exerciseId}`);
            return null;
          }
        })
      );

      const validExercises = responses.filter(
        (item): item is WorkoutExcerciseDTO => item !== null
      );
      setWorkoutExcericeList(validExercises);
    } catch (error) {
      console.error("Lỗi khi fetch nhiều exercise:", error);
    }
  };

  const fetchData = async () => {
    await dispatch(fetchProgramById(programId));
    await dispatch(fetchWorkoutById(scheduleId));
    await dispatch(fetchWorkoutsExcericeByWorkout({ workoutId: scheduleId }));
    await dispatch(fetchCurrentUserThunk());
  };
  useEffect(() => {
    const init = async () => {
      setLoading(true); // ✅ bật loading khi bắt đầu

      try {
        if (programId) setProgramCheckId(programId);
        if (day) setDayNumber(Number(day));
        if (scheduleId) {
          setWorkoutId(scheduleId);
          await fetchData();
          await handleFetchManyRequest(workoutExcercise);
        }
      } catch (err) {
        console.error("❌ Lỗi khi load dữ liệu:", err);
      } finally {
        setLoading(false); // ✅ chỉ tắt khi mọi thứ xong
      }
    };

    init();
  }, []);

  useEffect(() => {
    if (workoutExcercise && workoutExcercise.length > 0) {
      handleFetchManyRequest(workoutExcercise).finally(() => {
        setLoading(false); // 👈 chỉ tắt loading khi xong tất cả
      });
    }
  }, [workoutExcercise]);

  return (
    <SafeAreaView edges={["top"]} style={styles.container}>
      {loading ? (
        // ✅ Hiển thị loading khi đang tải
        <View style={styles.loadingContainer}>
          <ActivityIndicator size="large" color={color.dark_green} />
          <Text style={styles.loadingText}>Đang tải bài tập...</Text>
        </View>
      ) : (
        <ScrollView showsVerticalScrollIndicator={false} style={{ flex: 1 }}>
          <View style={styles.goback}>
            <ButtonGoBack
              bgColor={color.transparent}
              handleLogic={() => {
                navigateCustom("/schedule", {
                  params: {
                    programId: programCheckId,
                  },
                });
              }}
            />
          </View>

          <ExerciseCard
            title={selectedProgram?.name || ""}
            image={selectedProgram?.imageUrl}
            haveButton={false}
            day={dayNumber}
            width={"100%"}
            border={0}
            marginBottom={0}
          />

          <View style={styles.scheduleList}>
            <View style={styles.scheduleHeader}>
              <View style={styles.item}>
                <Text style={styles.title}>Thời lượng tối thiểu</Text>
                <Text style={styles.value}>
                  {currentWorkout?.totalDurationMin} phút
                </Text>
              </View>
            </View>
            <TouchableOpacity
              style={styles.option}
              onPress={() => {
                console.log("Go to setting");
                navigateCustom("/schedule/scheduleSettings", {
                  params: {
                    programId: programCheckId,
                    scheduleId: workoutId,
                    day: dayNumber,
                  },
                });
              }}
            >
              <Text style={styles.optionText}>Cài đặt tập luyện</Text>
              <MaterialIcons name="navigate-next" size={24} color="black" />
            </TouchableOpacity>
            <ScheduleBody
              key={currentWorkout?.id}
              data={workoutExcericeList}
            />
          </View>
        </ScrollView>
      )}
      {loading ? (
        <></>
      ) : (
        <View style={{ width: "80%", height: 55 }}>
          <SCButton
            title="Bắt đầu tập luyện"
            onPress={() => {
              navigateCustom("/schedule/workout", {
                params: {
                  workoutIf: workoutId,
                  workoutExcerciseList: JSON.stringify(workoutExcericeList)
                },
              });
            }}
          />
        </View>
      )}
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, alignItems: "center", backgroundColor: color.white },
  goback: { position: "absolute", top: 10, left: 5, zIndex: 5 },
  scheduleList: {
    flex: 1,
    width: "100%",
    borderTopLeftRadius: 25,
    borderTopRightRadius: 25,
    transform: [{ translateY: -25 }],
    backgroundColor: color.white,
    alignItems: "center",
    paddingTop: 10,
    paddingBottom: 60,
  },
  scheduleHeader: {
    width: "100%",
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
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
  item: {
    width: "100%",
    height: 75,
    justifyContent: "center",
    alignItems: "center",
  },
  title: { fontSize: 14, fontFamily: FONTS.regular },
  value: { fontSize: 16, fontFamily: FONTS.bold },
  divider: { width: 1, height: "75%", backgroundColor: color.border },
  option: {
    width: "98%",
    height: 50,
    marginTop: 10,
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingHorizontal: 15,
  },
  optionText: { fontSize: 18, fontFamily: FONTS.bold },
  buttonHolder: {
    position: "absolute",
    bottom: 0,
    left: 0,
    height: 84,
    width: "100%",
    justifyContent: "center",
    alignItems: "center",
    borderTopColor: color.border,
    backgroundColor: color.white,
  },
});
