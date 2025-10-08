import ButtonGoBack from "@components/ui/buttonGoBack";
import ExerciseCard from "@components/ui/excerciseCard";
import ScheduleSlotItem from "@components/ui/ScheduleSlotItem";
import color from "@constants/color";
import { navigateCustom } from "@utils/navigation";
import { useLocalSearchParams } from "expo-router";
import { Pressable, ScrollView, StyleSheet, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

export default function ScheduleScreen() {
  const fakeScheduleData = Array.from({ length: 30 }, (_, i) => ({
    day: i + 1,
    isCompleted: i < 5,
    exerciseCount: Math.floor(Math.random() * 5) + 5,
  }));

  const params = useLocalSearchParams<{
    title?: string;
    day?: string;
    info?: string;
    progress?: string;
    image?: string;
  }>();

  const title = params.title ?? "Bài tập";
  const day = params.day ?? "Ngày 1";
  const info = params.info ?? "";
  const image = params.image ?? "";
  const progress = params.progress
    ? JSON.parse(params.progress)
    : { current: 0, total: 1 };

  return (
    <SafeAreaView edges={["top"]} style={styles.container}>
      <View style={styles.goback}>
        <ButtonGoBack bgColor={color.transparent} link="/tabs" />
      </View>
      <ExerciseCard
        title={title}
        progress={progress}
        image={image ? image : require("../../assets/images/dumbbell.png")}
        haveButton={false}
        width={"100%"}
        border={0}
        marginBottom={0}
      />
      <View style={styles.scheduleList}>
        <ScrollView style={styles.scheduleContent}>
          {fakeScheduleData.map((item) => (
            <Pressable onPress={() => navigateCustom("/schedule/scheduleDetail", {
              params: {
                scheduleId: "1"
              }
            })} >
              <ScheduleSlotItem
                key={item.day}
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
