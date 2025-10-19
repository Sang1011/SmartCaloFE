import ButtonGoBack from "@components/ui/buttonGoBack";
import ExerciseCard from "@components/ui/excerciseCard";
import ScheduleSlotItem from "@components/ui/ScheduleSlotItem";
import color from "@constants/color";
import { clearSelectedProgram, fetchProgramById } from "@features/programs";
import { RootState } from "@redux";
import { useAppDispatch, useAppSelector } from "@redux/hooks";
import { navigateCustom } from "@utils/navigation";
import { useLocalSearchParams } from "expo-router";
import { useEffect, useState } from "react";
import { Pressable, ScrollView, StyleSheet, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

export default function ScheduleScreen() {
  const fakeScheduleData = Array.from({ length: 30 }, (_, i) => ({
    day: i + 1,
    isCompleted: i < 5,
    exerciseCount: Math.floor(Math.random() * 5) + 5,
  }));

  const { programId } = useLocalSearchParams();

  const { selectedProgram, loading } = useAppSelector(
      (state: RootState) => state.program
    );
    const dispatch = useAppDispatch();
    const [proramCheckId, setProramCheckId] = useState<string>("");
  
    // 🧭 Lấy ID từ params và fetch món ăn
    useEffect(() => {
      const extractedId = Array.isArray(programId) ? programId[0] : programId;
      if (extractedId && typeof extractedId === "string") {
        setProramCheckId(extractedId);
        dispatch(fetchProgramById(extractedId));
      }
  
      return () => {
        dispatch(clearSelectedProgram());
      };
    }, [programId, dispatch]);

  return (
    <SafeAreaView edges={["top"]} style={styles.container}>
      <View style={styles.goback}>
        <ButtonGoBack bgColor={color.transparent} />
      </View>
      {selectedProgram && (
        <ExerciseCard
        title={selectedProgram.name}
        // progress={selectedProgram?.}
        image={selectedProgram.imageUrl}
        haveButton={false}
        width={"100%"}
        border={0}
        marginBottom={0}
      />
      )}
      
      <View style={styles.scheduleList}>
        <ScrollView style={styles.scheduleContent}>
          {fakeScheduleData.map((item, index) => (
            <Pressable key={index} onPress={() => navigateCustom("/schedule/scheduleDetail", {
              params: {
                scheduleId: index,
                day: item.day,
                title: selectedProgram?.name
              }
            })} >
              <ScheduleSlotItem
                day={item.day}
                isCompleted={item.isCompleted}
                exerciseCount={item.exerciseCount}
              />
            </Pressable>
          ))}
        </ScrollView>
      </View>
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
